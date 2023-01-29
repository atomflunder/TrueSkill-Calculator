import { getDefaultPlayer, type Player } from './Players';

export type Team = {
	name: string;
	players: Player[];
	rank: number;
};

/**
 * Creates the first two teams, with two players each, with default ratings, default names, and default weights.
 * Used for the initial state.
 *
 * @param defaultMu - The default mu value
 * @param defaultSigma - The default sigma value
 * @returns - The first two teams
 */
export const getFirstTwoTeams = (defaultMu: number, defaultSigma: number): Team[] => {
	const defaultTeams: Team[] = [
		{
			name: 'Team 1',
			players: [
				getDefaultPlayer(defaultMu, defaultSigma, 1),
				getDefaultPlayer(defaultMu, defaultSigma, 2)
			],
			rank: 1
		},
		{
			name: 'Team 2',
			players: [
				getDefaultPlayer(defaultMu, defaultSigma, 1),
				getDefaultPlayer(defaultMu, defaultSigma, 2)
			],
			rank: 2
		}
	];

	return defaultTeams;
};

/**
 * Creates a new team with two players, with default ratings, default names, and default weights.
 * Used for every team after the first two.
 *
 * @param defaultMu - The default mu value
 * @param defaultSigma - The default sigma value
 * @param teamCount - The team number, used for the name
 * @returns The new team
 */
export const getDefaultTeam = (
	defaultMu: number,
	defaultSigma: number,
	teamCount: number
): Team => {
	const newTeam: Team = {
		name: `Team ${teamCount}`,
		players: [
			getDefaultPlayer(defaultMu, defaultSigma, 1),
			getDefaultPlayer(defaultMu, defaultSigma, 2)
		],
		rank: teamCount
	};

	return newTeam;
};

/**
 * Converts a team into a CSV string, used for copying to the clipboard.
 *
 * @param team - The team to be converted to a CSV string
 * @returns - The CSV string
 */
export const teamToCsv = (team: Team): string => {
	return team.players
		.map((player) => {
			return `${team.name},${team.rank},${player.name},${player.rating.mu},${player.rating.sigma},${player.weight}`;
		})
		.join('\r');
};

/**
 * Shortcut for converting all teams to a CSV string.
 *
 * @param teams - The teams to be converted to a CSV string
 * @returns - The CSV string
 */
export const allTeamsToCsv = (teams: Team[]): string => {
	return teams.map((team) => teamToCsv(team)).join('\r');
};
