import { TrueSkill, type Rating } from 'ts-trueskill';
import type { Mutable } from './Players';
import type { Team } from './Teams';

/**
 * Calculates the new ratings for the given teams and given TrueSkill environment.
 *
 * @param env - The TrueSkill environment
 * @param teams - The teams to calculate the new ratings for
 * @returns The new teams with the updated ratings
 */
export const calculateRatings = function (env: TrueSkill, teams: Team[]): Team[] {
	const ranks: number[] = teams.map((team) => team.rank);

	const weights: number[][] = teams.map((team) => team.players.map((player) => player.weight));

	const ratings: Mutable<Rating>[][] = teams.map((team) =>
		team.players.map((player) => player.rating)
	);

	const newRatings: Rating[][] = env.rate(ratings, ranks, weights, 0.0001);

	const newTeams: Team[] = structuredClone(teams);
	for (let i = 0; i < teams.length; i++) {
		for (let j = 0; j < teams[i].players.length; j++) {
			newTeams[i].players[j].rating = newRatings[i][j];
		}
	}
	return newTeams;
};

/**
 * Calculate the match quality for the given teams and given TrueSkill environment.
 *
 * @param env - The TrueSkill environment
 * @param teams - The teams to calculate the match quality for
 * @returns The match quality in percent, as a string.
 */
export const matchQuality = function (env: TrueSkill, teams: Team[]): string {
	const ratings: Rating[][] = teams.map((team) => team.players.map((player) => player.rating));
	const weights: number[][] = teams.map((team) => team.players.map((player) => player.weight));
	return `${(env.quality(ratings, weights) * 100).toFixed(3)}%`;
};

/**
 * Updates the teams and match quality for the given teams and given TrueSkill environment.
 *
 * @param currentTeams - The teams that are currently displayed
 * @param env - The TrueSkill environment
 * @returns The new teams with the updated ratings and the match quality
 */
export const updateCalculations = function (
	currentTeams: Team[],
	env: TrueSkill
): [Team[], string] {
	const newTeams: Team[] = calculateRatings(env, currentTeams);
	const quality: string = matchQuality(env, currentTeams);

	return [newTeams, quality];
};

/**
 * Updates the TrueSkill environment with the given parameters.
 *
 * @param defaultMu - The default mu value
 * @param defaultSigma - The default sigma value
 * @param betaValue - The beta value
 * @param tauValue - The tau value
 * @param drawProbability - The draw probability
 * @param currentTeams - The teams that are currently displayed
 * @returns The new TrueSkill environment, the new teams with the updated ratings and the match quality.
 */
export const updateConfig = function (
	defaultMu: number,
	defaultSigma: number,
	betaValue: number,
	tauValue: number,
	drawProbability: number,
	currentTeams: Team[]
): [TrueSkill, Team[], string] {
	const env: TrueSkill = new TrueSkill(
		defaultMu,
		defaultSigma,
		betaValue,
		tauValue,
		drawProbability
	);
	const newTeams: Team[] = calculateRatings(env, currentTeams);
	const quality: string = matchQuality(env, currentTeams);

	return [env, newTeams, quality];
};
