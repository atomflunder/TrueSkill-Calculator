import { describe, it, expect } from 'vitest';
import { calculateMatchQuality } from '@/utils/trueskill';
import type { TrueSkillConfig } from '@/utils/config';
import type { InitialTeam } from '~/types/trueskill';

describe('calculateMatchQuality (multi-team)', () => {
    const config: TrueSkillConfig = {
        beta: 4.166666666666667,
        tau: 0.08333333333333333,
        drawProbability: 0.1,
    };

    it('should calculate correct match quality for multiple teams', () => {
        const teamOne: InitialTeam = {
            rank: 1,
            name: 'hi!',
            players: [
                { name: 'hi!', rating: [25.0, 8.333333333333334], weight: 1 },
                { name: 'hi!', rating: [25.0, 8.333333333333334], weight: 1 },
            ],
        };

        const teamTwo: InitialTeam = {
            rank: 2,
            name: 'hi!',
            players: [
                { name: 'hi!', rating: [30.0, 3.0], weight: 1 },
                { name: 'hi!', rating: [30.0, 3.0], weight: 1 },
            ],
        };

        const teamThree: InitialTeam = {
            rank: 3,
            name: 'hi!',
            players: [
                { name: 'hi!', rating: [40.0, 2.0], weight: 1 },
                { name: 'hi!', rating: [40.0, 2.0], weight: 1 },
            ],
        };

        const result = calculateMatchQuality(config, [
            teamOne,
            teamTwo,
            teamThree,
        ]);

        expect(result).toBeCloseTo(0.01753834922394127, 6);
    });

    it('should return 0 for empty team list', () => {
        const result = calculateMatchQuality(config, []);
        expect(result).toBeLessThan(Number.EPSILON);
    });

    it('should return 0 if one team is empty', () => {
        const teamOne: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [
                { rating: [25.0, 8.333333333333334], weight: 1, name: 'hi!' },
                { rating: [25.0, 8.333333333333334], weight: 1, name: 'hi!' },
            ],
        };

        const emptyTeam: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [],
        };

        const result = calculateMatchQuality(config, [teamOne, emptyTeam]);
        expect(result).toBeLessThan(Number.EPSILON);
    });
});
