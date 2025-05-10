import type { TrueSkillBody, TrueSkillResult } from '~/types/trueskill';
import { calculateRatings, calculateMatchQuality } from '~/utils/trueskill';

export default defineEventHandler(
    async (event): Promise<TrueSkillResult | undefined> => {
        const body = (await readBody(event)) as TrueSkillBody;

        if (!body.teams || body.teams.length === 0) {
            setResponseStatus(event, 400, 'No teams supplied!');
            return;
        }

        if (!body.teams.every((c) => c.players.length > 0)) {
            setResponseStatus(event, 400, 'One or more teams are empty!');
            return;
        }

        let config = body.config;
        if (!config) {
            config = {
                beta: 25 / 6,
                tau: 25 / 300,
                drawProbability: 0.1,
            };
        }

        const teams = calculateRatings(config, body.teams);
        const matchQuality = calculateMatchQuality(config, body.teams);

        return {
            teams,
            matchQuality,
        };
    }
);
