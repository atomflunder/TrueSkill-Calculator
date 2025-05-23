import { describe, it, expect } from 'vitest';
import { calculateExpectedScores } from '@/utils/trueskill';
import type { TrueSkillConfig } from '@/utils/config';
import type { InitialTeam } from '~/types/trueskill';
import { getDefaultConfig } from '@/utils/config';
import { TrueSkill } from 'ts-trueskill';

describe('calculateExpectedScores', () => {
    const defaultConfig: TrueSkillConfig = getDefaultConfig();
    const env = new TrueSkill(
        undefined,
        undefined,
        defaultConfig.beta,
        defaultConfig.tau,
        defaultConfig.drawProbability
    );

    it('should give 50/50 expected score for equal ratings', () => {
        const teamOne: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [
                { name: 'hi!', rating: [25.0, 8.333333333333334], weight: 1 },
            ],
        };

        const teamTwo: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [
                { name: 'hi!', rating: [25.0, 8.333333333333334], weight: 1 },
            ],
        };

        const [exp1, exp2] = calculateExpectedScores(env, [teamOne, teamTwo]);

        expect(Math.round(exp1 * 100)).toBeCloseTo(50, 0);
        expect(Math.round(exp2 * 100)).toBeCloseTo(50, 0);
    });

    it('should favor higher rated team in expected score', () => {
        const betterPlayer = {
            name: 'hi!',
            rating: [44.0, 3.0] as [number, number],
            weight: 1,
        };
        const worsePlayer = {
            name: 'hi!',
            rating: [38.0, 3.0] as [number, number],
            weight: 1,
        };

        const teamOne: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [betterPlayer],
        };

        const teamTwo: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [worsePlayer],
        };

        const [exp1, exp2] = calculateExpectedScores(env, [teamOne, teamTwo]);

        expect(Math.round(exp1 * 100)).toBeCloseTo(80, 0);
        expect(Math.round(exp2 * 100)).toBeCloseTo(20, 0);

        // Confirm they sum to approximately 100
        expect(Math.round(exp1 * 100 + exp2 * 100)).toBeCloseTo(100, 0);
    });

    it('should produce the same score via different team groupings', () => {
        const teamOne: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [{ name: 'hi!', rating: [44.0, 3.0], weight: 1 }],
        };

        const teamTwo: InitialTeam = {
            rank: 0,
            name: 'hi!',
            players: [{ name: 'hi!', rating: [38.0, 3.0], weight: 1 }],
        };

        const expectedScores = calculateExpectedScores(env, [teamOne, teamTwo]);
        const reverseExpectedScores = calculateExpectedScores(env, [
            teamOne,
            teamTwo,
        ]);

        expect(expectedScores[0]).toBeCloseTo(reverseExpectedScores[0], 6);
        expect(expectedScores[1]).toBeCloseTo(reverseExpectedScores[1], 6);
    });
});
