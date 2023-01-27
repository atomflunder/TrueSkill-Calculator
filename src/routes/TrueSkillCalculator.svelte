<script lang="ts">
	import { TrueSkill, Rating } from 'ts-trueskill';
	import { getDefaultTeam, getFirstTwoTeams, type Team } from '../Teams';
	import { calculateRatings, matchQuality } from '../TrueSkill';
	import { getDefaultPlayer } from '../Players';

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

<title>TrueSkill Calculator</title>
<h1 class="header">TrueSkill Calculator</h1>
<div class="sidenav">
	<h2>Current Config:</h2>
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
					class="config-input"
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
					class="config-input"
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
					class="config-input"
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
					class="config-input"
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
					class="config-input"
				/>
			</td>
		</tr>
	</table>
	<p><b>Explanation of the values: </b></p>
	<ul>
		<li>
			<b>Default Mu (μ):</b> The default Value of Mu (μ) for new players. By default set to 25.
		</li>
		<li>
			<b>Default Sigma (σ)</b> The default Value of Sigma (σ) for new players. By default set to 25/3
			≈ 8.333.
		</li>
		<li>
			<b>Beta (β):</b> The distance in rating points to guarantee about a 76% chance of winning for the
			higher rated player. By default set to 25/6 ≈ 4.167
		</li>
		<li>
			<b>Tau (τ):</b> The additive dynamics factor, the higher the value, the more dynamic the ratings.
			By default set to 25/300 ≈ 0.083
		</li>
		<li>
			<b>Draw Probability:</b> The chance of a draw occurring in your game. By default set to 0.1.
		</li>
	</ul>

	<p><b>How to use the calculator: </b></p>
	<p>
		Add or remove Teams and assign each the correct number of players present in your game.<br
		/>Then assign each Team the correct Rank, meaning Placement in the game. The lower the rank, the
		better. <br />
		If two or more Teams draw with each other, assign them the same rank. <br />
		The expected results will appear in the <b>Resulting Teams</b> section. <br />
		Also, you can see the <b>Match Quality</b> which is the percent chance of your match ending in a
		draw. The higher this value, the closer your match will be.
	</p>
</div>

<button class="team-add-button" on:click={() => incrementTeamCount()}> Add Team </button><button class="team-remove-button" on:click={() => decreaseTeamCount()}> Remove Team </button>

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
		</tr>
		<button on:click={() => addPlayerToTeam(i)}> Add Player </button>
		<button on:click={() => removePlayerFromTeam(i)}> Remove Player </button>
	{/each}
</table>
<br />
<div
	title="The match quality is the chance of a draw occurring in the given game. The higher the value, the closer the game will be."
	class="main"
>
	Match Quality: {quality}
</div>
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
	.sidenav {
		height: 100%;
		width: 360px;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		overflow-x: hidden;
		border: 1px solid black;
		padding: 10px;
		background: #202020;
	}

	.config-input {
		background-color: #414244;
		font-size: large;
		color: #f2f2f2;
		border: 0px;
		padding: 5px;
	}

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

	.team-add-button:hover {
		background-color: #7aee70;
	}

	.team-remove-button:hover {
		background-color: #e26767;
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
