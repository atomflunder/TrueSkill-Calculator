import * as v from 'valibot';

/**
 * An initial player in a team to start the calculations for.
 */
export type InitialPlayer = {
    name: string;
    rating: [number, number];
    weight: number;
};

export const InitialPlayerSchema = v.object({
    name: v.string(),
    rating: v.pipe(v.array(v.number()), v.length(2)),
    weight: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
});

/**
 * A player with the newly calculated ratings and an additional ratingChanges tuple which holds the difference in mu and sigma to before.
 */
export type ResultingPlayer = InitialPlayer & {
    ratingChanges: [number, number];
    suggestedRank: number;
};

/**
 * A team of initial players to start the calculations for.
 */
export type InitialTeam = {
    name: string;
    rank: number;
    players: InitialPlayer[];
};

export const InitialTeamSchema = v.object({
    name: v.string(),
    rank: v.number(),
    players: v.pipe(v.array(InitialPlayerSchema), v.minLength(1)),
});

export const InitialTeamsJSONSchema = v.object({
    teams: v.pipe(v.array(InitialTeamSchema), v.minLength(2)),
});

export const InitialPlayerCSVSchema = v.object({
    team_name: v.string(),
    team_rank: v.number(),
    player_name: v.string(),
    mu: v.number(),
    sigma: v.number(),
    weight: v.number(),
});

/**
 * A team with the newly calculated player ratings with an additional expected score for the team.
 */
export type ResultingTeam = InitialTeam & {
    players: ResultingPlayer[];
    expectedScore: number;
};

/**
 * Request body for the API.
 */
export type TrueSkillBody = {
    config?: TrueSkillConfig;
    teams: InitialTeam[];
};

/**
 * Result that is returned from the API.
 */
export type TrueSkillResult = {
    teams: ResultingTeam[];
    matchQuality: number;
};
