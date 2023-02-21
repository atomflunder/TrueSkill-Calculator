import { describe, test, expect } from 'vitest';
import { getDefaultPlayer } from '@/helpers/players';

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
