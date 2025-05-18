import type { InitialTeam } from '~/types/trueskill';
import {
    MAX_AMOUNT_PLAYERS,
    MAX_AMOUNT_TEAMS,
    MIN_AMOUNT_PLAYERS,
    MIN_AMOUNT_TEAMS,
    type TrueSkillSettings,
} from './config';
import { getDefaultPlayer } from './players';

/**
 * Gets a new team with default settings.
 *
 * @param settings The TrueSkill settings, used for default team size and default rating values.
 * @param teamIndex The index of the team to add
 * @returns The new team
 */
export function getDefaultTeam(
    settings: TrueSkillSettings,
    teamIndex: number
): InitialTeam {
    const players = [];

    for (let i = 0; i < settings.defaultTeamSize; i++) {
        players.push(getDefaultPlayer(settings, i + 1));
    }

    const team = {
        name: `Team ${teamIndex}`,
        players: players,
        rank: teamIndex,
    };
    return team;
}

/**
 * Gets the first two default teams for the initial UI.
 *
 * @returns The first two teams.
 */
export function getFirstTwoTeams(settings: TrueSkillSettings): InitialTeam[] {
    const team1 = {
        name: 'Team 1',
        players: [
            {
                name: 'Player 1',
                rating: [settings.defaultMu, settings.defaultSigma] as [
                    number,
                    number,
                ],
                weight: 1,
            },
            {
                name: 'Player 2',
                rating: [settings.defaultMu, settings.defaultSigma] as [
                    number,
                    number,
                ],
                weight: 1,
            },
        ],
        rank: 1,
    };
    const team2 = {
        name: 'Team 2',
        players: [
            {
                name: 'Player 1',
                rating: [settings.defaultMu, settings.defaultSigma] as [
                    number,
                    number,
                ],
                weight: 1,
            },
            {
                name: 'Player 2',
                rating: [settings.defaultMu, settings.defaultSigma] as [
                    number,
                    number,
                ],
                weight: 1,
            },
        ],
        rank: 2,
    };
    return [team1, team2];
}

/**
 * Adds a team to the current team list.
 *
 * @param settings The TrueSkill settings, used for default team size and default rating values.
 * @param currentTeams The current team list.
 */
export function addTeam(
    settings: TrueSkillSettings,
    currentTeams: InitialTeam[]
): void {
    if (currentTeams.length < MAX_AMOUNT_TEAMS) {
        const newTeam = getDefaultTeam(settings, currentTeams.length + 1);
        currentTeams.push(newTeam);
    }
}

/**
 * Removes a team from the current team list.
 *
 * @param currentTeams The current team list.
 * @param index The index of the team to remove.
 */
export function removeTeam(currentTeams: InitialTeam[], index: number): void {
    if (currentTeams.length > MIN_AMOUNT_TEAMS) {
        currentTeams.splice(index, 1);
    }
}

/**
 * Adds a new player to a team.
 *
 * @param settings The TrueSkill settings, used for default team size and default rating values.
 * @param team The team to add the player to.
 */
export function addPlayerToTeam(
    settings: TrueSkillSettings,
    team: InitialTeam
): void {
    if (team.players.length < MAX_AMOUNT_PLAYERS) {
        team.players.push(getDefaultPlayer(settings, team.players.length + 1));
    }
}

/**
 * Removes a player from a team.
 *
 * @param team The team to remove the player from.
 * @param index The index of the player to remove.
 */
export function removePlayerFromTeam(team: InitialTeam, index: number): void {
    if (team.players.length > MIN_AMOUNT_PLAYERS) {
        team.players.splice(index, 1);
    }
}

/**
 * Updates the team ranks within the valid bounds.
 *
 * @param team The team of which to update the rank.
 * @param currentTeamsLength The current amount of teams.
 * @param newRank The new desired rank.
 */
export function updateTeamRanks(
    team: InitialTeam,
    currentTeamsLength: number,
    newRank: number
): void {
    // In reality, if Team A has a rank of 1, it does not matter if Team B's rank is 2 or 300.
    // Similarly, Team A's rank could also be -129, it just checks if it is lower/higher than the other Team.
    // But to keep it simple and to avoid confusion, we limit the ranks to be between 1 and the number of teams.
    if (newRank < 1 || !newRank) {
        newRank = 1;
    } else if (newRank > currentTeamsLength) {
        newRank = currentTeamsLength;
    }

    team.rank = newRank;
}
