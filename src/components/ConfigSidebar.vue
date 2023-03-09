<script setup lang="ts">
import { onBeforeUpdate } from 'vue';

defineProps<{
	muValue: number;
	sigmaValue: number;
	teamSizeValue: number;
	betaValue: number;
	tauValue: number;
	drawProbability: number;
	disableLiveUpdates: boolean;
}>();

const emit = defineEmits([
	'reset-config',
	'mu-value',
	'sigma-value',
	'team-size-value',
	'beta-value',
	'tau-value',
	'draw-probability',
	'toggle-live-updates',
	'toggle-sidebar',
	'refresh-calculations'
]);

function resetConfig(): void {
	emit('reset-config');
}

onBeforeUpdate(() => {
	emit('refresh-calculations');
});
</script>

<template>
	<div
		class="fixed overflow-scroll scrollbar-hide top-0 left-0 h-screen min-h-full w-80 flex-col bg-gray-800 text-white drop-shadow-xl"
	>
		<h2 class="text-3xl p-2">
			Current Config:<button @click="$emit('toggle-sidebar')" class="float-right text-4xl">
				&lt;
			</button>
		</h2>

		<button class="sidebar-button shadow-blue-500 active:bg-gray-800 mb-8" @click="resetConfig">
			Reset Config
		</button>
		<hr />
		<table class="table-auto border-separate border-spacing-2">
			<tr>
				<td title="The default Value of Mu (μ) for new players.">
					<label for="default-mu">Default Mu (μ):</label>
				</td>
				<td>
					<input
						type="number"
						step="0.1"
						:value="muValue"
						@input="
							$emit('mu-value', parseFloat(($event.target as HTMLInputElement).value))
						"
						class="sidebar-input"
						name="default-mu"
						id="default-mu"
					/>
				</td>
			</tr>
			<tr>
				<td title="The default Value of Sigma (σ) for new players.">
					<label for="default-sigma">Default Sigma (σ):</label>
				</td>
				<td>
					<input
						type="number"
						step="0.01"
						:value="sigmaValue"
						@input="
							$emit(
								'sigma-value',
								parseFloat(($event.target as HTMLInputElement).value)
							)
						"
						class="sidebar-input"
						name="default-sigma"
						id="default-sigma"
					/>
				</td>
			</tr>
			<tr>
				<td title="The default amount of players for new teams.">
					<label for="default-team-size">Default Team Size:</label>
				</td>
				<td>
					<input
						type="number"
						step="1"
						min="1"
						max="1024"
						:value="teamSizeValue"
						@input="
							$emit(
								'team-size-value',
								parseInt(($event.target as HTMLInputElement).value)
							)
						"
						class="sidebar-input"
						name="default-team-size"
						id="default-team-size"
					/>
				</td>
			</tr>
			<tr>
				<td
					title="The distance in rating points to guarantee about a 76% chance of winning for the higher rated player."
				>
					<label for="default-beta">Beta (β):</label>
				</td>
				<td>
					<input
						type="number"
						step="0.01"
						:value="betaValue"
						@input="
							$emit(
								'beta-value',
								parseFloat(($event.target as HTMLInputElement).value)
							)
						"
						class="sidebar-input"
						name="default-beta"
						id="default-beta"
					/>
				</td>
			</tr>
			<tr>
				<td
					title="The additive dynamics factor, the higher the value, the more dynamic the ratings."
				>
					<label for="default-tau">Tau (τ):</label>
				</td>
				<td>
					<input
						type="number"
						step="0.001"
						:value="tauValue"
						@input="
							$emit(
								'tau-value',
								parseFloat(($event.target as HTMLInputElement).value)
							)
						"
						class="sidebar-input"
						name="default-tau"
						id="default-tau"
					/>
				</td>
			</tr>
			<tr>
				<td title="The chance of a draw occurring in your game.">
					<label for="default-draw-probability">Draw Probability:</label>
				</td>
				<td>
					<input
						type="number"
						step="0.01"
						:value="drawProbability"
						@input="
							$emit(
								'draw-probability',
								parseFloat(($event.target as HTMLInputElement).value)
							)
						"
						class="sidebar-input"
						name="default-draw-probability"
						id="default-draw-probability"
					/>
				</td>
			</tr>
			<tr>
				<td
					title="Disable Live Updates. Use this for large amount of teams in order to reduce lag."
				>
					<label for="disable-live-updates">Disable Live Updates:</label>
				</td>
				<input
					type="checkbox"
					:checked="disableLiveUpdates"
					@click="$emit('toggle-live-updates')"
					class="appearance-none relative h-8 w-8 border border-gray-300 rounded-sm bg-gray-700 hover:bg-gray-600 focus:outline-none transition duration-200 mt-2 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
					name="disable-live-updates"
					id="disable-live-updates"
				/>
			</tr>
		</table>
		<hr />
		<p class="font-bold text-xl mt-3 -mb-3 mx-2">FAQ:</p>
		<br />

		<details class="sidebar-details details-animated">
			<summary>What is TrueSkill?</summary>
			<h3 class="text-xl">The TrueSkill Ranking System:</h3>
			<br />
			TrueSkill is a modern rating system for multiplayer games developed and patented by
			Microsoft Research. It is used in many games, including Halo, Gears of War, Forza
			Motorsport, Tom Clancy's: Rainbow Six Siege and many, many more. It uses a bayesian
			approach to calculate the skill of each player in a game. It is one of the most popular
			rating systems, besides
			<a href="https://en.wikipedia.org/wiki/Elo_rating_system">Elo</a> and
			<a href="https://en.wikipedia.org/wiki/Glicko_rating_system">Glicko-2</a>.
			<br />
			<br />
			A player's rating is represented by a Gaussian distribution, which is a bell curve. The
			mean of the distribution represents the player's skill, called Mu (µ), and the standard
			deviation represents the player's uncertainty about their skill, called Sigma (σ). The
			higher the standard deviation, the more uncertain the player is about their skill. This
			means that the real skill of a player is somewhere within μ±3σ, with a 99% confidence.
			<br />
			<br />
			<img
				src="../assets/trueskill-skilldia.jpg"
				width="228"
				height="200"
				alt="An example of a Player's Rating."
				class="justify-center mx-auto"
			/>
			<br />
			<br />
			The TrueSkill algorithm is very good at asserting the skill of a player <i>quickly</i>.
			Here is a table of the minimum amount of games needed to roughly determine a player's
			skill.
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

		<details class="sidebar-details details-animated">
			<summary>What do these Config Values mean?</summary>

			<h3 class="text-xl">Config Values Explained:</h3>
			<br />
			<h3 class="text-lg underline"><b class="font-semibold">Default Mu (μ):</b></h3>
			<p>
				The default Value of Mu (μ) for new players. This is the rating value that new
				players will start with.<br />
				<b class="font-semibold">By default set to 25</b>.
			</p>
			<br />

			<h3 class="text-lg underline"><b class="font-semibold">Default Sigma (σ):</b></h3>
			<p>
				The default Value of Sigma (σ) for new players. This is the rating uncertainty that
				new players will start with.<br />
				<b class="font-semibold">By default set to 25/3 ≈ 8.333</b>.
			</p>
			<br />

			<h3 class="text-lg underline"><b class="font-semibold">Default Team Size:</b></h3>
			<p>
				The default number of players per team.<br />
				<b class="font-semibold">By default set to 2</b>.
			</p>
			<br />

			<h3 class="text-lg underline"><b class="font-semibold">Beta (β):</b></h3>
			<p>
				The distance in rating points to guarantee about a 76% chance of winning for the
				higher rated player. If your game is more luck based, set this to a higher value. If
				your game is more reliant on pure skill, set this to a lower value.<br />
				<b class="font-semibold">By default set to 25/6 ≈ 4.167</b>.
			</p>
			<br />

			<h3 class="text-lg underline"><b class="font-semibold">Tau (τ):</b></h3>
			<p>
				The additive dynamics factor, the higher the value, the more dynamic the ratings
				will be. This means the winner will gain more rating, and the loser will lose more
				rating.<br />
				<b class="font-semibold">By default set to 25/300 ≈ 0.083</b>.
			</p>
			<br />

			<h3 class="text-lg underline"><b class="font-semibold">Draw Probability:</b></h3>
			<p>
				The probability of a draw occurring. If your game has a high chance of ending in a
				draw set this to a higher value. If your game has a low chance of ending in a draw
				set this to a lower value. You can also set this to 0 if draws are impossible.<br />
				<b class="font-semibold">By default set to 0.1</b>.
			</p>
			<br />

			<h3 class="text-lg underline"><b class="font-semibold">Disable Live Updates:</b></h3>
			<p>
				If you want to disable updating the teams on the fly. If you select this, you need
				to manually update the teams. Recommended if you have a lot of Teams and/or Players
				in order to reduce lag.<br />
				<b class="font-semibold">By default set to false</b>.
			</p>
		</details>

		<details class="sidebar-details details-animated">
			<summary>How do I use this Calculator?</summary>
			<h3 class="text-xl">How to use this calculator:</h3>
			<br />
			<ul class="list-disc pl-3">
				<li>
					Add or remove Teams and assign each the correct number of players present in
					your game.
				</li>
				<li>
					Assign each Team the correct Rank, meaning Placement in the game. The lower the
					rank, the better.<br />If two or more Teams draw with each other, assign them
					the same rank.
				</li>
				<li>
					Assign Weights between 0 and 1 to each Player. A Weight of 1 means the Player
					has played the whole match, and values below 1 mean the Player has left the game
					early. A Weight of 0 means the Player has not played at all.
				</li>
				<li>
					Optionally you can name each Team and Player to make it easier to identify them.
				</li>
			</ul>
			<br />
			The expected results will appear in the <b>Resulting Teams</b> section.
			<br />
			You can also see the <b>Match Quality</b> which is the percent chance of your match
			ending in a draw. The higher this value, the closer your match will be.<br />
			<br />
			If you have a lot of Teams and/or Players, it is recommended to disable updating the new
			teams on the fly by checking the Disable Live Updates Button on the Sidebar in order to
			reduce lag.
			<br />
			<br />
			When you're done you can copy the resulting Teams to your clipboard in CSV format all at
			once or one-by-one.
			<br />
			<br />
			This calculator supports up to 256 Teams with up to 128 players each theoretically,
			although you might run into floating point errors when having a lot of players.
		</details>

		<br />
		<p class="p-2">
			Thanks for using this calculator! <br />
			Feel free to visit my
			<a class="link" href="https://github.com/atomflunder/TrueSkill-Calculator">GitHub</a>.
		</p>

		<p class="items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto shadow-lg">
			<a href="https://github.com/atomflunder/TrueSkill-Calculator"
				><img
					src="../assets/github-mark-white.png"
					alt="Visit me on GitHub!"
					width="32"
					height="32"
			/></a>
		</p>
	</div>
</template>

<style scoped>
input[type='checkbox']:checked:after {
	content: '\2713';
	color: rgb(209 213 219);
	font-size: 1.5rem;
	position: absolute;
	left: 50%;
	top: 50%;
	-webkit-transform: translate(-50%, -50%);
	-moz-transform: translate(-50%, -50%);
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}

@keyframes fadeInDown {
	0% {
		opacity: 0;
		transform: translateY(-1.25em);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
.details-animated[open] {
	animation-name: fadeInDown;
	animation-duration: 0.5s;
}

.details-animated {
	transition: height 1s ease;
}
</style>
