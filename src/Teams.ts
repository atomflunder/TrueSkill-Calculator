import { getDefaultPlayer, type Player } from './Players';

export type Team = {
	name: string;
	players: Player[];
	rank: number;
};

export const getFirstTwoTeams = (defaultMu: number, defaultSigma: number): Team[] => {
	return [
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
};

export const getDefaultTeam = (
	defaultMu: number,
	defaultSigma: number,
	teamCount: number
): Team => {
	const newTeam = {
		name: `Team ${teamCount}`,
		players: [
			getDefaultPlayer(defaultMu, defaultSigma, 1),
			getDefaultPlayer(defaultMu, defaultSigma, 2)
		],
		rank: teamCount
	};
	return newTeam;
};
