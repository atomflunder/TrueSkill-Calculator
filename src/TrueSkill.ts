import { TrueSkill, type Rating } from 'ts-trueskill';
import type { Mutable } from './Players';
import type { Team } from './Teams';

export const calculateRatings = function (env: TrueSkill, teams: Team[]): Team[] {
	const ranks: number[] = [];
	for (let i = 0; i < teams.length; i++) {
		ranks.push(teams[i].rank);
	}

	const weights: number[][] = [];
	// TODO: Add support for weights
	for (let i = 0; i < teams.length; i++) {
		const teamWeights: number[] = [];
		for (let j = 0; j < teams[i].players.length; j++) {
			teamWeights.push(1);
		}
		weights.push(teamWeights);
	}

	const ratings: Mutable<Rating>[][] = [];
	for (let i = 0; i < teams.length; i++) {
		const teamRatings: Mutable<Rating>[] = [];
		for (let j = 0; j < teams[i].players.length; j++) {
			teamRatings.push(teams[i].players[j].rating);
		}
		ratings.push(teamRatings);
	}
	const newRatings = env.rate(ratings, ranks, weights, 0.0001);

	const newTeams: Team[] = [];
	for (let i = 0; i < teams.length; i++) {
		const newTeamRatings = [];

		for (let j = 0; j < teams[i].players.length; j++) {
			const newPlayer = {
				name: teams[i].players[j].name,
				rating: newRatings[i][j]
			};
			newTeamRatings.push(newPlayer);
		}

		const newTeam = {
			name: teams[i].name,
			players: newTeamRatings,
			rank: teams[i].rank
		};
		newTeams.push(newTeam);
	}

	return newTeams;
};

export const matchQuality = function (env: TrueSkill, teams: Team[]): string {
	const ratings: Rating[][] = [];
	for (let i = 0; i < teams.length; i++) {
		const teamRatings: Rating[] = [];
		for (let j = 0; j < teams[i].players.length; j++) {
			teamRatings.push(teams[i].players[j].rating);
		}
		ratings.push(teamRatings);
	}
	return `${(env.quality(ratings) * 100).toFixed(2)}%`;
};

export const updateCalculations = function (
	defaultMu: number,
	defaultSigma: number,
	betaValue: number,
	tauValue: number,
	drawProbability: number,
	currentTeams: Team[],
	env: TrueSkill,
	newTeams: Team[],
	quality: string
): [TrueSkill, Team[], string] {
	env = new TrueSkill(defaultMu, defaultSigma, betaValue, tauValue, drawProbability);
	newTeams = calculateRatings(env, currentTeams);
	quality = matchQuality(env, currentTeams);

	return [env, newTeams, quality];
};
