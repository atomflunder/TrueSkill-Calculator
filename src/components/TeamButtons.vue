<script setup lang="ts">
defineProps<{
	teamAmount: number;
}>();

defineEmits(['increment-teams', 'decrement-teams', 'reset-teams']);
</script>

<template>
	<tr>
		<td colspan="6">
			<b class="text-3xl">Starting Teams: ({{ teamAmount }})</b>
			<button class="team-button shadow-green-500" @click="$emit('increment-teams')">
				Add New Team
			</button>

			<button class="team-button shadow-red-500" @click="$emit('decrement-teams')">
				Remove Team
			</button>

			<button class="team-button shadow-blue-500" @click="$emit('reset-teams')">
				Reset Teams
			</button>
		</td>
	</tr>
</template>
