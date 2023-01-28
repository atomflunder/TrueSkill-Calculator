<script lang="ts">
	import { updateConfig } from '../TrueSkill';
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

	const refreshConfig = () => {
		[env, newTeams, quality] = updateConfig(
			defaultMu,
			defaultSigma,
			betaValue,
			tauValue,
			drawProbability,
			currentTeams
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
	<p><b>Explanation of the values: </b></p>
	<ul>
		<li>
			<b>Default Mu (μ):</b> The default Value of Mu (μ) for new players. By default set to 25.
		</li>
		<br />
		<li>
			<b>Default Sigma (σ):</b> The default Value of Sigma (σ) for new players. By default set to 25/3
			≈ 8.333.
		</li>
		<br />
		<li>
			<b>Beta (β):</b> The distance in rating points to guarantee about a 76% chance of winning for the
			higher rated player. If your game is more luck based, set this higher. If your game is more reliant
			on pure skill, set this to a lower value. By default set to 25/6 ≈ 4.167.
		</li>
		<br />
		<li>
			<b>Tau (τ):</b> The additive dynamics factor, the higher the value, the more dynamic the ratings
			will be. By default set to 25/300 ≈ 0.083.
		</li>
		<br />
		<li>
			<b>Draw Probability:</b> The chance of a draw occurring in your game. If your game is draw-heavy
			(e.g. High-level chess) set this higher. If draws are unlikely to occur, set this lower. If draws
			are impossible by design set this to 0. By default set to 0.1, meaning a 10% chance of a draw ocurring.
		</li>
	</ul>

	<p><b>How to use the calculator: </b></p>
	<p>
		Add or remove Teams and assign each the correct number of players present in your game.<br
		/>Then assign each Team the correct <b>Rank</b>, meaning Placement in the game. The lower the
		rank, the better. <br />
		If two or more Teams draw with each other, assign them the same rank. <br />
		You can also assign <b>Weights</b> between 0 and 1 to each Player. A Weight of 1 means the
		Player has played the whole match, and values below 1 mean the Player has left the game early.
		<br />
		The expected results will appear in the <b>Resulting Teams</b> section. <br />
		Also, you can see the <b>Match Quality</b> which is the percent chance of your match ending in a
		draw. The higher this value, the closer your match will be.<br /> <br />
		When you're done you can copy the resulting Teams to your clipboard in CSV format all at once or
		one-by-one. <br />
		This calculator supports up to 128 Teams with up to 256 players each.
		<br /> <br />
		Thanks for using this calculator! <br />
		Feel free to check me out on
		<a href="https://github.com/atomflunder/TrueSkill-Calculator">GitHub</a>.
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
