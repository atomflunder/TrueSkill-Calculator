import { describe, test, expect } from 'vitest';
import {
    addPlayerToTeam,
    removeTeam,
    getDefaultTeam,
    getFirstTwoTeams,
    addTeam,
    removePlayerFromTeam,
    updateTeamRanks,
} from '@/utils/teams';

const config: TrueSkillConfig = {
    beta: 25 / 6,
    tau: 25 / 300,
    drawProbability: 0.1,
};

const settings: TrueSkillSettings = {
    ...config,
    defaultMu: 25,
    defaultSigma: 25 / 3,
    defaultTeamSize: 2,
};

describe('incrementTeamCount', () => {
    test('Increments the team count', () => {
        const teams = getFirstTwoTeams(settings);
        expect(teams.length).toEqual(2);
        addTeam(settings, teams);
        expect(teams.length).toEqual(3);
    });
});

describe('decrementTeamCount', () => {
    test('Decrements the team count', () => {
        const teams = getFirstTwoTeams(settings);
        expect(teams.length).toEqual(2);
        removeTeam(teams, teams.length - 1);
        expect(teams.length).toEqual(2);
        addTeam(settings, teams);
        expect(teams.length).toEqual(3);
        removeTeam(teams, teams.length - 1);
        expect(teams.length).toEqual(2);
    });
});

describe('addPlayerToTeam', () => {
    test('Adds a player to a team', () => {
        const teams = getFirstTwoTeams(settings);
        expect(teams.length).toEqual(2);
        expect(teams[0].players.length).toEqual(2);
        expect(teams[1].players.length).toEqual(2);
        addPlayerToTeam(settings, teams[0]);
        expect(teams[0].players.length).toEqual(3);
        expect(teams[1].players.length).toEqual(2);
    });
});

describe('removePlayerFromTeam', () => {
    test('Removes a player from a team', () => {
        const teams = getFirstTwoTeams(settings);
        expect(teams.length).toEqual(2);
        expect(teams[0].players.length).toEqual(2);
        expect(teams[1].players.length).toEqual(2);
        removePlayerFromTeam(teams[0], teams[0].players.length - 1);
        expect(teams[0].players.length).toEqual(1);
        expect(teams[1].players.length).toEqual(2);
    });
});

describe('updateTeamRanks', () => {
    test('Updates the team ranks', () => {
        const teams = getFirstTwoTeams(settings);
        expect(teams.length).toEqual(2);
        expect(teams[0].rank).toEqual(1);
        expect(teams[1].rank).toEqual(2);
        updateTeamRanks(teams[0], teams.length, 9);
        expect(teams[0].rank).toEqual(2);
        expect(teams[1].rank).toEqual(2);
        updateTeamRanks(teams[1], teams.length, 0);
        expect(teams[0].rank).toEqual(2);
        expect(teams[1].rank).toEqual(1);
    });
});

describe('getDefaultTeam', () => {
    test('Gets a default Team', () => {
        const team = getDefaultTeam(settings, 1);
        expect(team.players.length).toEqual(2);
        expect(team.name).toEqual('Team 1');
        expect(team.rank).toEqual(1);
    });

    test('Gets a team with different values', () => {
        const settings: TrueSkillSettings = {
            ...config,
            defaultMu: 25,
            defaultSigma: 25 / 3,
            defaultTeamSize: 3,
        };

        const team = getDefaultTeam(settings, 2);
        expect(team.players.length).toEqual(3);
        expect(team.name).toEqual('Team 2');
        expect(team.rank).toEqual(2);
    });
});

describe('getFirstTwoTeams', () => {
    test('Gets the first two teams', () => {
        const teams = getFirstTwoTeams(settings);
        expect(teams.length).toEqual(2);
        expect(teams[0].players.length).toEqual(2);
        expect(teams[1].players.length).toEqual(2);

        expect(teams[0].name).toEqual('Team 1');
        expect(teams[1].name).toEqual('Team 2');

        expect(teams[0].rank).toEqual(1);
        expect(teams[1].rank).toEqual(2);
    });
});
