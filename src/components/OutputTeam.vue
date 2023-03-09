<script setup lang="ts">
import type { Team } from '@/helpers/teams';

defineProps<{
	team: Team;
	copyTeamMessage: string;
}>();

defineEmits(['copy-team']);
</script>

<template>
	<td>
		<label class="only-screen-reader" :for="'r-team-name-' + team.name">Team Name</label>
		<div class="team-input" :name="'r-team-name-' + team.name" :id="'r-team-name-' + team.name">
			{{ team.name }}
		</div>
	</td>
	<td>
		<label class="only-screen-reader" :for="'r-team-rank-' + team.name"
			>{{ team.name }} Rank</label
		>
		<div class="team-input" :name="'r-team-rank-' + team.name" :id="'r-team-rank-' + team.name">
			{{ team.rank }}
		</div>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label
				class="only-screen-reader"
				:for="'r-player-name-' + team.name + '-' + player.name"
				>Player {{ i + 1 }} Name ({{ team.name }})</label
			>
			<div
				class="team-input"
				:name="'r-player-name-' + team.name + '-' + player.name"
				:id="'r-player-name-' + team.name + '-' + player.name"
			>
				{{ player.name }}
			</div>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label class="only-screen-reader" :for="'r-player-mu-' + team.name + '-' + player.name"
				>Resulting Mu for {{ player.name }} ({{ team.name }})</label
			>
			<div
				class="team-input"
				:name="'r-player-mu-' + team.name + '-' + player.name"
				:id="'r-player-mu-' + team.name + '-' + player.name"
			>
				{{ player.rating[0] }}
			</div>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label
				class="only-screen-reader"
				:for="'r-player-sigma-' + team.name + '-' + player.name"
				>Resulting Sigma for {{ player.name }} ({{ team.name }})</label
			>
			<div
				class="team-input"
				:name="'r-player-sigma-' + team.name + '-' + player.name"
				:id="'r-player-sigma-' + team.name + '-' + player.name"
			>
				{{ player.rating[1] }}
			</div>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label
				class="only-screen-reader"
				:for="'r-player-weight-' + team.name + '-' + player.name"
				>Weight for {{ player.name }} ({{ team.name }})</label
			>
			<div
				class="team-input"
				:name="'r-player-weight-' + team.name + '-' + player.name"
				:id="'r-player-weight-' + team.name + '-' + player.name"
			>
				{{ player.weight }}
			</div>
		</tr>
	</td>
	<button title="Copy Team as CSV" class="copy-csv-button" @click="$emit('copy-team')">
		{{ copyTeamMessage }}
	</button>
</template>
