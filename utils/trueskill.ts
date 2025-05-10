import { TrueSkill, Rating } from 'ts-trueskill';
import type { TrueSkillConfig } from './config';
import type { InitialTeam, ResultingTeam } from '~/types/trueskill';

/**
 * Calculates the new TrueSkill ratings of the teams.
 *
 * @param config The configuration for the TrueSkill parameters.
 * @param currentTeams The teams to calculate the ratings for.
 * @returns The new resulting teams, with a expected score and rating changes for every player.
 */
export function calculateRatings(
    config: TrueSkillConfig,
    currentTeams: InitialTeam[]
): ResultingTeam[] {
    if (currentTeams.length === 0) {
        return [];
    }

    const expectedScores = calculateExpectedScores(config, currentTeams);

    if (!currentTeams.every((c) => c.players.length > 0)) {
        const resultingTeams: ResultingTeam[] = [];

        for (const [i, team] of currentTeams.entries()) {
            resultingTeams.push({
                name: team.name,
                players: team.players.map((p) => ({
                    name: p.name,
                    rating: p.rating,
                    weight: p.weight,
                    ratingChanges: [0, 0] as [number, number],
                })),
                expectedScore: expectedScores[i],
                rank: team.rank,
            });
        }

        return resultingTeams;
    }

    const env = new TrueSkill(
        undefined,
        undefined,
        config.beta,
        config.tau,
        config.drawProbability
    );

    const ranks = currentTeams.map((team) => team.rank);
    const weights: number[][] = currentTeams.map((team) =>
        team.players.map((player) => player.weight)
    );
    const ratings: Rating[][] = currentTeams.map((team) =>
        team.players.map(
            (player) => new Rating(player.rating[0], player.rating[1])
        )
    );

    const newRatings: Rating[][] = env.rate(ratings, ranks, weights);

    const newTeams: ResultingTeam[] = [];

    for (const [i, team] of currentTeams.entries()) {
        newTeams.push({
            ...team,
            players: [],
            expectedScore: expectedScores[i],
        });
        for (const [j, player] of team.players.entries()) {
            newTeams[i].players.push({
                ...player,
                rating: [newRatings[i][j].mu, newRatings[i][j].sigma] as [
                    number,
                    number,
                ],
                ratingChanges: [
                    newRatings[i][j].mu - ratings[i][j].mu,
                    newRatings[i][j].sigma - ratings[i][j].sigma,
                ] as [number, number],
            });
        }
    }

    return newTeams;
}

/**
 * Calculates the match quality in percent, from 0 - 100.
 *
 * @param config The configuration for the TrueSkill parameters.
 * @param currentTeams The teams to calculate the match quality for.
 * @returns The match quality.
 */
export function calculateMatchQuality(
    config: TrueSkillConfig,
    currentTeams: InitialTeam[]
) {
    if (currentTeams.length === 0) {
        return 0;
    }

    if (!currentTeams.every((c) => c.players.length > 0)) {
        return 0;
    }

    const env = new TrueSkill(
        undefined,
        undefined,
        config.beta,
        config.tau,
        config.drawProbability
    );

    const ratings: Rating[][] = currentTeams.map((team) =>
        team.players.map(
            (player) => new Rating(player.rating[0], player.rating[1])
        )
    );
    const weights: number[][] = currentTeams.map((team) =>
        team.players.map((player) => player.weight)
    );
    return env.quality(ratings, weights) * 100;
}

/**
 * Calculates the expected scores for each team.
 * Not part of the original TrueSkill algorithm, but taken and adapted from here:
 * https://github.com/sublee/trueskill/issues/1#issuecomment-149762508
 *
 * @param config The configuration for the TrueSkill parameters.
 * @param teams The teams to calculate the expected score for.
 * @returns The array of expected scores.
 */
export function calculateExpectedScores(
    config: TrueSkillConfig,
    teams: InitialTeam[]
): number[] {
    const playerCount = teams
        .map((t) => t.players.length)
        .reduce((a, b) => b + a, 0);

    const env = new TrueSkill(
        undefined,
        undefined,
        config.beta,
        config.tau,
        config.drawProbability
    );

    const winProbabilities = [];
    let totalProbability = 0;

    for (const [i, teamOne] of teams.entries()) {
        const currentTeamProbabilities = [];

        const teamOneRatings = teamOne.players
            .map((p) => p.rating[0])
            .reduce((a, b) => b + a, 0);
        const teamOneUncertainties = teamOne.players
            .map((p) => p.rating[1] ** 2)
            .reduce((a, b) => b + a, 0);

        for (const [j, teamTwo] of teams.entries()) {
            if (i === j) {
                continue;
            }

            const teamTwoRatings = teamTwo.players
                .map((p) => p.rating[0])
                .reduce((a, b) => b + a, 0);
            const teamTwoUncertainties = teamTwo.players
                .map((p) => p.rating[1] ** 2)
                .reduce((a, b) => b + a, 0);

            const delta = teamOneRatings - teamTwoRatings;
            const denom = Math.sqrt(
                teamTwoUncertainties +
                    playerCount * config.beta ** 2 +
                    teamOneUncertainties
            );

            const result = env.guassian.cdf(delta / denom);

            currentTeamProbabilities.push(result);
            totalProbability += result;
        }

        winProbabilities.push(currentTeamProbabilities);
    }

    const expectedScores = [];

    for (const probability of winProbabilities) {
        expectedScores.push(
            probability.reduce((a, b) => b + a, 0) / totalProbability
        );
    }

    return expectedScores;
}
