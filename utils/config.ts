/**
 * Config parameters for the TrueSkill algorithm itself.
 */
export type TrueSkillConfig = {
    beta: number;
    tau: number;
    drawProbability: number;
};

/**
 * Settings used for the website UI.
 */
export type TrueSkillSettings = TrueSkillConfig & {
    defaultMu: number;
    defaultSigma: number;
    defaultTeamSize: number;
};

export const MIN_AMOUNT_TEAMS = 2;
export const MAX_AMOUNT_TEAMS = 256;
export const MIN_AMOUNT_PLAYERS = 1;
export const MAX_AMOUNT_PLAYERS = 128;
