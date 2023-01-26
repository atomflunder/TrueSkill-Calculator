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
<p>
	<b>Current Config:</b>
	<br />Default Mu:
	<input
		type="number"
		bind:value={defaultMu}
		on:input={() => {
			updateCalculations();
		}}
	/>
	<br />Default Sigma:
	<input
		type="number"
		bind:value={defaultSigma}
		on:input={() => {
			updateCalculations();
		}}
	/>
	<br />Beta:
	<input
		type="number"
		bind:value={betaValue}
		on:input={() => {
			updateCalculations();
		}}
	/>
	<br />Tau:
	<input
		type="number"
		bind:value={tauValue}
		on:input={() => {
			updateCalculations();
		}}
	/>
	<br />Draw Probability:
	<input
		type="number"
		bind:value={drawProbability}
		on:input={() => {
			updateCalculations();
		}}
	/>
</p>
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
					>
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
				<input
					type="text"
					bind:value={team.name}
					readonly
				/>
			</td>
			<td>
				<input
					type="number"
					bind:value={team.rank}
					readonly
					>
			</td>

			<td>
				{#each team.players as player, j}
					<input
						type="number"
						value={player.mu}
						readonly
					/>

					<input
						type="number"
						value={player.sigma}
						readonly
					/>
					<br />
				{/each}
			</td>
		</tr>
	{/each}
</table>
<p>Match Quality: {quality}</p>
