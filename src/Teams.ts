import type { Rating } from 'ts-trueskill';
import { getDefaultPlayer, type Mutable } from './Players';

export type Team = {
	name: string;
	players: Mutable<Rating>[];
	rank: number;
};

export const getDefaultTeam = (
	defaultMu: number,
	defaultSigma: number,
	teamCount: number
): Team => {
	const newTeam = {
		name: `Team ${teamCount}`,
		players: [getDefaultPlayer(defaultMu, defaultSigma), getDefaultPlayer(defaultMu, defaultSigma)],
		rank: teamCount
	};
	return newTeam;
};
