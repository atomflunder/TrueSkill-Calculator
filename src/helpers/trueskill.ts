import { Rating, TrueSkill } from 'ts-trueskill';
import type { Team } from './teams';

/**
 * Calculates the new ratings for the teams with the TrueSkill library.
 *
 * @param env The TrueSkill environment.
 * @param currentTeams The current teams.
 * @returns The new teams.
 */
export function calculateRatings(env: TrueSkill, currentTeams: Team[]): Team[] {
	const ranks = currentTeams.map((team) => team.rank);
	const weights: number[][] = currentTeams.map((team) =>
		team.players.map((player) => player.weight)
	);
	const ratings: Rating[][] = currentTeams.map((team) =>
		team.players.map((player) => new Rating(player.rating[0], player.rating[1]))
	);

	const newRatings: Rating[][] = env.rate(ratings, ranks, weights);

	const newTeams: Team[] = [];
	for (let i = 0; i < currentTeams.length; i++) {
		newTeams.push({ ...currentTeams[i], players: [] });
		for (let j = 0; j < currentTeams[i].players.length; j++) {
			newTeams[i].players.push({
				...currentTeams[i].players[j],
				rating: [newRatings[i][j].mu, newRatings[i][j].sigma] as [number, number]
			});
		}
	}
	return newTeams;
}

/**
 * Returns the match quality as a string, in percentage.
 *
 * @param env The TrueSkill environment.
 * @param currentTeams The current teams.
 * @returns The match quality as a string, in percentage.
 */
export function matchQuality(env: TrueSkill, currentTeams: Team[]): string {
	const ratings: Rating[][] = currentTeams.map((team) =>
		team.players.map((player) => new Rating(player.rating[0], player.rating[1]))
	);
	const weights: number[][] = currentTeams.map((team) =>
		team.players.map((player) => player.weight)
	);
	return `${(env.quality(ratings, weights) * 100).toFixed(3)}%`;
}
