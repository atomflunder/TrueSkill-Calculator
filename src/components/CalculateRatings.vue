<script setup lang="ts">
defineProps<{
	disableLiveUpdates: boolean;
}>();

defineEmits(['refresh-calculations']);
</script>

<template>
	<tr v-show="disableLiveUpdates">
		<td>&nbsp;</td>
	</tr>

	<tr v-show="disableLiveUpdates">
		<td
			colspan="3"
			class="text-2xl text-center p-4 bg-gray-700 rounded border-white border hover:bg-gray-600 active:bg-gray-800 cursor-pointer shadow-md shadow-gray-500"
			@click="$emit('refresh-calculations')"
		>
			<button>Calculate New Ratings</button>
		</td>
	</tr>
</template>
