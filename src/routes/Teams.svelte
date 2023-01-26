<script lang="ts">
	import { TrueSkill, Rating } from 'ts-trueskill';
	import { getDefaultTeam, type Team } from '../Teams.js';
	import { calculateRatings, matchQuality } from '../TrueSkill.js';
	import { getDefaultPlayer } from '../Players.js';

	let defaultMu = 25;
	let defaultSigma = 25 / 3;
	let betaValue = 25 / 6;
	let tauValue = betaValue / 2;
	let drawProbability = 0.1;

	let env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);

	export let teamCount = 2;

	export let currentTeams: Team[] = [
		{
			name: 'Team 1',
			players: [
				getDefaultPlayer(defaultMu, defaultSigma),
				getDefaultPlayer(defaultMu, defaultSigma)
			],
			rank: 1
		},
		{
			name: 'Team 2',
			players: [
				getDefaultPlayer(defaultMu, defaultSigma),
				getDefaultPlayer(defaultMu, defaultSigma)
			],
			rank: 2
		}
	];

	export let newTeams: Team[] = calculateRatings(env, currentTeams);
	export let quality = matchQuality(env, currentTeams);

	const incrementTeamCount = () => {
		if (teamCount < 50) {
			teamCount += 1;
			const newTeam = getDefaultTeam(defaultMu, defaultSigma, teamCount);
			currentTeams.push(newTeam);
			currentTeams = currentTeams;
			updateCalculations();
		}
	};

	const decreaseTeamCount = () => {
		if (teamCount > 2) {
			teamCount -= 1;
			currentTeams.pop();
			currentTeams = currentTeams;
			updateCalculations();
		}
	};

	const addPlayerToTeam = (teamIndex: number) => {
		if (currentTeams[teamIndex].players.length < 20) {
			currentTeams[teamIndex].players.push(getDefaultPlayer(defaultMu, defaultSigma));
			currentTeams = currentTeams;
			updateCalculations();
		}
	};

	const removePlayerFromTeam = (teamIndex: number) => {
		if (currentTeams[teamIndex].players.length > 1) {
			currentTeams[teamIndex].players.pop();
			currentTeams = currentTeams;
			updateCalculations();
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
		updateCalculations();
	};

	export const updateCalculations = function () {
		env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);
		newTeams = calculateRatings(env, currentTeams);
		quality = matchQuality(env, currentTeams);
	};
</script>

<h1>TrueSkill Online Calculator</h1>
<div class="box">
	<h2>Current Config:</h2>
	<p>Hover over the values to see the explanation.</p>
	<table>
		<tr>
			<td title="The default Value of Mu (μ) for new players."> Default Mu (μ):</td>
			<td>
				<input
					type="number"
					bind:value={defaultMu}
					on:input={() => {
						updateCalculations();
					}}
				/>
			</td>
		</tr>
		<tr>
			<td title="The default Value of Sigma (σ) for new players.">Default Sigma (σ):</td>
			<td>
				<input
					type="number"
					bind:value={defaultSigma}
					on:input={() => {
						updateCalculations();
					}}
				/>
			</td>
		</tr>
		<tr>
			<td
				title="The distance in rating points to guarantee about a 76% chance of winning for the higher rated player."
			>
				Beta (β):</td
			>
			<td>
				<input
					type="number"
					bind:value={betaValue}
					on:input={() => {
						updateCalculations();
					}}
				/>
			</td>
		</tr>
		<tr>
			<td title="The additive dynamics factor, the higher the value, the more dynamic the ratings.">
				Tau (τ):</td
			>
			<td>
				<input
					type="number"
					bind:value={tauValue}
					on:input={() => {
						updateCalculations();
					}}
				/>
			</td>
		</tr>
		<tr>
			<td title="The chance of a draw occurring in your game."> Draw Probability:</td>
			<td>
				<input
					type="number"
					bind:value={drawProbability}
					on:input={() => {
						updateCalculations();
					}}
				/>
			</td>
		</tr>
	</table>
</div>

<button on:click={() => incrementTeamCount()}> Add Team </button>
<button on:click={() => decreaseTeamCount()}> Remove Team </button>
<p><b>Starting Teams: ({teamCount})</b></p>
<table>
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
						updateCalculations();
					}}
				/>
			</td>
			<td>
				<input
					type="number"
					bind:value={team.rank}
					on:input={() => {
						updateCalculations();
					}}
				/>
			</td>

			<td>
				{#each team.players as player, j}
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
		</tr>
		<button on:click={() => addPlayerToTeam(i)}> Add Player </button>
		<button on:click={() => removePlayerFromTeam(i)}> Remove Player </button>
	{/each}
</table>
<br />
<div
	title="The match quality is the chance of a draw occurring in the given game. The higher the value, the closer the game will be."
>
	Match Quality: {quality}
</div>
<p><b>Resulting Teams: ({teamCount})</b></p>
<table>
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
					<input type="text" value={player.mu} readonly />

					<input type="text" value={player.sigma} readonly />
					<br />
				{/each}
			</td>
		</tr>
	{/each}
</table>

<style>
	.box {
		border: 1px solid black;
		padding: 10px;
		margin: 10px;
		background: #f2f2f2;
	}

	td {
		padding: 10px;
		background: #f2f2f2;
	}
</style>
