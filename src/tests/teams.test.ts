import { describe, test, expect } from 'vitest';
import {
	addPlayerToTeam,
	allTeamsToCsv,
	decrementTeamCount,
	getDefaultTeam,
	getFirstTwoTeams,
	incrementTeamCount,
	removePlayerFromTeam,
	teamToCsv,
	updateTeamRanks
} from '@/helpers/teams';

describe('incrementTeamCount', () => {
	test('Increments the team count', () => {
		const teams = getFirstTwoTeams();
		expect(teams.length).toEqual(2);
		incrementTeamCount(teams, 1, 1, 1);
		expect(teams.length).toEqual(3);
	});
});

describe('decrementTeamCount', () => {
	test('Decrements the team count', () => {
		const teams = getFirstTwoTeams();
		expect(teams.length).toEqual(2);
		decrementTeamCount(teams);
		expect(teams.length).toEqual(2);
		incrementTeamCount(teams, 1, 1, 1);
		expect(teams.length).toEqual(3);
		decrementTeamCount(teams);
		expect(teams.length).toEqual(2);
	});
});

describe('addPlayerToTeam', () => {
	test('Adds a player to a team', () => {
		const teams = getFirstTwoTeams();
		expect(teams.length).toEqual(2);
		expect(teams[0].players.length).toEqual(2);
		expect(teams[1].players.length).toEqual(2);
		addPlayerToTeam(teams[0], 1, 1, 1);
		expect(teams[0].players.length).toEqual(3);
		expect(teams[1].players.length).toEqual(2);
	});
});

describe('removePlayerFromTeam', () => {
	test('Removes a player from a team', () => {
		const teams = getFirstTwoTeams();
		expect(teams.length).toEqual(2);
		expect(teams[0].players.length).toEqual(2);
		expect(teams[1].players.length).toEqual(2);
		removePlayerFromTeam(teams[0]);
		expect(teams[0].players.length).toEqual(1);
		expect(teams[1].players.length).toEqual(2);
	});
});

describe('updateTeamRanks', () => {
	test('Updates the team ranks', () => {
		const teams = getFirstTwoTeams();
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
		const team = getDefaultTeam(1, 2, 25, 8.333);
		expect(team.players.length).toEqual(2);
		expect(team.name).toEqual('Team 1');
		expect(team.rank).toEqual(1);
	});

	test('Gets a team with different values', () => {
		const team = getDefaultTeam(2, 3, 100, 10);
		expect(team.players.length).toEqual(3);
		expect(team.name).toEqual('Team 2');
		expect(team.rank).toEqual(2);
	});
});

describe('getFirstTwoTeams', () => {
	test('Gets the first two teams', () => {
		const teams = getFirstTwoTeams();
		expect(teams.length).toEqual(2);
		expect(teams[0].players.length).toEqual(2);
		expect(teams[1].players.length).toEqual(2);

		expect(teams[0].name).toEqual('Team 1');
		expect(teams[1].name).toEqual('Team 2');

		expect(teams[0].rank).toEqual(1);
		expect(teams[1].rank).toEqual(2);
	});
});

describe('teamToCsv', () => {
	test('Converts a team to a csv', () => {
		const team = getDefaultTeam(1, 2, 25, 8.333);
		const csv = teamToCsv(team);
		expect(csv).toEqual('Team 1,1,Player 1,25,8.333,1\rTeam 1,1,Player 2,25,8.333,1');
	});
});

describe('allTeamsToCsv', () => {
	test('Converts all teams to a csv', () => {
		const teams = getFirstTwoTeams();
		const csv = allTeamsToCsv(teams);
		expect(csv).toEqual(
			`Team 1,1,Player 1,25,8.333333333333334,1\rTeam 1,1,Player 2,25,8.333333333333334,1\rTeam 2,2,Player 1,25,8.333333333333334,1\rTeam 2,2,Player 2,25,8.333333333333334,1`
		);
	});
});
