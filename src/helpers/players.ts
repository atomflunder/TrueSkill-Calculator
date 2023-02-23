export type Player = {
	name: string;
	// We could just use a Rating object here,
	// but I guess it is good practice to use a tuple and convert to Rating on calculation.
	// At least we get warnings otherwise. Might be a performance loss though?
	rating: [number, number];
	weight: number;
};

/**
 * Updates the mu and sigma values of a player.
 * The sigma value cannot equal 0.
 *
 * @param player The player to update.
 * @param newMu The new mu value.
 * @param newSigma The new sigma value.
 */
export function updatePlayerMuSigma(player: Player, newMu: number, newSigma: number): void {
	if (!newMu) {
		newMu = 0;
	}

	// The sigma value could be positive or negative, but just not 0.
	// The mu value can be whatever.
	if (newSigma) {
		player.rating = [newMu, newSigma];
	}
}

/**
 * Updates the weight of a player.
 * The weight needs to be between 0 and 1.
 *
 * @param player The player to update.
 * @param newWeight The new weight value.
 */
export function updatePlayerWeight(player: Player, newWeight: number): void {
	// The weight needs to be between 0 and 1.
	if (newWeight < 0 || !newWeight) {
		newWeight = 0;
	} else if (newWeight > 1) {
		newWeight = 1;
	}

	player.weight = newWeight;
}

/**
 * Gets a default player object.
 *
 * @param playerNumber The number of the players in the existing team.
 * @param defaultMu The default mu value.
 * @param defaultSigma The default sigma value.
 * @returns The default player object.
 */
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
