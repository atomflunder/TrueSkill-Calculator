/**
 * An initial player in a team to start the calculations for.
 */
export type InitialPlayer = {
    name: string;
    rating: [number, number];
    weight: number;
};

/**
 * A player with the newly calculated ratings and an additional ratingChanges tuple which holds the difference in mu and sigma to before.
 */
export type ResultingPlayer = InitialPlayer & {
    ratingChanges: [number, number];
};

/**
 * A team of initial players to start the calculations for.
 */
export type InitialTeam = {
    name: string;
    rank: number;
    players: InitialPlayer[];
};

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
