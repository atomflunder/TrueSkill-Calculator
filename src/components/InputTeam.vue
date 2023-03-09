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
	'refresh-calculations'
]);

onBeforeUpdate(() => {
	emit('refresh-calculations');
});
</script>

<template>
	<td>
		<label class="only-screen-reader" :for="'team-name-' + team.name">Update Team Name</label>
		<input
			class="team-input"
			type="text"
			:value="team.name"
			@input="$emit('update-team-name', ($event.target as HTMLInputElement).value)"
			:name="'team-name-' + team.name"
			:id="'team-name-' + team.name"
		/>
	</td>
	<td>
		<label class="only-screen-reader" :for="'team-rank-' + team.name"
			>Update {{ team.name }} Rank</label
		>
		<input
			class="team-input"
			type="number"
			min="1"
			:max="currentTeams.length"
			:value="team.rank"
			@input="$emit('update-team-rank', ($event.target as HTMLInputElement).valueAsNumber)"
			:name="'team-rank-' + team.name"
			:id="'team-rank-' + team.name"
		/>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label class="only-screen-reader" :for="'player-name-' + team.name + '-' + player.name"
				>Update Player {{ i + 1 }} Name ({{ team.name }})</label
			>
			<input
				class="team-input"
				type="text"
				:value="player.name"
				@input="
					$emit('update-player-name', player, ($event.target as HTMLInputElement).value)
				"
				:name="'player-name-' + team.name + '-' + player.name"
				:id="'player-name-' + team.name + '-' + player.name"
			/>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label class="only-screen-reader" :for="'player-mu-' + team.name + '-' + player.name"
				>Update Mu for {{ player.name }} ({{ team.name }})</label
			>
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
				:name="'player-mu-' + team.name + '-' + player.name"
				:id="'player-mu-' + team.name + '-' + player.name"
			/>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label class="only-screen-reader" :for="'player-sigma-' + team.name + '-' + player.name"
				>Update Sigma for {{ player.name }} ({{ team.name }})</label
			>
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
				:name="'player-sigma-' + team.name + '-' + player.name"
				:id="'player-sigma-' + team.name + '-' + player.name"
			/>
		</tr>
	</td>
	<td>
		<tr v-for="(player, i) in team.players" :key="i">
			<label
				class="only-screen-reader"
				:for="'player-weight-' + team.name + '-' + player.name"
				>Update Weight for {{ player.name }} ({{ team.name }})</label
			>
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
				:name="'player-weight-' + team.name + '-' + player.name"
				:id="'player-weight-' + team.name + '-' + player.name"
			/>
		</tr>
	</td>
	<label class="only-screen-reader" :for="'add-player-team-' + team.name"
		>Add Player To {{ team.name }}</label
	>
	<button
		class="player-button shadow-green-500"
		@click="$emit('add-player-to-team')"
		:name="'add-player-team-' + team.name"
		:id="'add-player-team-' + team.name"
	>
		Add Player
	</button>
	<label class="only-screen-reader" :for="'remove-player-team-' + team.name"
		>Remove Player From {{ team.name }}</label
	>
	<button
		class="player-button shadow-red-500"
		@click="$emit('remove-player-from-team')"
		:name="'remove-player-team-' + team.name"
		:id="'remove-player-team-' + team.name"
	>
		Remove Player
	</button>
</template>
