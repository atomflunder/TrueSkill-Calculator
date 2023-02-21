import { describe, test, expect } from 'vitest';
import { calculateRatings, matchQuality } from '@/helpers/trueskill';
import { getFirstTwoTeams } from '@/helpers/teams';
import { TrueSkill } from 'ts-trueskill';
import { getDefaultPlayer } from '@/helpers/players';

describe('calculateRatings', () => {
	test('Calculates ratings for default teams', () => {
		const teams = getFirstTwoTeams();
		const env = new TrueSkill();
		const newTeams = calculateRatings(env, teams);
		expect(newTeams[0].players[0].rating[0].toFixed(3)).toEqual('28.108');
		expect(newTeams[0].players[1].rating[0].toFixed(3)).toEqual('28.108');
		expect(newTeams[1].players[0].rating[0].toFixed(3)).toEqual('21.892');
		expect(newTeams[1].players[1].rating[0].toFixed(3)).toEqual('21.892');

		expect(newTeams[0].players[0].rating[1].toFixed(3)).toEqual('7.774');
		expect(newTeams[0].players[1].rating[1].toFixed(3)).toEqual('7.774');
		expect(newTeams[1].players[0].rating[1].toFixed(3)).toEqual('7.774');
		expect(newTeams[1].players[1].rating[1].toFixed(3)).toEqual('7.774');
	});

	test('Calculates ratings for different teams', () => {
		const teams = [
			{
				name: 'Team 1',
				rank: 2,
				players: [getDefaultPlayer(1, 34.23, 7.22), getDefaultPlayer(2, 24.23, 3.22)]
			},
			{
				name: 'Team 2',
				rank: 1,
				players: [getDefaultPlayer(1, 12.23, 3.9), getDefaultPlayer(2, 26.23, 6.11)]
			},
			{
				name: 'Team 3',
				rank: 3,
				players: [getDefaultPlayer(1, 41.2, 4.22), getDefaultPlayer(2, 24.23, 5.08)]
			}
		];

		teams[1].players[0].weight = 0.8;

		const env = new TrueSkill();
		env.beta = 4.2;
		env.drawProbability = 0.3;

		const newTeams = calculateRatings(env, teams);

		expect(newTeams[0].players[0].rating[0].toFixed(3)).toEqual('31.239');
		expect(newTeams[0].players[1].rating[0].toFixed(3)).toEqual('23.635');
		expect(newTeams[1].players[0].rating[0].toFixed(3)).toEqual('15.936');
		expect(newTeams[1].players[1].rating[0].toFixed(3)).toEqual('37.596');
		expect(newTeams[2].players[0].rating[0].toFixed(3)).toEqual('36.799');
		expect(newTeams[2].players[1].rating[0].toFixed(3)).toEqual('17.854');

		expect(newTeams[0].players[0].rating[1].toFixed(3)).toEqual('5.742');
		expect(newTeams[0].players[1].rating[1].toFixed(3)).toEqual('3.101');
		expect(newTeams[1].players[0].rating[1].toFixed(3)).toEqual('3.754');
		expect(newTeams[1].players[1].rating[1].toFixed(3)).toEqual('5.176');
		expect(newTeams[2].players[0].rating[1].toFixed(3)).toEqual('3.937');
		expect(newTeams[2].players[1].rating[1].toFixed(3)).toEqual('4.577');
	});
});

describe('matchQuality', () => {
	test('Calculates match quality for default teams', () => {
		const teams = getFirstTwoTeams();
		const env = new TrueSkill();
		const quality = matchQuality(env, teams);
		expect(quality).toEqual('44.721%');
	});

	test('Calculates match quality for different teams', () => {
		const teams = [
			{
				name: 'Team 1',
				rank: 2,
				players: [getDefaultPlayer(1, 34.23, 7.22), getDefaultPlayer(2, 24.23, 3.22)]
			},
			{
				name: 'Team 2',
				rank: 1,
				players: [getDefaultPlayer(1, 12.23, 3.9), getDefaultPlayer(2, 26.23, 6.11)]
			},
			{
				name: 'Team 3',
				rank: 3,
				players: [getDefaultPlayer(1, 41.2, 4.22), getDefaultPlayer(2, 24.23, 5.08)]
			}
		];

		teams[1].players[0].weight = 0.8;

		const env = new TrueSkill();
		env.beta = 4.2;
		env.drawProbability = 0.3;

		const quality = matchQuality(env, teams);
		expect(quality).toEqual('1.908%');
	});
});
