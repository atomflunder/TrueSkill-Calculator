<script lang="ts">
	import { updateCalculations } from '../TrueSkill';
	import { TrueSkill } from 'ts-trueskill';
	import type { Team } from '../Teams';

	export let env = new TrueSkill();
	export let defaultMu = 0;
	export let defaultSigma = 0;
	export let betaValue = 0;
	export let tauValue = 0;
	export let drawProbability = 0;
	export let currentTeams: Team[] = [];
	export let newTeams: Team[] = [];
	export let quality = '0.00';

	const refreshCalculations = () => {
		[env, newTeams, quality] = updateCalculations(
			defaultMu,
			defaultSigma,
			betaValue,
			tauValue,
			drawProbability,
			currentTeams,
			env,
			newTeams,
			quality
		);
	};
</script>

<div class="sidenav">
	<h2>Current Config:</h2>
	<table>
		<tr>
			<td title="The default Value of Mu (μ) for new players."> Default Mu (μ):</td>
			<td>
				<input
					type="number"
					bind:value={defaultMu}
					on:input={() => {
						refreshCalculations();
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
					bind:value={defaultSigma}
					on:input={() => {
						refreshCalculations();
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
					bind:value={betaValue}
					on:input={() => {
						refreshCalculations();
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
					bind:value={tauValue}
					on:input={() => {
						refreshCalculations();
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
					bind:value={drawProbability}
					on:input={() => {
						refreshCalculations();
					}}
					class="config-input"
				/>
			</td>
		</tr>
	</table>
	<p><b>Explanation of the values: </b></p>
	<ul>
		<li>
			<b>Default Mu (μ):</b> The default Value of Mu (μ) for new players. By default set to 25.
		</li>
		<li>
			<b>Default Sigma (σ)</b> The default Value of Sigma (σ) for new players. By default set to 25/3
			≈ 8.333.
		</li>
		<li>
			<b>Beta (β):</b> The distance in rating points to guarantee about a 76% chance of winning for the
			higher rated player. By default set to 25/6 ≈ 4.167
		</li>
		<li>
			<b>Tau (τ):</b> The additive dynamics factor, the higher the value, the more dynamic the ratings.
			By default set to 25/300 ≈ 0.083
		</li>
		<li>
			<b>Draw Probability:</b> The chance of a draw occurring in your game. By default set to 0.1.
		</li>
	</ul>

	<p><b>How to use the calculator: </b></p>
	<p>
		Add or remove Teams and assign each the correct number of players present in your game.<br
		/>Then assign each Team the correct Rank, meaning Placement in the game. The lower the rank, the
		better. <br />
		If two or more Teams draw with each other, assign them the same rank. <br />
		The expected results will appear in the <b>Resulting Teams</b> section. <br />
		Also, you can see the <b>Match Quality</b> which is the percent chance of your match ending in a
		draw. The higher this value, the closer your match will be.
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
</style>
