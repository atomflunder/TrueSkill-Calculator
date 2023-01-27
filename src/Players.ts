import { Rating } from 'ts-trueskill';

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type Player = {
	name: string;
	rating: Mutable<Rating>;
};

export const getDefaultPlayer = (defaultMu: number, defaultSigma: number, i: number): Player => {
	const player_rating: Mutable<Rating> = new Rating(defaultMu, defaultSigma);
	const player: Player = {
		name: `Player ${i}`,
		rating: player_rating
	};
	return player;
};
