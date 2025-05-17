import type { TrueSkillBody, TrueSkillResult } from '~/types/trueskill';
import { getDefaultConfig } from '~/utils/config';
import { calculateRatings, calculateMatchQuality } from '~/utils/trueskill';

export default defineEventHandler(
    async (event): Promise<TrueSkillResult | undefined> => {
        const body = (await readBody(event)) as TrueSkillBody;

        if (!body.teams || body.teams.length < 2) {
            setResponseStatus(event, 400, 'You need at least 2 teams!');
            return;
        }

        if (!body.teams.every((c) => c.players.length > 0)) {
            setResponseStatus(event, 400, 'One or more teams are empty!');
            return;
        }

        let config = body.config;
        if (!config) {
            config = getDefaultConfig();
        }

        const teams = calculateRatings(config, body.teams);
        const matchQuality = calculateMatchQuality(config, body.teams);

        return {
            teams,
            matchQuality,
        };
    }
);
