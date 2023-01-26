import type { Rating } from 'ts-trueskill';

export type Team = {
	name: string;
	players: Rating[];
	rank: number;
};

export const teamToString = function (team: Team): string {
	let result = `${team.name} (#${team.rank})\n`;
	for (let i = 0; i < team.players.length; i++) {
		const rank = team.players[i].mu - 3 * team.players[i].sigma;
		result += `Mu (μ): ${team.players[i].mu.toFixed(3)} - Sigma (σ): ${team.players[
			i
		].sigma.toFixed(3)} - Rank: ${rank.toFixed(3)}\n`;
	}
	return result;
};
