export type Player = {
	name: string;
	// We could just use a Rating object here,
	// but I guess it is good practice to use a tuple and convert to Rating on calculation.
	// At least we get warnings otherwise. Might be a performance loss though?
	rating: [number, number];
	weight: number;
};

export function getDefaultPlayer(
	playerNumber: number,
	defaultMu: number,
	defaultSigma: number
): Player {
	const playerRating: [number, number] = [defaultMu, defaultSigma];
	const player = {
		name: `Player ${playerNumber}`,
		rating: playerRating,
		weight: 1
	};
	return player;
}
