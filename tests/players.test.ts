import { describe, test, expect } from 'vitest';
import { getDefaultPlayer, updatePlayerMuSigma } from '@/utils/players';

const config: TrueSkillConfig = {
    beta: 25 / 6,
    tau: 25 / 300,
    drawProbability: 0.1,
};

const settings: TrueSkillSettings = {
    ...config,
    defaultMu: 25,
    defaultSigma: 25 / 3,
    defaultTeamSize: 2,
};

describe('getDefaultPlayer', () => {
    test('Gets a default Player', () => {
        const player = getDefaultPlayer(settings, 1);
        expect(player.rating).toEqual([25, 25 / 3]);
        expect(player.name).toEqual('Player 1');
        expect(player.weight).toEqual(1);
    });

    test('Gets a player with different values', () => {
        const settings = {
            ...config,
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

describe('updatePlayerMuSigma', () => {
    test('Updates the mu and sigma values', () => {
        const player = getDefaultPlayer(settings, 1);
        updatePlayerMuSigma(player, 100, 10);
        expect(player.rating).toEqual([100, 10]);
    });

    test('Updates the mu and sigma values with 0', () => {
        const player = getDefaultPlayer(settings, 1);
        updatePlayerMuSigma(player, 0, 0);
        expect(player.rating).toEqual([25, 25 / 3]);
    });

    test('Updates the mu and sigma values with undefined', () => {
        const player = getDefaultPlayer(settings, 1);
        updatePlayerMuSigma(player, NaN, 2.0);
        expect(player.rating).toEqual([0, 2.0]);
    });
});
