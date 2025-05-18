import { describe, it, expect } from 'vitest';
import { calculateRatings } from '@/utils/trueskill';
import type { TrueSkillConfig } from '@/utils/config';
import type { InitialTeam } from '~/types/trueskill';
import { getDefaultConfig } from '@/utils/config';

const config: TrueSkillConfig = getDefaultConfig();

describe('calculateRatings', () => {
    it('handles multi-team updates (Rust parity)', () => {
        const teams: InitialTeam[] = [
            {
                name: 'Team 1',
                rank: 0,
                players: [
                    { name: 't1p1', rating: [40.0, 4.0], weight: 1 },
                    { name: 't1p2', rating: [45.0, 3.0], weight: 1 },
                ],
            },
            {
                name: 'Team 2',
                rank: 1,
                players: [
                    { name: 't2p1', rating: [20.0, 7.0], weight: 1 },
                    { name: 't2p2', rating: [19.0, 6.0], weight: 1 },
                    { name: 't2p3', rating: [30.0, 9.0], weight: 1 },
                    { name: 't2p4', rating: [10.0, 4.0], weight: 1 },
                ],
            },
            {
                name: 'Team 3',
                rank: 1,
                players: [
                    { name: 't3p1', rating: [50.0, 5.0], weight: 1 },
                    { name: 't3p2', rating: [30.0, 2.0], weight: 1 },
                ],
            },
        ];

        const results = calculateRatings(config, teams);

        const r = (t: number, p: number) => results[t].players[p].rating;
        expect(r(0, 0)[0]).toBeCloseTo(40.8768, 3);
        expect(r(0, 1)[0]).toBeCloseTo(45.4933, 3);
        expect(r(1, 0)[0]).toBeCloseTo(19.6086, 3);
        expect(r(1, 1)[0]).toBeCloseTo(18.7124, 3);
        expect(r(1, 2)[0]).toBeCloseTo(29.3531, 3);
        expect(r(1, 3)[0]).toBeCloseTo(9.8721, 3);
        expect(r(2, 0)[0]).toBeCloseTo(48.8298, 3);
        expect(r(2, 1)[0]).toBeCloseTo(29.8125, 3);

        expect(r(0, 0)[1]).toBeCloseTo(3.8395, 3);
        expect(r(0, 1)[1]).toBeCloseTo(2.9336, 3);
        expect(r(1, 0)[1]).toBeCloseTo(6.396, 3);
        expect(r(1, 1)[1]).toBeCloseTo(5.6245, 3);
        expect(r(1, 2)[1]).toBeCloseTo(7.6734, 3);
        expect(r(1, 3)[1]).toBeCloseTo(3.8914, 3);
        expect(r(2, 0)[1]).toBeCloseTo(4.59, 3);
        expect(r(2, 1)[1]).toBeCloseTo(1.9763, 3);

        expect(results[0].players[0].ratingChanges[0]).toBeCloseTo(0.8768, 3);
        expect(results[0].players[0].ratingChanges[1]).toBeCloseTo(-0.1604, 3);
    });

    it('handles free-for-all match results', () => {
        const teams: InitialTeam[] = [
            {
                name: 'Player 1',
                rank: 1,
                players: [{ name: 'p1', rating: [41.023, 2.1333], weight: 1 }],
            },
            {
                name: 'Player 2',
                rank: 3,
                players: [{ name: 'p2', rating: [21.0, 1.87], weight: 1 }],
            },
            {
                name: 'Player 3',
                rank: 2,
                players: [{ name: 'p3', rating: [42.0, 1.223], weight: 1 }],
            },
        ];

        const results = calculateRatings(config, teams);

        expect(results[0].players[0].rating[0]).toBeCloseTo(41.7209, 3);
        expect(results[1].players[0].rating[0]).toBeCloseTo(20.9972, 3);
        expect(results[2].players[0].rating[0]).toBeCloseTo(41.771, 3);

        expect(results[0].players[0].rating[1]).toBeCloseTo(2.0505, 3);
        expect(results[1].players[0].rating[1]).toBeCloseTo(1.8705, 3);
        expect(results[2].players[0].rating[1]).toBeCloseTo(1.2099, 3);
    });

    it('handles unlikely outcomes gracefully', () => {
        const teams: InitialTeam[] = [
            {
                name: 'Underdog',
                rank: 1,
                players: [{ name: 'p1', rating: [0.4, 8.1333], weight: 1 }],
            },
            {
                name: 'Loser',
                rank: 3,
                players: [{ name: 'p2', rating: [-21.0, 1.87], weight: 1 }],
            },
            {
                name: 'Expected Winner 1',
                rank: 2,
                players: [{ name: 'p3', rating: [122.0, 0.01], weight: 1 }],
            },
            {
                name: 'Expected Winner 2',
                rank: 2,
                players: [{ name: 'p4', rating: [-1.0, -1.223], weight: 1 }],
            },
        ];

        const results = calculateRatings(config, teams);

        expect(results[0].players[0].rating[0]).toBeCloseTo(46.8443, 3);
        expect(results[1].players[0].rating[0]).toBeCloseTo(-21.0, 3);
        expect(results[2].players[0].rating[0]).toBeCloseTo(121.9735, 3);
        expect(results[3].players[0].rating[0]).toBeCloseTo(3.5777, 3);

        expect(results[0].players[0].rating[1]).toBeCloseTo(4.4539, 3);
        expect(results[1].players[0].rating[1]).toBeCloseTo(1.8718, 3);
        expect(results[2].players[0].rating[1]).toBeCloseTo(0.0839, 3);
        expect(results[3].players[0].rating[1]).toBeCloseTo(1.1979, 3);
    });

    it('handles empty teams or players', () => {
        const results = calculateRatings(config, []);

        expect(results).toHaveLength(0);

        const teams: InitialTeam[] = [
            {
                name: 'One Player',
                rank: 1,
                players: [{ name: 'p1', rating: [25, 25 / 3], weight: 1 }],
            },
            {
                name: 'Empty Team',
                rank: 2,
                players: [],
            },
        ];

        const res = calculateRatings(config, teams);
        expect(res[0].players[0].rating[0]).toBeCloseTo(25);
        expect(res[0].players[0].rating[1]).toBeCloseTo(25 / 3);
        expect(res[1].players).toHaveLength(0);
    });
});
