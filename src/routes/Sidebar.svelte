<script lang="ts">
	import { updateConfig } from '../TrueSkill';
	import { TrueSkill } from 'ts-trueskill';
	import type { Team } from '../Teams';
	import { Modal } from 'svelte-simple-modal';
	import Content from './Popups.svelte';

	export let env = new TrueSkill();
	export let defaultMu = 0;
	export let defaultSigma = 0;
	export let betaValue = 0;
	export let tauValue = 0;
	export let drawProbability = 0;
	export let currentTeams: Team[] = [];
	export let newTeams: Team[] = [];
	export let quality = '0.00';

	let github_img = 'github-mark-white.png';

	const refreshConfig = (): void => {
		[env, newTeams, quality] = updateConfig(
			defaultMu,
			defaultSigma,
			betaValue,
			tauValue,
			drawProbability,
			currentTeams
		);
	};

	const resetConfig = (): void => {
		defaultMu = 25;
		defaultSigma = 25 / 3;
		betaValue = 25 / 6;
		tauValue = 25 / 300;
		drawProbability = 0.1;
		refreshConfig();
	};
</script>

<div class="sidenav">
	<h2>Current Config:</h2>
	<button
		class="config-reset-button"
		on:click={() => {
			resetConfig();
		}}>Reset Config</button
	>
	<br />
	<br />
	<table>
		<tr>
			<td title="The default Value of Mu (μ) for new players."> Default Mu (μ):</td>
			<td>
				<input
					type="number"
					step="0.1"
					bind:value={defaultMu}
					on:input={() => {
						refreshConfig();
					}}
					class="config-input"
				/>
			</td>
		</tr>
		<tr>
			<td title="The default Value of Sigma (σ) for new players.">Default Sigma (σ):</td>
			<td>
				<input
					type="number"
					step="0.01"
					bind:value={defaultSigma}
					on:input={() => {
						refreshConfig();
					}}
					class="config-input"
				/>
			</td>
		</tr>
		<tr>
			<td
				title="The distance in rating points to guarantee about a 76% chance of winning for the higher rated player."
			>
				Beta (β):</td
			>
			<td>
				<input
					type="number"
					step="0.01"
					bind:value={betaValue}
					on:input={() => {
						refreshConfig();
					}}
					class="config-input"
				/>
			</td>
		</tr>
		<tr>
			<td title="The additive dynamics factor, the higher the value, the more dynamic the ratings.">
				Tau (τ):</td
			>
			<td>
				<input
					type="number"
					step="0.001"
					bind:value={tauValue}
					on:input={() => {
						refreshConfig();
					}}
					class="config-input"
				/>
			</td>
		</tr>
		<tr>
			<td title="The chance of a draw occurring in your game."> Draw Probability:</td>
			<td>
				<input
					type="number"
					step="0.01"
					bind:value={drawProbability}
					on:input={() => {
						refreshConfig();
					}}
					class="config-input"
				/>
			</td>
		</tr>
	</table>
	<br />
	<Modal styleWindow={{ backgroundColor: '#202020' }} styleContent={{ color: '#f2f2f2' }}>
		<Content />
	</Modal>

	<br />
	Thanks for using this calculator! <br />
	Feel free to check me out on
	<a href="https://github.com/atomflunder/TrueSkill-Calculator">GitHub</a>.

	<p class="side-icon">
		<a href="https://github.com/atomflunder/trueskill-calc"
			><img src={github_img} alt="Visit me on GitHub!" width="32" height="32" /></a
		>
	</p>
</div>

<style>
	.sidenav {
		height: 100%;
		width: 360px;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		overflow-x: hidden;
		border: 1px solid black;
		padding: 10px;
		background: #202020;
	}

	.config-input {
		background-color: #414244;
		font-size: large;
		color: #f2f2f2;
		border: 0px;
		padding: 5px;
	}

	.config-reset-button {
		font-size: 14px;
		padding: 8px;
		background-color: #57a4e4;
		text-align: center;
		border: none;
		border-radius: 5px;
	}

	.config-reset-button:hover {
		background-color: #3d8bd0;
	}

	.side-icon {
		text-align: center;
		padding: 16px;
	}
</style>
