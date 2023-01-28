<script lang="ts">
	import { TrueSkill, Rating } from 'ts-trueskill';
	import { getDefaultTeam, getFirstTwoTeams, teamToCsv, type Team } from '../Teams';
	import { calculateRatings, matchQuality, updateCalculations } from '../TrueSkill';
	import { getDefaultPlayer } from '../Players';
	import Sidebar from './Sidebar.svelte';
	import { copyMessage } from '../Copy';

	let defaultMu = 25;
	let defaultSigma = 25 / 3;
	let betaValue = 25 / 6;
	let tauValue = defaultSigma / 100;
	let drawProbability = 0.1;

	let env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);

	export let teamCount = 2;
	export let currentTeams: Team[] = getFirstTwoTeams(defaultMu, defaultSigma);

	export let newTeams: Team[] = calculateRatings(env, currentTeams);
	export let quality = matchQuality(env, currentTeams);

	const incrementTeamCount = () => {
		if (teamCount < 50) {
			teamCount += 1;
			const newTeam = getDefaultTeam(defaultMu, defaultSigma, teamCount);
			currentTeams.push(newTeam);
			refreshCalculations();
		}
	};

	const decreaseTeamCount = () => {
		if (teamCount > 2) {
			teamCount -= 1;
			currentTeams.pop();
			refreshCalculations();
		}
	};

	const addPlayerToTeam = (teamIndex: number, playerIndex: number) => {
		if (currentTeams[teamIndex].players.length < 20) {
			currentTeams[teamIndex].players.push(getDefaultPlayer(defaultMu, defaultSigma, playerIndex));
			refreshCalculations();
		}
	};

	const removePlayerFromTeam = (teamIndex: number) => {
		if (currentTeams[teamIndex].players.length > 1) {
			currentTeams[teamIndex].players.pop();
			refreshCalculations();
		}
	};

	const updatePlayerMuSigma = (
		teamIndex: number,
		playerIndex: number,
		newMu: number | undefined,
		newSigma: number | undefined
	) => {
		let mu = currentTeams[teamIndex].players[playerIndex].rating.mu;
		let sigma = currentTeams[teamIndex].players[playerIndex].rating.sigma;

		if (newMu !== undefined) {
			mu = newMu;
		}
		if (newSigma !== undefined) {
			sigma = newSigma;
		}

		currentTeams[teamIndex].players[playerIndex].rating = new Rating(mu, sigma);
		refreshCalculations();
	};

	const updatePlayerName = (teamIndex: number, playerIndex: number, newName: string) => {
		currentTeams[teamIndex].players[playerIndex].name = newName;
		refreshCalculations();
	};

	const updatePlayerWeight = (teamIndex: number, playerIndex: number, newWeight: number) => {
		if (newWeight < 0) {
			newWeight = 0;
		} else if (newWeight > 1) {
			newWeight = 1;
		}

		currentTeams[teamIndex].players[playerIndex].weight = newWeight;
		refreshCalculations();
	};

	const updateTeamRanks = (teamIndex: number, newRank: number) => {
		if (newRank < 1 || !newRank) {
			newRank = 1;
		} else if (newRank > teamCount) {
			newRank = teamCount;
		}

		currentTeams[teamIndex].rank = newRank;
		refreshCalculations();
	};

	const refreshCalculations = () => {
		currentTeams = currentTeams;
		[env, newTeams, quality] = updateCalculations(
			defaultMu,
			defaultSigma,
			betaValue,
			tauValue,
			drawProbability,
			currentTeams,
			env,
			newTeams,
			quality
		);
	};
</script>

<title>TrueSkill Calculator</title>
<h1 class="header">TrueSkill Calculator</h1>
<Sidebar
	bind:env
	bind:defaultMu
	bind:defaultSigma
	bind:betaValue
	bind:tauValue
	bind:drawProbability
	bind:currentTeams
	bind:newTeams
	bind:quality
/>
<table>
	<tr>
		<td>
			<button class="team-add-button" on:click={() => incrementTeamCount()}> Add New Team </button>
		</td>
		<td>
			<button class="team-remove-button" on:click={() => decreaseTeamCount()}> Remove Team </button>
		</td>
	</tr>
</table>

<p class="main"><b>Starting Teams: ({teamCount})</b></p>
<table class="main-table">
	<th title="The Name of the Team.">Team Name</th>
	<th title="The Rank, or the Placement of the Team. The lower the better.">Rank</th>
	<th title="The Names of the Players of this Team.">Players</th>
	<th title="The Mu (μ) Value of the Player.">Mu (μ)</th>
	<th title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
	<th
		title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
		>Weight</th
	>
	<tr />

	{#each currentTeams as team, i}
		<tr>
			<td>
				<input
					class="input"
					type="text"
					bind:value={team.name}
					on:input={() => {
						refreshCalculations();
					}}
				/>
			</td>
			<td>
				<input
					class="input"
					type="number"
					min="1"
					max={teamCount}
					value={team.rank}
					on:input={(event) => {
						if (event.target instanceof HTMLInputElement) {
							updateTeamRanks(i, parseInt(event.target.value));
						}
					}}
				/>
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input
							class="input"
							type="text"
							value={player.name}
							on:input={(event) => {
								if (event.target instanceof HTMLInputElement) {
									updatePlayerName(i, j, event.target.value);
								}
							}}
						/>
					</tr>
				{/each}
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input
							class="input"
							type="number"
							step="0.1"
							value={player.rating.mu}
							on:input={(event) => {
								if (event.target instanceof HTMLInputElement) {
									updatePlayerMuSigma(i, j, Number(event.target.valueAsNumber), undefined);
								}
							}}
						/>
					</tr>
				{/each}
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input
							class="input"
							type="number"
							step="0.01"
							value={player.rating.sigma}
							on:input={(event) => {
								if (event.target instanceof HTMLInputElement) {
									updatePlayerMuSigma(i, j, undefined, Number(event.target.valueAsNumber));
								}
							}}
						/>
					</tr>
				{/each}
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input
							class="input"
							type="number"
							max="1"
							min="0"
							step="0.01"
							value={player.weight}
							on:input={(event) => {
								if (event.target instanceof HTMLInputElement) {
									updatePlayerWeight(i, j, Number(event.target.valueAsNumber));
								}
							}}
						/>
					</tr>
				{/each}
			</td>
			<button
				class="player-add-button"
				on:click={() => addPlayerToTeam(i, team.players.length + 1)}
			>
				Add Player to Team
			</button>
			<button class="player-remove-button" on:click={() => removePlayerFromTeam(i)}>
				Remove Player from Team
			</button>
		</tr>
	{/each}
</table>
<br />
<br />
<hr />
<div
	title="The match quality is the chance of a draw occurring in the given game. The higher the value, the closer the game will be."
	class="quality"
>
	Match Quality: {quality}
</div>
<hr />
<br />
<p class="main"><b>Resulting Teams: ({teamCount})</b></p>
<table class="main-table">
	<th title="The Name of the Team.">Team Name</th>
	<th title="The Rank, or the Placement of the Team. The lower the better.">Rank</th>
	<th title="The Names of the Players of this Team.">Players</th>
	<th title="The Mu (μ) Value of the Player.">Mu (μ)</th>
	<th title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
	<th
		title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
		>Weight</th
	>
	<tr />

	{#each newTeams as team, i}
		<tr>
			<td>
				<input class="input" type="text" value={team.name} readonly />
			</td>
			<td>
				<input class="input" type="number" value={team.rank} readonly />
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input class="input" type="text" value={player.name} readonly />
					</tr>
				{/each}
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input class="input" type="number" value={player.rating.mu} readonly />
					</tr>
				{/each}
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input class="input" type="number" value={player.rating.sigma} readonly />
					</tr>
				{/each}
			</td>
			<td>
				{#each team.players as player, j}
					<tr>
						<input class="input" type="number" value={player.weight} readonly />
					</tr>
				{/each}
			</td>
			<button
				title="Copy Team as CSV"
				class="copy-team"
				on:click={() => {
					copyMessage(teamToCsv(newTeams[i]));
					const button = document.getElementsByClassName('copy-team')[i];
					button.innerHTML = '✔️';
					setTimeout(() => {
						button.innerHTML = '📋';
					}, 1000);
				}}
			>
				📋
			</button>
		</tr>
	{/each}
</table>

<style>
	.team-add-button {
		margin-left: 420px;
		font-size: 24px;
		padding: 8px;
		background-color: #95ff8b;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.team-remove-button {
		margin-left: 50px;
		font-size: 24px;
		padding: 8px;
		background-color: #ff8a8a;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.player-add-button {
		margin-left: 10px;
		font-size: 15px;
		background-color: #95ff8b;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.player-remove-button {
		margin-left: 10px;
		font-size: 15px;
		background-color: #ff8a8a;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.team-add-button:hover {
		background-color: #7aee70;
	}

	.team-remove-button:hover {
		background-color: #e26767;
	}

	.player-add-button:hover {
		background-color: #7aee70;
	}

	.player-remove-button:hover {
		background-color: #e26767;
	}

	.quality {
		margin-left: 400px;
		font-size: 28px;
		padding: 0 15px;
	}

	.main {
		margin-left: 400px;
		font-size: 28px;
		padding: 0 15px;
	}

	.main-table {
		margin-left: 400px;
		font-size: 28px;
		padding: 0 15px;
		border-collapse: collapse;
	}

	.main-table td {
		padding: 4px;
	}

	.main-table th {
		padding: 8px;
	}

	.main-table tr:nth-child(odd) {
		background-color: #202020;
	}

	.header {
		margin-left: 400px;
		font-size: 36px;
		padding: 0 15px;
	}

	.input {
		background-color: #414244;
		font-size: large;
		color: #f2f2f2;
		border: 0px;
		padding: 6px;
		border-radius: 4px;
	}

	.copy-team {
		background-color: #414244;
		margin-left: 10px;
		margin-top: 4px;
		font-size: large;
		color: #f2f2f2;
		border: 0px;
		padding: 6px;
		border-radius: 4px;
	}

	.copy-team:hover {
		background-color: #2f2f31;
	}
</style>
