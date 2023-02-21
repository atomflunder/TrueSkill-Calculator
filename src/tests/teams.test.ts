import { describe, test, expect } from 'vitest';
import { getDefaultTeam, getFirstTwoTeams } from '@/helpers/teams';

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
