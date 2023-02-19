<script setup lang="ts">
import { copyMessage } from '@/helpers/copy';
import { TrueSkill } from 'ts-trueskill';
import ConfigSidebar from '@/components/ConfigSidebar.vue';
import { getDefaultPlayer, type Player } from '@/helpers/players';
import { getDefaultTeam, getFirstTwoTeams, type Team } from '@/helpers/teams';
import { calculateRatings, matchQuality } from '@/helpers/trueskill';
import Consts from '@/helpers/consts';
import { ref, onMounted, onBeforeUpdate } from 'vue';

const env = ref(new TrueSkill());
const teamSize = ref(2);
const currentTeams = ref(getFirstTwoTeams());
const newTeams = ref([] as Team[]);
const quality = ref('');

function resetConfig(): void {
	env.value = new TrueSkill();
	teamSize.value = 2;
	disableLiveUpdates.value = false;
}

function resetTeams(): void {
	currentTeams.value = getFirstTwoTeams();
}

function refreshCalculations(forceRefresh: boolean = false): void {
	// Just a shortcut to calling both functions.
	if (!disableLiveUpdates.value || forceRefresh) {
		newTeams.value = calculateRatings(env.value as TrueSkill, currentTeams.value);
		quality.value = matchQuality(env.value as TrueSkill, currentTeams.value);
	}
}

function incrementTeamCount(): void {
	// The limit is kind of arbitrary.
	if (currentTeams.value.length < Consts.MAX_AMOUNT_TEAMS) {
		const newTeam = getDefaultTeam(
			currentTeams.value.length + 1,
			teamSize.value,
			env.value.mu,
			env.value.sigma
		);
		currentTeams.value.push(newTeam);
	}
}

function decrementTeamCount(): void {
	if (currentTeams.value.length > Consts.MIN_AMOUNT_TEAMS) {
		currentTeams.value.pop();
	}
}

function increaseTeamSize(i: number): void {
	if (i > Consts.MAX_AMOUNT_PLAYERS) {
		i = Consts.MAX_AMOUNT_PLAYERS;
	}

	if (i < Consts.MIN_AMOUNT_PLAYERS || !i) {
		i = Consts.MIN_AMOUNT_PLAYERS;
	}

	teamSize.value = i;
}

function addPlayerToTeam(team: Team, playerIndex: number): void {
	if (team.players.length < Consts.MAX_AMOUNT_PLAYERS) {
		team.players.push(getDefaultPlayer(playerIndex + 1, env.value.mu, env.value.sigma));
	}
}

function removePlayerFromTeam(team: Team): void {
	if (team.players.length > Consts.MIN_AMOUNT_PLAYERS) {
		team.players.pop();
	}
}

function updatePlayerMuSigma(player: Player, newMu: number, newSigma: number): void {
	if (!newMu) {
		newMu = 0;
	}

	// The sigma value could be positive or negative, but just not 0.
	// The mu value can be whatever.
	if (newSigma) {
		player.rating = [newMu, newSigma];
	}
}

function updatePlayerWeight(player: Player, newWeight: number): void {
	// The weight needs to be between 0 and 1.
	if (newWeight < 0 || !newWeight) {
		newWeight = 0;
	} else if (newWeight > 1) {
		newWeight = 1;
	}

	player.weight = newWeight;
}

function updateTeamRanks(team: Team, newRank: number): void {
	// In reality, if Team A has a rank of 1, it does not matter if Team B's rank is 2 or 300.
	// Similarly, Team A's rank could also be -129, it just checks if it is lower/higher than the other Team.
	// But to keep it simple and to avoid confusion, we limit the ranks to be between 1 and the number of teams.
	if (newRank < 1 || !newRank) {
		newRank = 1;
	} else if (newRank > currentTeams.value.length) {
		newRank = currentTeams.value.length;
	}

	team.rank = newRank;
}

const copyAllMessage = ref('📋 Copy All Teams As CSV');
const copyTeamMessage = ref('📋 Copy Team As CSV');
const copiedMessage = ref('✔️ Copied to Clipboard!');

function teamToCsv(team: Team): string {
	return team.players
		.map((player) => {
			return `${team.name},${team.rank},${player.name},${player.rating[0]},${player.rating[1]},${player.weight}`;
		})
		.join('\r');
}

function allTeamsToCsv(teams: Team[]): string {
	return teams
		.map((team) => {
			return teamToCsv(team);
		})
		.join('\r');
}

function copyAllTeamsButton(): void {
	copyMessage(allTeamsToCsv(newTeams.value));
	const oldMessage = copyAllMessage.value;
	copyAllMessage.value = copiedMessage.value;
	setTimeout(() => {
		copyAllMessage.value = oldMessage;
	}, 1000);
}

function copyOneTeamButton(i: number): void {
	copyMessage(teamToCsv(newTeams.value[i]));
	const button = document.getElementsByClassName('copy-csv-button')[i + 1];
	button.innerHTML = copiedMessage.value;
	setTimeout(() => {
		button.innerHTML = copyTeamMessage.value;
	}, 1000);
}

const disableLiveUpdates = ref(false);

function toggleLiveUpdates(): void {
	disableLiveUpdates.value = !disableLiveUpdates.value;
}

onMounted(() => {
	refreshCalculations(false);
});

onBeforeUpdate(() => {
	try {
		refreshCalculations(false);
	} catch (e) {
		console.error(e);
	}
});
</script>

<template>
	<div>
		<title>TrueSkill Calculator</title>
		<h1 class="text-5xl p-2">TrueSkill Calculator</h1>

		<ConfigSidebar
			:mu-value="env.mu"
			:sigma-value="env.sigma"
			:team-size-value="teamSize"
			:beta-value="env.beta"
			:tau-value="env.tau"
			:draw-probability="env.drawProbability"
			:disable-live-updates="disableLiveUpdates"
			@mu-value="env.mu = $event"
			@sigma-value="env.sigma = $event"
			@team-size-value="increaseTeamSize($event)"
			@beta-value="env.beta = $event"
			@tau-value="env.tau = $event"
			@draw-probability="env.drawProbability = $event"
			@reset-config="resetConfig"
			@toggle-live-updates="toggleLiveUpdates"
		/>

		<br />

		<table class="table-auto border-separate border-spacing-1">
			<tr>
				<td colspan="6">
					<b class="text-3xl">Starting Teams: ({{ currentTeams.length }})</b>
					<button class="team-button shadow-green-500" @click="incrementTeamCount">
						Add New Team
					</button>

					<button class="team-button shadow-red-500" @click="decrementTeamCount">
						Remove Team
					</button>

					<button class="team-button shadow-blue-500" @click="resetTeams">
						Reset Teams
					</button>
				</td>
			</tr>

			<tr></tr>
			<tr></tr>

			<th class="text-2xl" title="The Name of the Team.">Team Name</th>
			<th
				class="text-2xl"
				title="The Rank, or the Placement of the Team. The lower the better."
			>
				Rank
			</th>
			<th class="text-2xl" title="The Names of the Players of this Team.">Players</th>
			<th class="text-2xl" title="The Mu (μ) Value of the Player.">Mu (μ)</th>
			<th class="text-2xl" title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
			<th
				class="text-2xl"
				title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
			>
				Weight
			</th>
			<tr></tr>

			<tr class="odd:bg-gray-800" v-for="(team, j) in currentTeams" :key="j">
				<td>
					<input class="team-input" type="text" v-model="team.name" />
				</td>
				<td>
					<input
						class="team-input"
						type="number"
						min="1"
						:max="currentTeams.length"
						v-model.number.lazy="team.rank"
						@input="
							updateTeamRanks(team, ($event.target as HTMLInputElement).valueAsNumber)
						"
					/>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input class="team-input" type="text" v-model="player.name" />
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="number"
							step="0.1"
							v-model.number.lazy="player.rating[0]"
							@input="
								updatePlayerMuSigma(
									player,
									($event.target as HTMLInputElement).valueAsNumber,
									player.rating[1]
								)
							"
						/>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="number"
							step="0.01"
							v-model.number.lazy="player.rating[1]"
							@input="
								updatePlayerMuSigma(
									player,
									player.rating[0],
									($event.target as HTMLInputElement).valueAsNumber
								)
							"
						/>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="number"
							max="1"
							min="0"
							step="0.01"
							v-model.number.lazy="player.weight"
							@input="
								updatePlayerWeight(
									player,
									($event.target as HTMLInputElement).valueAsNumber
								)
							"
						/>
					</tr>
				</td>
				<button
					class="player-button shadow-green-500"
					@click="addPlayerToTeam(team, team.players.length)"
				>
					Add Player
				</button>
				<button class="player-button shadow-red-500" @click="removePlayerFromTeam(team)">
					Remove Player
				</button>
			</tr>

			<tr v-show="disableLiveUpdates">
				<td>&nbsp;</td>
			</tr>

			<tr v-show="disableLiveUpdates">
				<td
					colspan="3"
					class="text-2xl text-center p-4 bg-gray-700 rounded border-white border hover:bg-gray-600 active:bg-gray-800 cursor-pointer shadow-md shadow-gray-500"
					@click="refreshCalculations(true)"
				>
					<button>Calculate New Ratings</button>
				</td>
			</tr>

			<tr>
				<td>&nbsp;</td>
			</tr>

			<td
				title="The match quality is the chance of a draw occurring in the given game. The higher the value, the closer the game will be."
				colspan="3"
				class="text-3xl text-center p-4 bg-gray-700 rounded border-white border"
			>
				Match Quality: {{ quality }}
			</td>

			<tr>
				<td>&nbsp;</td>
			</tr>

			<tr>
				<td colspan="6">
					<b class="text-3xl">Resulting Teams: ({{ newTeams.length }})</b>
					<button
						title="Copy All Teams as CSV"
						class="copy-csv-button ml-4 p-2 m-4"
						@click="copyAllTeamsButton"
					>
						{{ copyAllMessage }}
					</button>
				</td>
			</tr>

			<tr></tr>
			<tr></tr>

			<th class="text-2xl" title="The Name of the Team.">Team Name</th>
			<th
				class="text-2xl"
				title="The Rank, or the Placement of the Team. The lower the better."
			>
				Rank
			</th>
			<th class="text-2xl" title="The Names of the Players of this Team.">Players</th>
			<th class="text-2xl" title="The Mu (μ) Value of the Player.">Mu (μ)</th>
			<th class="text-2xl" title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
			<th
				class="text-2xl"
				title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
			>
				Weight
			</th>

			<tr class="odd:bg-gray-800" v-for="(team, i) in newTeams" :key="i">
				<td>
					<div class="team-input">{{ team.name }}</div>
				</td>
				<td>
					<div class="team-input">{{ team.rank }}</div>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.name }}</div>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.rating[0] }}</div>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.rating[1] }}</div>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.weight }}</div>
					</tr>
				</td>
				<button
					title="Copy Team as CSV"
					class="copy-csv-button"
					@click="copyOneTeamButton(i)"
				>
					{{ copyTeamMessage }}
				</button>
			</tr>
		</table>
	</div>
</template>
