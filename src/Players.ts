import { Rating } from 'ts-trueskill';

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type Player = {
	name: string;
	rating: Mutable<Rating>;
	weight: number;
};

/**
 * Creates a new player with a default rating, default name, and default weight.
 *
 * @param defaultMu - The default mu value
 * @param defaultSigma - The default sigma value
 * @param playerNumber - The player number, used for the name
 * @returns The new player
 */
export const getDefaultPlayer = (
	defaultMu: number,
	defaultSigma: number,
	playerNumber: number
): Player => {
	const player_rating: Mutable<Rating> = new Rating(defaultMu, defaultSigma);
	const player: Player = {
		name: `Player ${playerNumber}`,
		rating: player_rating,
		weight: 1
	};
	return player;
};
