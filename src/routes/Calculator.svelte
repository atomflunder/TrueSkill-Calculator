<script lang="ts">
	import { TrueSkill, Rating } from 'ts-trueskill';
	import { getDefaultTeam, getFirstTwoTeams, teamToCsv, allTeamsToCsv, type Team } from '../Teams';
	import { calculateRatings, matchQuality, updateCalculations } from '../TrueSkill';
	import { getDefaultPlayer } from '../Players';
	import Sidebar from './Sidebar.svelte';
	import { copyMessage } from '../Copy';

	let defaultMu = 25;
	let defaultSigma = 25 / 3;
	let betaValue = 25 / 6;
	let tauValue = 25 / 300;
	let drawProbability = 0.1;

	let env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);

	export let teamCount = 2;
	export let currentTeams: Team[] = getFirstTwoTeams(defaultMu, defaultSigma);

	export let newTeams: Team[] = calculateRatings(env, currentTeams);
	export let quality: string = matchQuality(env, currentTeams);

	const incrementTeamCount = (): void => {
		// Setting a generous limit. In reality this can be as high as you want.
		// It does start to lag a bit at ~50 teams.
		if (teamCount < 128) {
			teamCount += 1;
			const newTeam = getDefaultTeam(defaultMu, defaultSigma, teamCount);
			currentTeams.push(newTeam);
			refreshCalculations();
		}
	};

	const decreaseTeamCount = (): void => {
		if (teamCount > 2) {
			teamCount -= 1;
			currentTeams.pop();
			refreshCalculations();
		}
	};

	const addPlayerToTeam = (teamIndex: number, playerIndex: number): void => {
		if (currentTeams[teamIndex].players.length < 256) {
			currentTeams[teamIndex].players.push(getDefaultPlayer(defaultMu, defaultSigma, playerIndex));
			refreshCalculations();
		}
	};

	const removePlayerFromTeam = (teamIndex: number): void => {
		if (currentTeams[teamIndex].players.length > 1) {
			currentTeams[teamIndex].players.pop();
			refreshCalculations();
		}
	};

	const updatePlayerMuSigma = (
		teamIndex: number,
		playerIndex: number,
		newMu: number,
		newSigma: number
	): void => {
		currentTeams[teamIndex].players[playerIndex].rating = new Rating(newMu, newSigma);
		refreshCalculations();
	};

	const updatePlayerName = (teamIndex: number, playerIndex: number, newName: string): void => {
		currentTeams[teamIndex].players[playerIndex].name = newName;
		refreshCalculations();
	};

	const updatePlayerWeight = (teamIndex: number, playerIndex: number, newWeight: number): void => {
		if (newWeight < 0) {
			newWeight = 0;
		} else if (newWeight > 1) {
			newWeight = 1;
		}

		currentTeams[teamIndex].players[playerIndex].weight = newWeight;
		refreshCalculations();
	};

	const updateTeamRanks = (teamIndex: number, newRank: number): void => {
		if (newRank < 1 || !newRank) {
			newRank = 1;
		} else if (newRank > teamCount) {
			newRank = teamCount;
		}

		currentTeams[teamIndex].rank = newRank;
		refreshCalculations();
	};

	const refreshCalculations = (): void => {
		currentTeams = currentTeams;
		[newTeams, quality] = updateCalculations(currentTeams, env);
	};

	const resetTeams = (): void => {
		teamCount = 2;
		currentTeams = getFirstTwoTeams(defaultMu, defaultSigma);
		refreshCalculations();
	};
</script>

<body class="bg-gray-900 text-white ml-40 p-2 min-h-screen min-w-min">
	<title>TrueSkill Calculator</title>
	<h1 class="text-5xl p-2">TrueSkill Calculator</h1>
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

	<br />

	<table class="table-auto border-separate border-spacing-1">
		<tr>
			<td colspan="6">
				<b class="text-3xl">Starting Teams: ({teamCount})</b>
				<button class="team-button shadow-green-500" on:click={() => incrementTeamCount()}>
					Add New Team
				</button>

				<button class="team-button shadow-red-500" on:click={() => decreaseTeamCount()}>
					Remove Team
				</button>

				<button class="team-button shadow-blue-500" on:click={() => resetTeams()}>
					Reset Teams
				</button>
			</td>
		</tr>

		<tr />
		<tr />

		<th class="text-2xl" title="The Name of the Team.">Team Name</th>
		<th class="text-2xl" title="The Rank, or the Placement of the Team. The lower the better."
			>Rank</th
		>
		<th class="text-2xl" title="The Names of the Players of this Team.">Players</th>
		<th class="text-2xl" title="The Mu (μ) Value of the Player.">Mu (μ)</th>
		<th class="text-2xl" title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
		<th
			class="text-2xl"
			title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
			>Weight</th
		>
		<tr />

		{#each currentTeams as team, i}
			<tr class="odd:bg-gray-800">
				<td>
					<input
						class="team-input"
						type="text"
						bind:value={team.name}
						on:input={() => {
							refreshCalculations();
						}}
					/>
				</td>
				<td>
					<input
						class="team-input"
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
								class="team-input"
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
								class="team-input"
								type="number"
								step="0.1"
								value={player.rating.mu}
								on:input={(event) => {
									if (event.target instanceof HTMLInputElement) {
										updatePlayerMuSigma(
											i,
											j,
											Number(event.target.valueAsNumber),
											player.rating.sigma
										);
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
								class="team-input"
								type="number"
								step="0.01"
								value={player.rating.sigma}
								on:input={(event) => {
									if (event.target instanceof HTMLInputElement) {
										updatePlayerMuSigma(i, j, player.rating.mu, Number(event.target.valueAsNumber));
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
								class="team-input"
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
					class="player-button shadow-green-500"
					on:click={() => addPlayerToTeam(i, team.players.length + 1)}
				>
					Add Player
				</button>
				<button class="player-button shadow-red-500" on:click={() => removePlayerFromTeam(i)}>
					Remove Player
				</button>
			</tr>
		{/each}

		<tr>
			<td> &nbsp; </td>
		</tr>

		<td
			title="The match quality is the chance of a draw occurring in the given game. The higher the value, the closer the game will be."
			colspan="3"
			class="text-3xl text-center p-4 bg-gray-700 rounded border-white border"
		>
			Match Quality: {quality}
		</td>

		<tr>
			<td> &nbsp; </td>
		</tr>

		<tr>
			<td colspan="6">
				<b class="text-3xl">Resulting Teams: ({teamCount})</b>
				<button
					title="Copy All Teams as CSV"
					class="copy-csv-button ml-4 p-2 m-4"
					on:click={() => {
						copyMessage(allTeamsToCsv(newTeams));
						const button = document.getElementsByClassName('copy-csv-button')[0];
						button.innerHTML = '✔️ Copied to Clipboard!';
						setTimeout(() => {
							button.innerHTML = '📋 Copy All Teams As CSV';
						}, 1000);
					}}
				>
					📋 Copy All Teams As CSV
				</button>
			</td>
		</tr>

		<tr />
		<tr />

		<th class="text-2xl" title="The Name of the Team.">Team Name</th>
		<th class="text-2xl" title="The Rank, or the Placement of the Team. The lower the better."
			>Rank</th
		>
		<th class="text-2xl" title="The Names of the Players of this Team.">Players</th>
		<th class="text-2xl" title="The Mu (μ) Value of the Player.">Mu (μ)</th>
		<th class="text-2xl" title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
		<th
			class="text-2xl"
			title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
			>Weight</th
		>

		{#each newTeams as team, i}
			<tr class="odd:bg-gray-800">
				<td>
					<div class="team-input">{team.name}</div>
				</td>
				<td>
					<div class="team-input">{team.rank}</div>
				</td>
				<td>
					{#each team.players as player}
						<tr>
							<div class="team-input">{player.name}</div>
						</tr>
					{/each}
				</td>
				<td>
					{#each team.players as player}
						<tr>
							<div class="team-input">{player.rating.mu}</div>
						</tr>
					{/each}
				</td>
				<td>
					{#each team.players as player}
						<tr>
							<div class="team-input">{player.rating.sigma}</div>
						</tr>
					{/each}
				</td>
				<td>
					{#each team.players as player}
						<tr>
							<div class="team-input">{player.weight}</div>
						</tr>
					{/each}
				</td>
				<button
					title="Copy Team as CSV"
					class="copy-csv-button"
					on:click={() => {
						copyMessage(teamToCsv(newTeams[i]));
						const button = document.getElementsByClassName('copy-csv-button')[i + 1];
						button.innerHTML = '✔️ Copied to Clipboard!';
						setTimeout(() => {
							button.innerHTML = '📋 Copy Team As CSV';
						}, 1000);
					}}
				>
					📋 Copy Team As CSV
				</button>
			</tr>
		{/each}
	</table>
</body>
