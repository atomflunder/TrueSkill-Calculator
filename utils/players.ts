import type { Player } from '~/types/trueskill';
import type { TrueSkillSettings } from './config';

/**
 * Gets a new player with default settings.
 *
 * @param settings The TrueSkill settings, used for default team size and default rating values.
 * @param playerIndex The index of the new player.
 * @returns The new player.
 */
export function getDefaultPlayer(
    settings: TrueSkillSettings,
    playerIndex: number
): Player {
    return {
        name: `Player ${playerIndex}`,
        rating: [settings.defaultMu, settings.defaultSigma],
        weight: 1.0,
    };
}

/**
 * Updates a player with new ratings in place, within bounds.
 *
 * @param player The player to update.
 * @param newMu The new mu value.
 * @param newSigma The new sigma value, do not set this to 0.
 */
export function updatePlayerMuSigma(
    player: Player,
    newMu: number,
    newSigma: number
) {
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
 * Updates a player with a new weight value, within bounds.
 *
 * @param player The player to update the weight for.
 * @param newWeight The new weight value, between 0 and 1.
 */
export function updatePlayerWeight(player: Player, newWeight: number) {
    // The weight needs to be between 0 and 1.
    if (newWeight < 0 || !newWeight) {
        newWeight = 0;
    } else if (newWeight > 1) {
        newWeight = 1;
    }

    player.weight = newWeight;
}
