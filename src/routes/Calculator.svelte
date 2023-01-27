<script lang="ts">
	import { TrueSkill, Rating } from 'ts-trueskill';
	import { getDefaultTeam, getFirstTwoTeams, type Team } from '../Teams';
	import { calculateRatings, matchQuality, updateCalculations } from '../TrueSkill';
	import { getDefaultPlayer } from '../Players';
	import Sidebar from './Sidebar.svelte';

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
			currentTeams = currentTeams;
			refreshCalculations();
		}
	};

	const decreaseTeamCount = () => {
		if (teamCount > 2) {
			teamCount -= 1;
			currentTeams.pop();
			currentTeams = currentTeams;
			refreshCalculations();
		}
	};

	const addPlayerToTeam = (teamIndex: number, playerIndex: number) => {
		if (currentTeams[teamIndex].players.length < 20) {
			currentTeams[teamIndex].players.push(getDefaultPlayer(defaultMu, defaultSigma, playerIndex));
			currentTeams = currentTeams;
			refreshCalculations();
		}
	};

	const removePlayerFromTeam = (teamIndex: number) => {
		if (currentTeams[teamIndex].players.length > 1) {
			currentTeams[teamIndex].players.pop();
			currentTeams = currentTeams;
			refreshCalculations();
		}
	};

	const updatePlayerInTeam = (
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

		currentTeams = currentTeams;
		refreshCalculations();
	};

	const changePlayerName = (teamIndex: number, playerIndex: number, newName: string) => {
		currentTeams[teamIndex].players[playerIndex].name = newName;
		currentTeams = currentTeams;
		refreshCalculations();
	};

	const refreshCalculations = () => {
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

<button class="team-add-button" on:click={() => incrementTeamCount()}> Add New Team </button>
<button class="team-remove-button" on:click={() => decreaseTeamCount()}> Remove Team </button>

<p class="main"><b>Starting Teams: ({teamCount})</b></p>
<table class="main-table">
	<th>Team Name</th>
	<th>Rank</th>
	<th>Players</th>
	<th>Mu (μ)</th>
	<th>Sigma (σ)</th>

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
					bind:value={team.rank}
					on:input={() => {
						refreshCalculations();
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
									changePlayerName(i, j, event.target.value);
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
							value={player.rating.mu}
							on:input={(event) => {
								if (event.target instanceof HTMLInputElement) {
									updatePlayerInTeam(i, j, Number(event.target.valueAsNumber), undefined);
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
							value={player.rating.sigma}
							on:input={(event) => {
								if (event.target instanceof HTMLInputElement) {
									updatePlayerInTeam(i, j, undefined, Number(event.target.valueAsNumber));
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
	<th>Team Name</th>
	<th>Rank</th>
	<th>Players</th>
	<th>Mu (μ)</th>
	<th>Sigma (σ)</th>

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
		font-size: 15px;
		background-color: #95ff8b;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.player-remove-button {
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

	tr:nth-child(odd) {
		background-color: #202020;
	}

	:global(body) {
		background-color: #161616;
		font-family: 'Trebuchet MS', Verdana, Tahoma, sans-serif;
		color: #f2f2f2;
	}
</style>
