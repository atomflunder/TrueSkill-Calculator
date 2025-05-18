import { describe, test, expect } from 'vitest';
import {
    getDefaultPlayer,
    updatePlayerMuSigma,
    updatePlayerWeight,
} from '@/utils/players';
import { getDefaultConfig } from '@/utils/config';

const defaultSettings: TrueSkillSettings = getDefaultConfig();

describe('getDefaultPlayer', () => {
    test('Gets a default Player', () => {
        const player = getDefaultPlayer(defaultSettings, 1);
        expect(player.rating).toEqual([25, 25 / 3]);
        expect(player.name).toEqual('Player 1');
        expect(player.weight).toEqual(1);
    });

    test('Gets a player with different values', () => {
        const settings = {
            ...defaultSettings,
            defaultMu: 100,
            defaultSigma: 10,
            defaultTeamSize: 2,
        };

        const player = getDefaultPlayer(settings, 2);
        expect(player.rating).toEqual([100, 10]);
        expect(player.name).toEqual('Player 2');
        expect(player.weight).toEqual(1);
    });
});

describe('updatePlayerValues', () => {
    test('Updates the mu and sigma values', () => {
        const player = getDefaultPlayer(defaultSettings, 1);
        updatePlayerMuSigma(player, 100, 10);
        expect(player.rating).toEqual([100, 10]);
    });

    test('Updates the mu and sigma values with 0', () => {
        const player = getDefaultPlayer(defaultSettings, 1);
        updatePlayerMuSigma(player, 0, 0);
        expect(player.rating).toEqual([25, 25 / 3]);
    });

    test('Updates the mu and sigma values with undefined', () => {
        const player = getDefaultPlayer(defaultSettings, 1);
        updatePlayerMuSigma(player, NaN, 2.0);
        expect(player.rating).toEqual([0, 2.0]);
    });

    test('Updates the weight value', () => {
        const player = getDefaultPlayer(defaultSettings, 1);
        updatePlayerWeight(player, 0.5);
        expect(player.weight).toEqual(0.5);
    });

    test('Updates the weight value with invalid values', () => {
        const player = getDefaultPlayer(defaultSettings, 1);
        updatePlayerWeight(player, -1);
        expect(player.weight).toEqual(0);

        updatePlayerWeight(player, 99);
        expect(player.weight).toEqual(1);
    });
});
