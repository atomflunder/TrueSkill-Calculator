import { getDefaultPlayer, type Player } from './players';

export type Team = {
	name: string;
	players: Player[];
	rank: number;
};

export function getDefaultTeam(teamNumber: number, defaultMu: number, defaultSigma: number): Team {
	const team = {
		name: `Team ${teamNumber}`,
		players: [
			getDefaultPlayer(1, defaultMu, defaultSigma),
			getDefaultPlayer(2, defaultMu, defaultSigma)
		],
		rank: teamNumber
	};
	return team;
}

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
	return [team1, team2];
}
