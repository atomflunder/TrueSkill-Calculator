<script setup lang="ts">
import { ref, onMounted, onBeforeUpdate } from 'vue';
import { TrueSkill } from 'ts-trueskill';

import Consts from '@/helpers/consts';
import { copyMessage } from '@/helpers/copy';
import { getDefaultTeam, getFirstTwoTeams, type Team } from '@/helpers/teams';
import { calculateRatings, matchQuality } from '@/helpers/trueskill';

import ConfigSidebar from '@/components/ConfigSidebar.vue';
import InputTeam from '@/components/InputTeam.vue';
import OutputTeam from '@/components/OutputTeam.vue';
import TeamButtons from '@/components/TeamButtons.vue';
import TableHeaders from '@/components/TableHeaders.vue';
import MatchQuality from '@/components/MatchQuality.vue';
import CalculateRatings from '@/components/CalculateRatings.vue';
import { getDefaultPlayer, type Player } from './helpers/players';

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

function addPlayerToTeam(env: TrueSkill, team: Team, playerIndex: number): void {
	if (team.players.length < Consts.MAX_AMOUNT_PLAYERS) {
		team.players.push(getDefaultPlayer(playerIndex + 1, env.mu, env.sigma));
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

function updateTeamRanks(team: Team, currentTeamsLength: number, newRank: number): void {
	// In reality, if Team A has a rank of 1, it does not matter if Team B's rank is 2 or 300.
	// Similarly, Team A's rank could also be -129, it just checks if it is lower/higher than the other Team.
	// But to keep it simple and to avoid confusion, we limit the ranks to be between 1 and the number of teams.
	if (newRank < 1 || !newRank) {
		newRank = 1;
	} else if (newRank > currentTeamsLength) {
		newRank = currentTeamsLength;
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

function copyOneTeamButton(teamIndex: number): void {
	copyMessage(teamToCsv(newTeams.value[teamIndex]));
	const button = document.getElementsByClassName('copy-csv-button')[teamIndex + 1];
	button.innerHTML = copiedMessage.value;
	setTimeout(() => {
		button.innerHTML = copyTeamMessage.value;
	}, 1000);
}

const disableLiveUpdates = ref(false);
const showSidebar = ref(true);

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
	<button v-if="!showSidebar" @click="showSidebar = !showSidebar" class="text-4xl float-left">
		&gt;
	</button>
	<div
		:class="{
			'ml-80': showSidebar,
			'ml-8': !showSidebar
		}"
	>
		<title>TrueSkill Calculator</title>
		<h1 class="text-5xl p-2">TrueSkill Calculator</h1>

		<Transition name="slide">
			<ConfigSidebar
				v-if="showSidebar"
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
				@toggle-live-updates="disableLiveUpdates = !disableLiveUpdates"
				@toggle-sidebar="showSidebar = !showSidebar"
				@refresh-calculations="refreshCalculations(false)"
			/>
		</Transition>

		<br />

		<table class="table-auto border-separate border-spacing-1">
			<TeamButtons
				:team-amount="currentTeams.length"
				@increment-teams="incrementTeamCount"
				@decrement-teams="decrementTeamCount"
				@reset-teams="resetTeams"
			/>

			<TableHeaders />

			<tr></tr>

			<tr class="odd:bg-gray-800" v-for="(team, j) in currentTeams" :key="j">
				<InputTeam
					:team="team"
					:current-teams="currentTeams"
					@add-player-to-team="
						addPlayerToTeam(env as TrueSkill, team, team.players.length)
					"
					@remove-player-from-team="removePlayerFromTeam(team)"
					@update-team-name="
						(teamName) => {
							team.name = teamName;
						}
					"
					@update-team-rank="
						(teamRank) => {
							updateTeamRanks(team, currentTeams.length, teamRank);
						}
					"
					@update-player-name="
						(player, playerName) => {
							player.name = playerName;
						}
					"
					@update-player-mu="
						(player, playerMu) => {
							updatePlayerMuSigma(player, playerMu, player.rating[1]);
						}
					"
					@update-player-sigma="
						(player, playerSigma) => {
							updatePlayerMuSigma(player, player.rating[0], playerSigma);
						}
					"
					@update-player-weight="
						(player, playerWeight) => {
							updatePlayerWeight(player, playerWeight);
						}
					"
					@update-calculations="refreshCalculations(false)"
				/>
			</tr>

			<CalculateRatings
				:disable-live-updates="disableLiveUpdates"
				@refresh-calculations="refreshCalculations(true)"
			/>
			<MatchQuality :quality="quality" />

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

			<TableHeaders />

			<tr class="odd:bg-gray-800" v-for="(team, i) in newTeams" :key="i">
				<OutputTeam
					:team="team"
					:copy-team-message="copyTeamMessage"
					@copy-team="copyOneTeamButton(i)"
				/>
			</tr>
		</table>
	</div>
</template>

<style scoped>
.slide-leave-active,
.slide-enter-active {
	transition: 0.2s;
}
.slide-enter-from {
	transform: translate(-100%, 0);
}
.slide-leave-to {
	transform: translate(-100%, 0);
}
</style>
