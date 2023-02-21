<script setup lang="ts">
defineProps<{
	quality: string;
}>();
</script>

<template>
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
</template>
