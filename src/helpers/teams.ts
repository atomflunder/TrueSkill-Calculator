import { getDefaultPlayer, type Player } from './players';
import Consts from './consts';

export type Team = {
	name: string;
	players: Player[];
	rank: number;
};

/**
 * Increments the teams by 1 and adds the new team to the list of current teams.
 *
 * @param currentTeams The current teams.
 * @param defaultMu The default mu.
 * @param defaultSigma The default sigma.
 * @param teamSize The size of the teams.
 */
export function incrementTeamCount(
	currentTeams: Team[],
	defaultMu: number,
	defaultSigma: number,
	teamSize: number
): void {
	// The limit is kind of arbitrary.
	if (currentTeams.length < Consts.MAX_AMOUNT_TEAMS) {
		const newTeam = getDefaultTeam(currentTeams.length + 1, teamSize, defaultMu, defaultSigma);
		currentTeams.push(newTeam);
	}
}

/**
 * Decrements the teams by 1 and removes the last team from the list of current teams.
 *
 * @param currentTeams The current teams.
 */
export function decrementTeamCount(currentTeams: Team[]): void {
	if (currentTeams.length > Consts.MIN_AMOUNT_TEAMS) {
		currentTeams.pop();
	}
}

/**
 * Adds a default player to the team.
 *
 * @param team The team to add the player to.
 * @param playerIndex The index of the player.
 * @param defaultMu The default mu.
 * @param defaultSigma The default sigma.
 */
export function addPlayerToTeam(
	team: Team,
	playerIndex: number,
	defaultMu: number,
	defaultSigma: number
): void {
	if (team.players.length < Consts.MAX_AMOUNT_PLAYERS) {
		team.players.push(getDefaultPlayer(playerIndex + 1, defaultMu, defaultSigma));
	}
}

/**
 * Removes the last player from the team.
 *
 * @param team The team to remove the player from.
 */
export function removePlayerFromTeam(team: Team): void {
	if (team.players.length > Consts.MIN_AMOUNT_PLAYERS) {
		team.players.pop();
	}
}

/**
 * Updates the ranks of the teams.
 * The rank should be between 1 and the number of teams.
 *
 * @param team The team to update the rank of.
 * @param currentTeamsLength The current number of teams.
 * @param newRank The new rank.
 */
export function updateTeamRanks(team: Team, currentTeamsLength: number, newRank: number): void {
	// In reality, if Team A has a rank of 1, it does not matter if Team B's rank is 2 or 300.
	// Similarly, Team A's rank could also be -129, it just checks if it is lower/higher than the other Team.
	// But to keep it simple and to avoid confusion, we limit the ranks to be between 1 and the number of teams.
	if (newRank < 1 || !newRank) {
		newRank = 1;
	} else if (newRank > currentTeamsLength) {
		newRank = currentTeamsLength;
	}

	team.rank = newRank;
}

/**
 * Gets a default team.
 *
 * @param teamNumber The number of the team.
 * @param teamSize The size of the team.
 * @param defaultMu The default mu.
 * @param defaultSigma The default sigma.
 * @returns The generated team.
 */
export function getDefaultTeam(
	teamNumber: number,
	teamSize: number,
	defaultMu: number,
	defaultSigma: number
): Team {
	const players = [];

	for (let i = 0; i < teamSize; i++) {
		players.push(getDefaultPlayer(i + 1, defaultMu, defaultSigma));
	}

	const team = {
		name: `Team ${teamNumber}`,
		players: players,
		rank: teamNumber
	};
	return team;
}

/**
 * Gets the first two default teams to populate the calculator at the start.
 *
 * @returns The first two teams.
 */
export function getFirstTwoTeams(): Team[] {
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
	console.log(allTeamsToCsv([team1, team2]));
	return [team1, team2];
}

/**
 * Converts a team to a CSV string.
 *
 * @param team The team to convert to CSV.
 * @returns The CSV string.
 */
export function teamToCsv(team: Team): string {
	return team.players
		.map((player) => {
			return `${team.name},${team.rank},${player.name},${player.rating[0]},${player.rating[1]},${player.weight}`;
		})
		.join('\r');
}

/**
 * Converts multiple teams to a CSV string.
 *
 * @param teams The teams to convert to CSV.
 * @returns The CSV string.
 */
export function allTeamsToCsv(teams: Team[]): string {
	return teams
		.map((team) => {
			return teamToCsv(team);
		})
		.join('\r');
}
