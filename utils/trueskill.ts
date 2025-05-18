import { type TrueSkill, Rating } from 'ts-trueskill';
import type {
    ResultingPlayer,
    InitialTeam,
    ResultingTeam,
} from '~/types/trueskill';

/**
 * Calculates the new TrueSkill ratings of the teams.
 *
 * @param env The TrueSkill environment.
 * @param currentTeams The teams to calculate the ratings for.
 * @returns The new resulting teams, with a expected score and rating changes for every player.
 */
export function calculateRatings(
    env: TrueSkill,
    currentTeams: InitialTeam[]
): ResultingTeam[] {
    if (currentTeams.length === 0) {
        return [];
    }

    const expectedScores = calculateExpectedScores(env, currentTeams);

    if (!currentTeams.every((team) => team.players.length > 0)) {
        const resultingTeams = Array<ResultingTeam>(currentTeams.length);
        for (let i = 0; i < currentTeams.length; i++) {
            const team = currentTeams[i];
            const players = Array<ResultingPlayer>(team.players.length);
            for (let j = 0; j < team.players.length; j++) {
                const p = team.players[j];
                players[j] = {
                    name: p.name,
                    rating: p.rating,
                    weight: p.weight,
                    ratingChanges: [0, 0],
                    suggestedRank: p.rating[0] - p.rating[1] * 3,
                };
            }
            resultingTeams[i] = {
                name: team.name,
                players,
                expectedScore: expectedScores[i],
                rank: team.rank,
            };
        }
        return resultingTeams;
    }

    const ranks = Array<number>(currentTeams.length);
    const ratings = Array<Rating[]>(currentTeams.length);
    const weights = Array<number[]>(currentTeams.length);

    for (let i = 0; i < currentTeams.length; i++) {
        const team = currentTeams[i];
        ranks[i] = team.rank;

        const teamRatings = Array<Rating>(team.players.length);
        const teamWeights = Array<number>(team.players.length);

        for (let j = 0; j < team.players.length; j++) {
            const player = team.players[j];
            teamRatings[j] = new Rating(player.rating[0], player.rating[1]);
            teamWeights[j] = player.weight;
        }

        ratings[i] = teamRatings;
        weights[i] = teamWeights;
    }

    const newRatings = env.rate(ratings, ranks, weights);

    const newTeams = Array<ResultingTeam>(currentTeams.length);
    for (let i = 0; i < currentTeams.length; i++) {
        const team = currentTeams[i];
        const players = Array<ResultingPlayer>(team.players.length);

        for (let j = 0; j < team.players.length; j++) {
            const oldRating = ratings[i][j];
            const newRating = newRatings[i][j];

            players[j] = {
                name: team.players[j].name,
                weight: team.players[j].weight,
                rating: [newRating.mu, newRating.sigma],
                ratingChanges: [
                    newRating.mu - oldRating.mu,
                    newRating.sigma - oldRating.sigma,
                ],
                suggestedRank: newRating.mu - newRating.sigma * 3,
            };
        }

        newTeams[i] = {
            name: team.name,
            rank: team.rank,
            expectedScore: expectedScores[i],
            players,
        };
    }

    return newTeams;
}

/**
 * Calculates the match quality in percent, from 0 - 100.
 *
 * @param env The TrueSkill environment.
 * @param currentTeams The teams to calculate the match quality for.
 * @returns The match quality.
 */
export function calculateMatchQuality(
    env: TrueSkill,
    currentTeams: InitialTeam[]
) {
    if (
        currentTeams.length === 0 ||
        !currentTeams.every((t) => t.players.length > 0)
    ) {
        return 0;
    }

    const totalRatings = Array<Rating[]>(currentTeams.length);
    const totalWeights = Array<number[]>(currentTeams.length);

    for (let i = 0; i < currentTeams.length; i++) {
        const team = currentTeams[i];

        const currentRatings = new Array<Rating>(team.players.length);
        const currentWeights = new Array<number>(team.players.length);

        for (let j = 0; j < team.players.length; j++) {
            const player = team.players[j];
            currentRatings[j] = new Rating(player.rating[0], player.rating[1]);
            currentWeights[j] = player.weight;
        }

        totalRatings[i] = currentRatings;
        totalWeights[i] = currentWeights;
    }

    return env.quality(totalRatings, totalWeights);
}

/**
 * Calculates the expected scores for each team.
 * Not part of the original TrueSkill algorithm, but taken and adapted from here:
 * https://github.com/sublee/trueskill/issues/1#issuecomment-149762508
 *
 * @param env The TrueSkill environment.
 * @param currentTeams The teams to calculate the expected score for.
 * @returns The array of expected scores.
 */
export function calculateExpectedScores(
    env: TrueSkill,
    currentTeams: InitialTeam[]
): number[] {
    let playerCount = 0;
    for (let i = 0; i < currentTeams.length; i++) {
        playerCount += currentTeams[i].players.length;
    }

    const winProbabilities = Array<number[]>(currentTeams.length);
    let totalProbability = 0;

    for (let i = 0; i < currentTeams.length; i++) {
        const teamOne = currentTeams[i];
        let teamOneMuSum = 0;
        let teamOneSigmaSqSum = 0;

        for (let p = 0; p < teamOne.players.length; p++) {
            const rating = teamOne.players[p].rating;
            teamOneMuSum += rating[0];
            teamOneSigmaSqSum += rating[1] * rating[1];
        }

        const currentTeamProbabilities = Array<number>(currentTeams.length - 1);

        let ctpIndex = 0;
        for (let j = 0; j < currentTeams.length; j++) {
            if (i === j) {
                continue;
            }

            const teamTwo = currentTeams[j];
            let teamTwoMuSum = 0;
            let teamTwoSigmaSqSum = 0;

            for (let q = 0; q < teamTwo.players.length; q++) {
                const rating = teamTwo.players[q].rating;
                teamTwoMuSum += rating[0];
                teamTwoSigmaSqSum += rating[1] * rating[1];
            }

            const delta = teamOneMuSum - teamTwoMuSum;
            const denom = Math.sqrt(
                teamTwoSigmaSqSum +
                    teamOneSigmaSqSum +
                    playerCount * env.beta * env.beta
            );

            const result = env.guassian.cdf(delta / denom);
            currentTeamProbabilities[ctpIndex] = result;
            ctpIndex++;
            totalProbability += result;
        }

        winProbabilities[i] = currentTeamProbabilities;
    }

    const expectedScores = Array<number>(currentTeams.length);
    for (let i = 0; i < winProbabilities.length; i++) {
        const probs = winProbabilities[i];
        let sum = 0;
        for (let k = 0; k < probs.length; k++) {
            sum += probs[k];
        }
        expectedScores[i] = sum / totalProbability;
    }

    return expectedScores;
}
