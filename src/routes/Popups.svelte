<script>
	import { getContext } from 'svelte';
	import ConfigExplain from './explanations/Config.svelte';
	import CalculatorExplain from './explanations/Calculator.svelte';
	import TrueSkillExplain from './explanations/TrueSkill.svelte';

	const { open } = getContext('simple-modal');

	const tsExplain = () => open(TrueSkillExplain);
	const configExplain = () => open(ConfigExplain);
	const calculatorExplain = () => open(CalculatorExplain);
</script>

<p>
	<button class="explain-button" on:click={tsExplain}>What is TrueSkill?</button>
	<br />
	<br />
	<button class="explain-button" on:click={configExplain}>Explanation of Config Values</button>
	<br />
	<br />
	<button class="explain-button" on:click={calculatorExplain}>How to use this Calculator</button>
</p>

<style>
	.explain-button {
		font-size: 14px;
		padding: 8px;
		background-color: #414244;
		color: #f2f2f2;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.explain-button:hover {
		background-color: #2f2f2f;
	}
</style>
