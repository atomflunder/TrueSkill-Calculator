<script setup lang="ts">
import type { Team } from '@/helpers/teams';

defineProps<{
	team: Team;
}>();
</script>

<template>
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
</template>
