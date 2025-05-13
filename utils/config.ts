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

/**
 * Gets a TrueSkillSettings object with sane defaults.
 *
 * @returns The TrueSkillSettings object.
 */
export function getDefaultConfig(): TrueSkillSettings {
    return {
        beta: 25 / 6,
        tau: 25 / 300,
        drawProbability: 0.1,
        defaultMu: 25,
        defaultSigma: 25 / 6,
        defaultTeamSize: 2,
    };
}

export const MIN_AMOUNT_TEAMS = 2;
export const MAX_AMOUNT_TEAMS = 256;
export const MIN_AMOUNT_PLAYERS = 1;
export const MAX_AMOUNT_PLAYERS = 128;
