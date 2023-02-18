<script lang="ts">
import { copyMessage } from '@/helpers/copy';
import { Rating, TrueSkill } from 'ts-trueskill';
import { defineComponent } from 'vue';
import ConfigSidebar from '@/components/ConfigSidebar.vue';

type Player = {
	name: string;
	// We could just use a Rating object here,
	// but I guess it is good practice to use a tuple and convert to Rating on calculation.
	// At least we get warnings otherwise. Might be a performance loss though?
	rating: [number, number];
	weight: number;
};

type Team = {
	name: string;
	players: Player[];
	rank: number;
};

export default defineComponent({
	name: 'TrueskillCalculator',
	data() {
		return {
			env: new TrueSkill() as TrueSkill,
			teamCount: 2,
			currentTeams: this.getFirstTwoTeams() as Team[],
			newTeams: [] as Team[],
			liveUpdates: true,
			quality: '',
			copyAllMessage: '📋 Copy All Teams As CSV',
			copyTeamMessage: '📋 Copy Team As CSV',
			copiedMessage: '✔️ Copied to Clipboard!'
		};
	},
	methods: {
		resetConfig(): void {
			this.env = new TrueSkill();
			this.refreshCalculations();
		},
		toggleLiveUpdates(): void {
			console.log('Toggling live updates.');
			this.liveUpdates = !this.liveUpdates;
		},
		resetTeams(): void {
			this.teamCount = 2;
			this.currentTeams = this.getFirstTwoTeams();
			this.refreshCalculations();
		},
		refreshCalculations(): void {
			// Just a shortcut to calling both functions.
			if (this.liveUpdates) {
				this.newTeams = this.calculateRatings();
				this.quality = this.matchQuality();
			}
		},
		incrementTeamCount(): void {
			// Limit to 128 teams.
			// In reality, it starts to lag at around ~50-60 teams because of the calculations taking quite a long time.
			if (this.teamCount < 128) {
				this.teamCount++;
				const newTeam = this.getDefaultTeam(this.teamCount);
				this.currentTeams.push(newTeam);
				this.refreshCalculations();
			}
		},
		decrementTeamCount(): void {
			// Have to have at least 2 teams.
			if (this.teamCount > 2) {
				this.teamCount--;
				this.currentTeams.pop();
				this.refreshCalculations();
			}
		},
		addPlayerToTeam(teamIndex: number, playerIndex: number): void {
			// Limit to 256 players per team.
			// Same as for the teams, but the players do not lag as much.
			if (this.currentTeams[teamIndex].players.length < 256) {
				this.currentTeams[teamIndex].players.push(this.getDefaultPlayer(playerIndex));
				this.refreshCalculations();
			}
		},
		removePlayerFromTeam(teamIndex: number): void {
			// Have to have at least 1 player per team.
			if (this.currentTeams[teamIndex].players.length > 1) {
				this.currentTeams[teamIndex].players.pop();
				this.refreshCalculations();
			}
		},
		updatePlayerMuSigma(
			teamIndex: number,
			playerIndex: number,
			newMu: number,
			newSigma: number
		): void {
			if (!newMu) {
				newMu = 0;
			}

			// The sigma value could be positive or negative, but just not 0.
			// The mu value can be whatever.
			if (newSigma) {
				this.currentTeams[teamIndex].players[playerIndex].rating = [newMu, newSigma];
				this.refreshCalculations();
			}
		},
		updatePlayerWeight(teamIndex: number, playerIndex: number, newWeight: number): void {
			// The weight needs to be between 0 and 1.
			if (newWeight < 0 || !newWeight) {
				newWeight = 0;
			} else if (newWeight > 1) {
				newWeight = 1;
			}

			this.currentTeams[teamIndex].players[playerIndex].weight = newWeight;
			this.refreshCalculations();
		},
		updateTeamRanks(teamIndex: number, newRank: number): void {
			// In reality, if Team A has a rank of 1, it does not matter if Team B's rank is 2 or 300.
			// Similarly, Team A's rank could also be -129, it just checks if it is lower/higher than the other Team.
			// But to keep it simple and to avoid confusion, we limit the ranks to be between 0 and the number of teams.
			if (newRank < 1 || !newRank) {
				newRank = 1;
			} else if (newRank > this.teamCount) {
				newRank = this.teamCount;
			}

			this.currentTeams[teamIndex].rank = newRank;
			this.refreshCalculations();
		},
		getDefaultPlayer(playerNumber: number): Player {
			const playerRating: [number, number] = [this.env.mu, this.env.sigma];
			const player = {
				name: `Player ${playerNumber}`,
				rating: playerRating,
				weight: 1
			};
			return player;
		},
		getDefaultTeam(teamNumber: number): Team {
			const team = {
				name: `Team ${teamNumber}`,
				players: [this.getDefaultPlayer(1), this.getDefaultPlayer(2)],
				rank: teamNumber
			};
			return team;
		},
		getFirstTwoTeams(): Team[] {
			// Need a different function for the data above.
			const team1 = {
				name: 'Team 1',
				players: [
					{
						name: 'Player 1',
						rating: [25, 25 / 3] as [number, number],
						weight: 1
					},
					{
						name: 'Player 2',
						rating: [25, 25 / 3] as [number, number],
						weight: 1
					}
				],
				rank: 1
			};
			const team2 = {
				name: 'Team 2',
				players: [
					{
						name: 'Player 1',
						rating: [25, 25 / 3] as [number, number],
						weight: 1
					},
					{
						name: 'Player 2',
						rating: [25, 25 / 3] as [number, number],
						weight: 1
					}
				],
				rank: 2
			};
			return [team1, team2];
		},
		calculateRatings(): Team[] {
			const ranks = this.currentTeams.map((team) => team.rank);
			const weights: number[][] = this.currentTeams.map((team) =>
				team.players.map((player) => player.weight)
			);
			const ratings: Rating[][] = this.currentTeams.map((team) =>
				team.players.map((player) => new Rating(player.rating[0], player.rating[1]))
			);

			const newRatings: Rating[][] = this.env.rate(ratings, ranks, weights);

			const newTeams: Team[] = [];
			for (let i = 0; i < this.currentTeams.length; i++) {
				newTeams.push({ ...this.currentTeams[i], players: [] });
				for (let j = 0; j < this.currentTeams[i].players.length; j++) {
					newTeams[i].players.push({
						...this.currentTeams[i].players[j],
						rating: [newRatings[i][j].mu, newRatings[i][j].sigma] as [number, number]
					});
				}
			}
			return newTeams;
		},
		matchQuality(): string {
			const ratings: Rating[][] = this.currentTeams.map((team) =>
				team.players.map((player) => new Rating(player.rating[0], player.rating[1]))
			);
			const weights: number[][] = this.currentTeams.map((team) =>
				team.players.map((player) => player.weight)
			);
			return `${(this.env.quality(ratings, weights) * 100).toFixed(3)}%`;
		},
		teamToCsv(team: Team): string {
			return team.players
				.map((player) => {
					return `${team.name},${team.rank},${player.name},${player.rating[0]},${player.rating[1]},${player.weight}`;
				})
				.join('\r');
		},
		allTeamsToCsv(teams: Team[]): string {
			return teams
				.map((team) => {
					return this.teamToCsv(team);
				})
				.join('\r');
		},
		copyAllTeamsButton(): void {
			copyMessage(this.allTeamsToCsv(this.newTeams));
			const oldMessage = this.copyAllMessage;
			this.copyAllMessage = this.copiedMessage;
			setTimeout(() => {
				this.copyAllMessage = oldMessage;
			}, 1000);
		},
		copyOneTeamButton(i: number): void {
			copyMessage(this.teamToCsv(this.newTeams[i]));
			const button = document.getElementsByClassName('copy-csv-button')[i + 1];
			button.innerHTML = this.copiedMessage;
			setTimeout(() => {
				button.innerHTML = this.copyTeamMessage;
			}, 1000);
		}
	},
	components: {
		ConfigSidebar
	},
	mounted() {
		this.refreshCalculations();
	}
});
</script>

<template>
	<div>
		<title>TrueSkill Calculator</title>
		<h1 class="text-5xl p-2">TrueSkill Calculator</h1>

		<ConfigSidebar
			:mu-value="env.mu"
			:sigma-value="env.sigma"
			:beta-value="env.beta"
			:tau-value="env.tau"
			:draw-probability="env.drawProbability"
			@mu-value="
				env.mu = $event;
				refreshCalculations();
			"
			@sigma-value="
				env.sigma = $event;
				refreshCalculations();
			"
			@beta-value="
				env.beta = $event;
				refreshCalculations();
			"
			@tau-value="
				env.tau = $event;
				refreshCalculations();
			"
			@draw-probability="
				env.drawProbability = $event;
				refreshCalculations();
			"
			@reset-config="resetConfig"
			@toggle-live-updates="liveUpdates = !liveUpdates"
		/>

		<br />

		<table class="table-auto border-separate border-spacing-1">
			<tr>
				<td colspan="6">
					<b class="text-3xl">Starting Teams: ({{ teamCount }})</b>
					<button class="team-button shadow-green-500" @click="incrementTeamCount">
						Add New Team
					</button>

					<button class="team-button shadow-red-500" @click="decrementTeamCount">
						Remove Team
					</button>

					<button class="team-button shadow-blue-500" @click="resetTeams">
						Reset Teams
					</button>
				</td>
			</tr>

			<tr></tr>
			<tr></tr>

			<th class="text-2xl" title="The Name of the Team.">Team Name</th>
			<th
				class="text-2xl"
				title="The Rank, or the Placement of the Team. The lower the better."
			>
				Rank
			</th>
			<th class="text-2xl" title="The Names of the Players of this Team.">Players</th>
			<th class="text-2xl" title="The Mu (μ) Value of the Player.">Mu (μ)</th>
			<th class="text-2xl" title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
			<th
				class="text-2xl"
				title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
			>
				Weight
			</th>
			<tr></tr>

			<tr class="odd:bg-gray-800" v-for="(team, j) in currentTeams" :key="j">
				<td>
					<input
						class="team-input"
						type="text"
						v-model="team.name"
						@input="refreshCalculations"
					/>
				</td>
				<td>
					<input
						class="team-input"
						type="number"
						min="1"
						:max="teamCount"
						v-model.number.lazy="team.rank"
						@input="
							updateTeamRanks(j, ($event.target as HTMLInputElement).valueAsNumber);
							refreshCalculations();
						"
					/>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="text"
							v-model="player.name"
							@input="refreshCalculations"
						/>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="number"
							step="0.1"
							v-model.number.lazy="player.rating[0]"
							@input="
								updatePlayerMuSigma(
									j,
									i,
									($event.target as HTMLInputElement).valueAsNumber,
									player.rating[1]
								);
								refreshCalculations();
							"
						/>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="number"
							step="0.01"
							v-model.number.lazy="player.rating[1]"
							@input="
								updatePlayerMuSigma(
									j,
									i,
									player.rating[0],
									($event.target as HTMLInputElement).valueAsNumber
								);
								refreshCalculations();
							"
						/>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<input
							class="team-input"
							type="number"
							max="1"
							min="0"
							step="0.01"
							v-model.number.lazy="player.weight"
							@input="
								updatePlayerWeight(
									j,
									i,
									($event.target as HTMLInputElement).valueAsNumber
								);
								refreshCalculations();
							"
						/>
					</tr>
				</td>
				<button
					class="player-button shadow-green-500"
					@click="addPlayerToTeam(j, team.players.length + 1)"
				>
					Add Player
				</button>
				<button class="player-button shadow-red-500" @click="removePlayerFromTeam(j)">
					Remove Player
				</button>
			</tr>

			<tr v-show="!liveUpdates">
				<td>&nbsp;</td>
			</tr>

			<tr v-show="!liveUpdates">
				<td
					colspan="3"
					class="text-2xl text-center p-4 bg-gray-700 rounded border-white border hover:bg-gray-600 active:bg-gray-800 cursor-pointer shadow-md shadow-gray-500"
					@click="
						{
							newTeams = calculateRatings();
							quality = matchQuality();
						}
					"
				>
					<button>Calculate New Ratings</button>
				</td>
			</tr>

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

			<tr>
				<td colspan="6">
					<b class="text-3xl">Resulting Teams: ({{ teamCount }})</b>
					<button
						title="Copy All Teams as CSV"
						class="copy-csv-button ml-4 p-2 m-4"
						@click="copyAllTeamsButton"
					>
						{{ copyAllMessage }}
					</button>
				</td>
			</tr>

			<tr></tr>
			<tr></tr>

			<th class="text-2xl" title="The Name of the Team.">Team Name</th>
			<th
				class="text-2xl"
				title="The Rank, or the Placement of the Team. The lower the better."
			>
				Rank
			</th>
			<th class="text-2xl" title="The Names of the Players of this Team.">Players</th>
			<th class="text-2xl" title="The Mu (μ) Value of the Player.">Mu (μ)</th>
			<th class="text-2xl" title="The Sigma (σ) Value of the Player.">Sigma (σ)</th>
			<th
				class="text-2xl"
				title="How much of the Match the Player completed. 0 = Did not play at all, 1 = Played the whole Match."
			>
				Weight
			</th>

			<tr class="odd:bg-gray-800" v-for="(team, i) in newTeams" :key="i">
				<td>
					<div class="team-input">{{ team.name }}</div>
				</td>
				<td>
					<div class="team-input">{{ team.rank }}</div>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.name }}</div>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.rating[0] }}</div>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.rating[1] }}</div>
					</tr>
				</td>
				<td>
					<tr v-for="(player, i) in team.players" :key="i">
						<div class="team-input">{{ player.weight }}</div>
					</tr>
				</td>
				<button
					title="Copy Team as CSV"
					class="copy-csv-button"
					@click="copyOneTeamButton(i)"
				>
					{{ copyTeamMessage }}
				</button>
			</tr>
		</table>
	</div>
</template>
