<script lang="ts">
	import TrueSkillCalculator from './Calculator.svelte';
	let src = 'github-mark-white.png';
</script>

<p class="side-icon">
	<a href="https://github.com/atomflunder/trueskill-calc"
		><img {src} alt="Visit me on GitHub!" width="32" height="32" /></a
	>
</p>

<TrueSkillCalculator />

<style>
	.side-icon {
		text-align: right;
		position: absolute;
		right: 0;
		top: 0;
		padding: 16px;
	}
</style>
