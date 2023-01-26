import { Rating } from 'ts-trueskill';

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export const getDefaultPlayer = (defaultMu: number, defaultSigma: number) => {
	const player: Mutable<Rating> = new Rating(defaultMu, defaultSigma);
	return player;
};
