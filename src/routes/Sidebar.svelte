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

<div
	class="fixed overflow-auto scrollbar-hide top-0 left-0 h-screen w-80 flex flex-col bg-gray-800 text-white drop-shadow-xl"
>
	<h2 class="text-2xl p-2">Current Config:</h2>
	<button
		class="sidebar-button text-black bg-blue-300 hover:bg-blue-400"
		on:click={() => {
			resetConfig();
		}}>Reset Config</button
	>
	<hr />
	<table class="table-auto border-separate border-spacing-2">
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
					class="sidebar-input"
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
					class="sidebar-input"
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
					class="sidebar-input"
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
					class="sidebar-input"
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
					class="sidebar-input"
				/>
			</td>
		</tr>
	</table>
	<br />
	<hr />
	<p class="font-bold mt-3 mx-2">FAQ:</p>
	<br />

	<details class="sidebar-button w-72">
		<summary> What is TrueSkill? </summary>
		<h3 class="text-xl">The TrueSkill Ranking System:</h3>
		<br />
		TrueSkill is a modern rating system for multiplayer games developed and patented by Microsoft Research.
		It is used in many games, including Halo, Gears of War, Forza Motorsport, Tom Clancy's: Rainbow Six
		Siege and many, many more. It uses a bayesian approach to calculate the skill of each player in a
		game. It is one of the most popular rating systems, besides
		<a href="https://en.wikipedia.org/wiki/Elo_rating_system">Elo</a> and
		<a href="https://en.wikipedia.org/wiki/Glicko_rating_system">Glicko-2</a>.
		<br />
		<br />
		A player's rating is represented by a Gaussian distribution, which is a bell curve. The mean of the
		distribution represents the player's skill, called Mu (µ), and the standard deviation represents
		the player's uncertainty about their skill, called Sigma (σ). The higher the standard deviation,
		the more uncertain the player is about their skill. This means that the real skill of a player is
		somewhere within μ±3σ, with a 99% confidence.
		<br />
		<br />
		<img src="trueskill-skilldia.jpg" alt="An example of a Player's Rating." />
		<br />
		<br />
		The TrueSkill algorithm is very good at asserting the skill of a player <i>quickly</i>. Here is
		a table of the minimum amount of games needed to roughly determine a player's skill.
		<br />
		<br />
		<table class="border-collapse border border-slate-500">
			<th>Game Mode</th>
			<th>Minimum Games Needed</th>

			<tr class="table-border">
				<td class="table-border">16 Players Free-For-All</td>
				<td class="table-border">3</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">8 Players Free-For-All</td>
				<td class="table-border">3</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">4 Players Free-For-All</td>
				<td class="table-border">5</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">2 Players Free-For-All</td>
				<td class="table-border">12</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">4 Teams With 2 Players each</td>
				<td class="table-border">10</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">4 Teams With 4 Players each</td>
				<td class="table-border">20</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">2 Teams With 4 Players each</td>
				<td class="table-border">46</td>
			</tr>
			<tr class="table-border">
				<td class="table-border">2 Teams With 8 Players each</td>
				<td class="table-border">91</td>
			</tr>
		</table>
		<br />
		<br />
		For more information, you can read the original paper on TrueSkill here:
		<a
			class="link"
			href="https://www.microsoft.com/en-us/research/wp-content/uploads/2007/01/NIPS2006_0688.pdf"
			>TrueSkill(TM): A Bayesian Skill Rating System</a
		>
	</details>

	<details class="sidebar-button">
		<summary>What do these Config Values mean?</summary>

		<h3 class="text-xl">Config Values Explained:</h3>
		<br />
		<h3 class="text-lg underline"><b class="font-semibold">Default Mu (μ):</b></h3>
		<p>
			The default Value of Mu (μ) for new players. This is the rating value that new players will
			start with.<br />
			<b class="font-semibold">By default set to 25</b>.
		</p>
		<br />

		<h3 class="text-lg underline"><b class="font-semibold">Default Sigma (σ):</b></h3>
		<p>
			The default Value of Sigma (σ) for new players. This is the rating uncertainty that new
			players will start with.<br />
			<b class="font-semibold">By default set to 25/3 ≈ 8.333</b>.
		</p>
		<br />

		<h3 class="text-lg underline"><b class="font-semibold">Beta (β):</b></h3>
		<p>
			The distance in rating points to guarantee about a 76% chance of winning for the higher rated
			player. If your game is more luck based, set this to a higher value. If your game is more
			reliant on pure skill, set this to a lower value.<br />
			<b class="font-semibold">By default set to 25/6 ≈ 4.167</b>.
		</p>
		<br />

		<h3 class="text-lg underline"><b class="font-semibold">Tau (τ):</b></h3>
		<p>
			The additive dynamics factor, the higher the value, the more dynamic the ratings will be. This
			means the winner will gain more rating, and the loser will lose more rating.<br />
			<b class="font-semibold">By default set to 25/300 ≈ 0.083</b>.
		</p>
		<br />

		<h3 class="text-lg underline"><b class="font-semibold">Draw Probability:</b></h3>
		<p>
			The probability of a draw occurring. If your game has a high chance of ending in a draw set
			this to a higher value. If your game has a low chance of ending in a draw set this to a lower
			value. You can also set this to 0 if draws are impossible.<br />
			<b class="font-semibold">By default set to 0.1</b>.
		</p>
	</details>

	<details class="sidebar-button">
		<summary>How do I use this Calculator?</summary>
		<h3 class="text-xl">How to use this calculator:</h3>
		<br />
		<ul class="list-disc pl-3">
			<li>
				Add or remove Teams and assign each the correct number of players present in your game.
			</li>
			<li>
				Assign each Team the correct Rank, meaning Placement in the game. The lower the rank, the
				better.<br />If two or more Teams draw with each other, assign them the same rank.
			</li>
			<li>
				Assign Weights between 0 and 1 to each Player. A Weight of 1 means the Player has played the
				whole match, and values below 1 mean the Player has left the game early. A Weight of 0 means
				the Player has not played at all.
			</li>
		</ul>
		<br />
		The expected results will appear in the <b>Resulting Teams</b> section.
		<br />
		You can also see the <b>Match Quality</b> which is the percent chance of your match ending in a
		draw. The higher this value, the closer your match will be.<br /> <br />
		When you're done you can copy the resulting Teams to your clipboard in CSV format all at once or
		one-by-one.
		<br />
		<br />
		This calculator supports up to 128 Teams with up to 256 players each.
	</details>

	<br />
	<p class="p-2">
		Thanks for using this calculator! <br />
		Feel free to visit my
		<a class="link" href="https://github.com/atomflunder/TrueSkill-Calculator">GitHub</a>.
	</p>

	<p class="items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto shadow-lg">
		<a href="https://github.com/atomflunder/TrueSkill-Calculator"
			><img src={github_img} alt="Visit me on GitHub!" width="32" height="32" /></a
		>
	</p>
</div>
