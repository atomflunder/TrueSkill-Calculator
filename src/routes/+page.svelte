<script lang="ts">
	import TrueSkillCalculator from './TrueSkillCalculator.svelte';
	let src = "github-mark-white.png";
</script>

<TrueSkillCalculator />

<p class="footer">
	<a href="https://github.com/atomflunder/trueskill-calc"><img {src}  alt="GitHub" width="32" height="32"></a>
</p>

<style>
	.footer {
		text-align: center;
		position: relative;
		right: 0;
		padding: 32px;
	}
</style>
