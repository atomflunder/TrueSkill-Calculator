<script setup lang="ts">
import { onBeforeUpdate } from 'vue';
import type { Team } from '@/helpers/teams';

defineProps<{
	team: Team;
	currentTeams: Team[];
}>();

const emit = defineEmits([
	'update-team-name',
	'update-team-rank',
	'update-player-name',
	'update-player-mu',
	'update-player-sigma',
	'update-player-weight',
	'add-player-to-team',
	'remove-player-from-team',
	'update-calculations'
]);

onBeforeUpdate(() => {
	emit('update-calculations');
});
</script>

<template>
	<td>
		<input
			class="team-input"
			type="text"
			:value="team.name"
			@input="$emit('update-team-name', ($event.target as HTMLInputElement).value)"
		/>
	</td>
	<td>
		<input
			class="team-input"
			type="number"
			min="1"
			:max="currentTeams.length"
			:value="team.rank"
			@input="$emit('update-team-rank', ($event.target as HTMLInputElement).valueAsNumber)"
		/>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<input
				class="team-input"
				type="text"
				:value="player.name"
				@input="
					$emit('update-player-name', player, ($event.target as HTMLInputElement).value)
				"
			/>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<input
				class="team-input"
				type="number"
				step="0.1"
				v-model.lazy="player.rating[0]"
				@input="
					$emit(
						'update-player-mu',
						player,
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
				step="0.01"
				v-model.lazy="player.rating[1]"
				@input="
					$emit(
						'update-player-sigma',
						player,
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
				v-model.lazy="player.weight"
				@input="
					$emit(
						'update-player-weight',
						player,
						($event.target as HTMLInputElement).valueAsNumber
					)
				"
			/>
		</tr>
	</td>
	<button class="player-button shadow-green-500" @click="$emit('add-player-to-team')">
		Add Player
	</button>
	<button class="player-button shadow-red-500" @click="$emit('remove-player-from-team')">
		Remove Player
	</button>
</template>
