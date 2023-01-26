import type { TrueSkill, Rating } from 'ts-trueskill';
import type { Team } from './Teams';

export const calculateRatings = function (env: TrueSkill, teams: Team[]): Team[] {
	const ranks = [];
	for (let i = 0; i < teams.length; i++) {
		ranks.push(teams[i].rank);
	}

	const weights = [];
	// TODO: Add support for weights
	for (let i = 0; i < teams.length; i++) {
		const teamWeights = [];
		for (let j = 0; j < teams[i].players.length; j++) {
			teamWeights.push(1);
		}
		weights.push(teamWeights);
	}

	const ratings = [];
	for (let i = 0; i < teams.length; i++) {
		const teamRatings = [];
		for (let j = 0; j < teams[i].players.length; j++) {
			teamRatings.push(teams[i].players[j]);
		}
		ratings.push(teamRatings);
	}
	const newRatings = env.rate(ratings, ranks, weights, 0.0001);

	const newTeams = [];

	for (let i = 0; i < teams.length; i++) {
		const newTeam = {
			name: teams[i].name,
			players: newRatings[i],
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
			teamRatings.push(teams[i].players[j]);
		}
		ratings.push(teamRatings);
	}
	return `${env.quality(ratings)}`;
};
