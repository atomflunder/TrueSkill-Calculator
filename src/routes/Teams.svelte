<script lang="ts">
	import { TrueSkill, Rating } from 'ts-trueskill';
	import type { Team } from '../Teams.js';
	import { teamToString } from '../Teams.js';
	import { calculateRatings, matchQuality } from '../TrueSkill.js';

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
			players: [new Rating(defaultMu, defaultSigma), new Rating(defaultMu, defaultSigma)],
			rank: 1
		},
		{
			name: 'Team 2',
			players: [new Rating(defaultMu, defaultSigma), new Rating(defaultMu, defaultSigma)],
			rank: 2
		}
	];

	export let newTeams: Team[] = calculateRatings(env, currentTeams);
	export let quality = matchQuality(env, newTeams);

	const incrementTeamCount = () => {
		if (teamCount < 50) {
			teamCount += 1;
			const newTeam = {
				name: `Team ${teamCount}`,
				players: [new Rating(defaultMu, defaultSigma), new Rating(defaultMu, defaultSigma)],
				rank: teamCount
			};
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

	export const updateCalculations = function () {
		env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);
		newTeams = calculateRatings(env, currentTeams);
		quality = matchQuality(env, newTeams);
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
