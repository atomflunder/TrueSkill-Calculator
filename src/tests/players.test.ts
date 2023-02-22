import { describe, test, expect } from 'vitest';
import { getDefaultPlayer, updatePlayerMuSigma } from '@/helpers/players';

describe('getDefaultPlayer', () => {
	test('Gets a default Player', () => {
		const player = getDefaultPlayer(1, 25, 8.333);
		expect(player.rating).toEqual([25, 8.333]);
		expect(player.name).toEqual('Player 1');
		expect(player.weight).toEqual(1);
	});

	test('Gets a player with different values', () => {
		const player = getDefaultPlayer(2, 100, 10);
		expect(player.rating).toEqual([100, 10]);
		expect(player.name).toEqual('Player 2');
		expect(player.weight).toEqual(1);
	});
});

describe('updatePlayerMuSigma', () => {
	test('Updates the mu and sigma values', () => {
		const player = getDefaultPlayer(1, 25, 8.333);
		updatePlayerMuSigma(player, 100, 10);
		expect(player.rating).toEqual([100, 10]);
	});

	test('Updates the mu and sigma values with 0', () => {
		const player = getDefaultPlayer(1, 25, 8.333);
		updatePlayerMuSigma(player, 0, 0);
		expect(player.rating).toEqual([25, 8.333]);
	});

	test('Updates the mu and sigma values with undefined', () => {
		const player = getDefaultPlayer(1, 25, 8.333);
		updatePlayerMuSigma(player, NaN, 2.0);
		expect(player.rating).toEqual([0, 2.0]);
	});
});
