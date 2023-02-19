import { getDefaultPlayer, type Player } from './players';

export type Team = {
	name: string;
	players: Player[];
	rank: number;
};

export function getDefaultTeam(
	teamNumber: number,
	teamSize: number,
	defaultMu: number,
	defaultSigma: number
): Team {
	const players = [];

	for (let i = 0; i < teamSize; i++) {
		players.push(getDefaultPlayer(i + 1, defaultMu, defaultSigma));
	}

	const team = {
		name: `Team ${teamNumber}`,
		players: players,
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
