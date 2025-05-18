import { TrueSkill } from 'ts-trueskill';
import type { TrueSkillBody, TrueSkillResult } from '~/types/trueskill';
import {
    getDefaultConfig,
    MAX_AMOUNT_PLAYERS,
    MAX_AMOUNT_TEAMS,
    MIN_AMOUNT_PLAYERS,
    MIN_AMOUNT_TEAMS,
} from '~/utils/config';
import { calculateRatings, calculateMatchQuality } from '~/utils/trueskill';

export default defineEventHandler(
    async (event): Promise<TrueSkillResult | undefined> => {
        const body = (await readBody(event)) as TrueSkillBody;

        if (
            !body.teams ||
            body.teams.length < MIN_AMOUNT_TEAMS ||
            body.teams.length > MAX_AMOUNT_TEAMS
        ) {
            setResponseStatus(
                event,
                400,
                `You need between ${MIN_AMOUNT_TEAMS} and ${MAX_AMOUNT_TEAMS} teams!`
            );
            return;
        }

        if (
            !body.teams.every(
                (c) =>
                    c.players.length >= MIN_AMOUNT_PLAYERS &&
                    c.players.length <= MAX_AMOUNT_PLAYERS
            )
        ) {
            setResponseStatus(
                event,
                400,
                `You need between ${MIN_AMOUNT_PLAYERS} and ${MAX_AMOUNT_PLAYERS} players per team!`
            );
            return;
        }

        let config = body.config;
        if (!config) {
            config = getDefaultConfig();
        }

        const env = new TrueSkill(
            undefined,
            undefined,
            config.beta,
            config.tau,
            config.drawProbability
        );

        try {
            const teams = calculateRatings(env, body.teams);
            const matchQuality = calculateMatchQuality(env, body.teams);

            return {
                teams,
                matchQuality,
            };
        } catch (error) {
            setResponseStatus(
                event,
                400,
                `Calculations failed. Make sure you have valid values for each player and team(e.g. Sigma != 0). \nUnderlying Error: ${error}`
            );
            return;
        }
    }
);
