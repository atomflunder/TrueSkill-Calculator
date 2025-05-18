import { describe, it, expect } from 'vitest';
import { calculateMatchQuality } from '@/utils/trueskill';
import type { TrueSkillConfig } from '@/utils/config';
import type { InitialTeam } from '~/types/trueskill';
import { getDefaultConfig } from '@/utils/config';
import { TrueSkill } from 'ts-trueskill';

describe('calculateMatchQuality (multi-team)', () => {
    const config: TrueSkillConfig = getDefaultConfig();
    const env = new TrueSkill(
        undefined,
        undefined,
        config.beta,
        config.tau,
        config.drawProbability
    );

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

        const result = calculateMatchQuality(env, [
            teamOne,
            teamTwo,
            teamThree,
        ]);

        expect(result).toBeCloseTo(0.01753834922394127, 6);
    });

    it('should return 0 for empty team list', () => {
        const result = calculateMatchQuality(env, []);
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

        const result = calculateMatchQuality(env, [teamOne, emptyTeam]);
        expect(result).toBeLessThan(Number.EPSILON);
    });
});
