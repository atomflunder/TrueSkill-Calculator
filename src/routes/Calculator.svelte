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

	const addPlayerToTeam = (teamIndex: number) => {
		if (currentTeams[teamIndex].players.length < 20) {
			currentTeams[teamIndex].players.push(getDefaultPlayer(defaultMu, defaultSigma));
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
		let mu = currentTeams[teamIndex].players[playerIndex].mu;
		let sigma = currentTeams[teamIndex].players[playerIndex].sigma;

		if (newMu !== undefined) {
			mu = newMu;
		}
		if (newSigma !== undefined) {
			sigma = newSigma;
		}

		currentTeams[teamIndex].players[playerIndex] = new Rating(mu, sigma);

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
<table class="main">
	<tr>
		<th>Team Name</th>
		<th>Rank</th>
		<th>Player Mu (μ) & Sigma (σ)</th>
	</tr>
	{#each currentTeams as team, i}

		<tr>

			<td>
				<input
					type="text"
					bind:value={team.name}
					on:input={() => {
						refreshCalculations();
					}}
				/>
			</td>
			<td>
				<input
					type="number"
					bind:value={team.rank}
					on:input={() => {
						refreshCalculations();
					}}
				/>
			</td>

			<td>
				{#each team.players as player, j}
					<!-- TODO: Add support for player names -->
					<p style="display: inline;">Player {j + 1}:</p>
					<input
						type="number"
						value={player.mu}
						on:input={(event) => {
							if (event.target instanceof HTMLInputElement) {
								updatePlayerInTeam(i, j, Number(event.target.valueAsNumber), undefined);
							}
						}}
					/>
					<input
						type="number"
						value={player.sigma}
						on:input={(event) => {
							if (event.target instanceof HTMLInputElement) {
								updatePlayerInTeam(i, j, undefined, Number(event.target.valueAsNumber));
							}
						}}
					/>
					<br />
				{/each}
			</td>
			<button class="player-add-button" on:click={() => addPlayerToTeam(i)}> Add Player to {team.name} </button>
			<button class="player-remove-button" on:click={() => removePlayerFromTeam(i)}>
				Remove Player from {team.name}
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
<table class="main">
	<tr>
		<th>Team Name</th>
		<th>Rank</th>
		<th>Player Mu (μ) & Sigma (σ)</th>
	</tr>
	{#each newTeams as team, i}
		<tr>
			<td>
				<input type="text" bind:value={team.name} readonly />
			</td>
			<td>
				<input type="text" bind:value={team.rank} readonly />
			</td>

			<td>
				{#each team.players as player, j}
					<p style="display: inline;">Player {j + 1}:</p>
					<input type="text" value={player.mu} />
					<input type="text" value={player.sigma} />
					<br />
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

	.header {
		margin-left: 400px;
		font-size: 36px;
		padding: 0 15px;
	}

	:global(body) {
		background-color: #161616;
		font-family: 'Trebuchet MS', Verdana, Tahoma, sans-serif;
		color: #f2f2f2;
	}
</style>
