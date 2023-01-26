<script lang="ts">
	import { TrueSkill, Rating, rate } from 'ts-trueskill';

	type Team = {
		name: string;
		players: Rating[];
	};

	let defaultMu = 25;
	let defaultSigma = 25 / 3;
	let betaValue = 25 / 6;
	let tauValue = betaValue / 2;
	let drawProbability = 0.1;

	let env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);

	export const calculateRatings = function (teams: Team[]): Team[] {
		const ranks = [];
		// TODO: Add support for draws
		for (let i = 0; i < teams.length; i++) {
			ranks.push(i);
		}

		const weights = [];
		// TODO: Add support for weights
		for (let i = 0; i < teams.length; i++) {
			let teamWeights = [];
			for (let j = 0; j < teams[i].players.length; j++) {
				teamWeights.push(1);
			}
			weights.push(teamWeights);
		}

		const ratings = [];
		for (let i = 0; i < teams.length; i++) {
			ratings.push(teams[i].players);
		}
		const newRatings = env.rate(ratings, ranks, weights, 0.0001);

		const newTeams = [];

		for (let i = 0; i < teams.length; i++) {
			const newTeam = {
				name: teams[i].name,
				players: newRatings[i]
			};
			newTeams.push(newTeam);
		}

		return newTeams;
	};

	export const matchQuality = function (teams: Team[]): string {
		const ratings = [];
		for (let i = 0; i < teams.length; i++) {
			ratings.push(teams[i].players);
		}
		return `${(env.quality(ratings) * 100).toFixed(2)}%`;
	};

	export let teamCount = 2;
	export let currentTeams: Team[] = [
		{
			name: 'Team 1',
			players: [new Rating(defaultMu, defaultSigma), new Rating(defaultMu, defaultSigma)]
		},
		{
			name: 'Team 2',
			players: [new Rating(defaultMu, defaultSigma), new Rating(defaultMu, defaultSigma)]
		}
	];

	export let newTeams: Team[] = calculateRatings(currentTeams);
	export let quality = matchQuality(newTeams);

	export const incrementTeamCount = () => {
		if (teamCount < 50) {
			teamCount += 1;
			const newTeam = {
				name: `Team ${teamCount}`,
				players: [new Rating(defaultMu, defaultSigma), new Rating(defaultMu, defaultSigma)]
			};
			currentTeams.push(newTeam);
			currentTeams = currentTeams;
			updateCalculations();
		}
	};

	export const decreaseTeamCount = () => {
		if (teamCount > 2) {
			teamCount -= 1;
			currentTeams.pop();
			currentTeams = currentTeams;
			updateCalculations();
		}
	};

	export const teamToString = function (team: Team): string {
		let result = `${team.name}\n`;
		for (let i = 0; i < team.players.length; i++) {
			const rank = team.players[i].mu - 3 * team.players[i].sigma;
			result += `Mu (μ): ${team.players[i].mu.toFixed(3)} - Sigma (σ): ${team.players[
				i
			].sigma.toFixed(3)} - Rank: ${rank.toFixed(3)}\n`;
		}
		return result;
	};

	export const updateCalculations = function () {
		env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);
		newTeams = calculateRatings(currentTeams);
		quality = matchQuality(newTeams);
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
<ul>
	{#each currentTeams as team, i}
		<li>
			{teamToString(team)}
		</li>
	{/each}
</ul>
<p><b>Resulting Teams: ({teamCount})</b></p>
<ul>
	{#each newTeams as team, i}
		<li>
			{teamToString(team)}
		</li>
	{/each}
</ul>
<p>Match Quality: {quality}</p>
