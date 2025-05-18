import { run, bench, boxplot } from 'mitata';

import {
    calculateRatings,
    calculateExpectedScores,
    calculateMatchQuality,
} from '@/utils/trueskill';
import type { InitialTeam } from '~/types/trueskill';
import { getDefaultConfig } from '@/utils/config';
import { TrueSkill } from 'ts-trueskill';

const teams2v2v2v2: InitialTeam[] = [
    {
        name: 'TeamOne',
        players: [
            { name: 'Alice', rating: [23.3, 4.3], weight: 1 },
            { name: 'Bob', rating: [19.9, 2.3], weight: 1 },
        ],
        rank: 1,
    },
    {
        name: 'TeamTwo',
        players: [
            { name: 'Charlie', rating: [21.1, 3.5], weight: 1 },
            { name: 'Diana', rating: [20.7, 2.8], weight: 1 },
        ],
        rank: 2,
    },
    {
        name: 'TeamThree',
        players: [
            { name: 'Eve', rating: [22.0, 3.9], weight: 1 },
            { name: 'Frank', rating: [18.5, 2.1], weight: 1 },
        ],
        rank: 3,
    },
    {
        name: 'TeamFour',
        players: [
            { name: 'Grace', rating: [20.1, 3.2], weight: 1 },
            { name: 'Heidi', rating: [19.7, 2.9], weight: 1 },
        ],
        rank: 4,
    },
];

const teams4v4: InitialTeam[] = [
    {
        name: 'TeamAlpha',
        players: [
            { name: 'Alice', rating: [23.3, 4.3], weight: 1 },
            { name: 'Bob', rating: [19.9, 2.3], weight: 1 },
            { name: 'Charlie', rating: [21.1, 3.5], weight: 1 },
            { name: 'Diana', rating: [20.7, 2.8], weight: 1 },
        ],
        rank: 1,
    },
    {
        name: 'TeamBeta',
        players: [
            { name: 'Eve', rating: [22.0, 3.9], weight: 1 },
            { name: 'Frank', rating: [18.5, 2.1], weight: 1 },
            { name: 'Grace', rating: [20.1, 3.2], weight: 1 },
            { name: 'Heidi', rating: [19.7, 2.9], weight: 1 },
        ],
        rank: 2,
    },
];

const teams4v4v4v4: InitialTeam[] = [
    {
        name: 'TeamOne',
        players: [
            { name: 'Alice', rating: [23.3, 4.3], weight: 1 },
            { name: 'Bob', rating: [19.9, 2.3], weight: 1 },
            { name: 'Charlie', rating: [21.1, 3.5], weight: 1 },
            { name: 'Diana', rating: [20.7, 2.8], weight: 1 },
        ],
        rank: 1,
    },
    {
        name: 'TeamTwo',
        players: [
            { name: 'Eve', rating: [22.0, 3.9], weight: 1 },
            { name: 'Frank', rating: [18.5, 2.1], weight: 1 },
            { name: 'Grace', rating: [20.1, 3.2], weight: 1 },
            { name: 'Heidi', rating: [19.7, 2.9], weight: 1 },
        ],
        rank: 2,
    },
    {
        name: 'TeamThree',
        players: [
            { name: 'Ivan', rating: [24.0, 4.1], weight: 1 },
            { name: 'Judy', rating: [20.4, 3.0], weight: 1 },
            { name: 'Karl', rating: [19.2, 2.4], weight: 1 },
            { name: 'Laura', rating: [21.3, 3.3], weight: 1 },
        ],
        rank: 3,
    },
    {
        name: 'TeamFour',
        players: [
            { name: 'Mallory', rating: [23.5, 3.8], weight: 1 },
            { name: 'Niaj', rating: [22.2, 3.5], weight: 1 },
            { name: 'Olivia', rating: [20.9, 2.7], weight: 1 },
            { name: 'Peggy', rating: [19.5, 2.6], weight: 1 },
        ],
        rank: 4,
    },
];

const teams8v8: InitialTeam[] = [
    {
        name: 'TeamAlpha',
        players: [
            { name: 'Alice', rating: [23.3, 4.3], weight: 1 },
            { name: 'Bob', rating: [19.9, 2.3], weight: 1 },
            { name: 'Charlie', rating: [21.1, 3.5], weight: 1 },
            { name: 'Diana', rating: [20.7, 2.8], weight: 1 },
            { name: 'Ivan', rating: [24.0, 4.1], weight: 1 },
            { name: 'Judy', rating: [20.4, 3.0], weight: 1 },
            { name: 'Karl', rating: [19.2, 2.4], weight: 1 },
            { name: 'Laura', rating: [21.3, 3.3], weight: 1 },
        ],
        rank: 1,
    },
    {
        name: 'TeamBeta',
        players: [
            { name: 'Eve', rating: [22.0, 3.9], weight: 1 },
            { name: 'Frank', rating: [18.5, 2.1], weight: 1 },
            { name: 'Grace', rating: [20.1, 3.2], weight: 1 },
            { name: 'Heidi', rating: [19.7, 2.9], weight: 1 },
            { name: 'Mallory', rating: [23.5, 3.8], weight: 1 },
            { name: 'Niaj', rating: [22.2, 3.5], weight: 1 },
            { name: 'Olivia', rating: [20.9, 2.7], weight: 1 },
            { name: 'Peggy', rating: [19.5, 2.6], weight: 1 },
        ],
        rank: 2,
    },
];

const ffa2: InitialTeam[] = [
    {
        name: 'Alice',
        players: [{ name: 'Alice', rating: [23.3, 4.3], weight: 1 }],
        rank: 1,
    },
    {
        name: 'Bob',
        players: [{ name: 'Bob', rating: [19.9, 2.3], weight: 1 }],
        rank: 2,
    },
];

const ffa4: InitialTeam[] = [
    {
        name: 'Alice',
        players: [{ name: 'Alice', rating: [23.3, 4.3], weight: 1 }],
        rank: 1,
    },
    {
        name: 'Bob',
        players: [{ name: 'Bob', rating: [19.9, 2.3], weight: 1 }],
        rank: 2,
    },
    {
        name: 'Charlie',
        players: [{ name: 'Charlie', rating: [21.1, 3.5], weight: 1 }],
        rank: 3,
    },
    {
        name: 'Diana',
        players: [{ name: 'Diana', rating: [20.7, 2.8], weight: 1 }],
        rank: 4,
    },
];

const ffa8: InitialTeam[] = [
    {
        name: 'Alice',
        players: [{ name: 'Alice', rating: [23.3, 4.3], weight: 1 }],
        rank: 1,
    },
    {
        name: 'Bob',
        players: [{ name: 'Bob', rating: [19.9, 2.3], weight: 1 }],
        rank: 2,
    },
    {
        name: 'Charlie',
        players: [{ name: 'Charlie', rating: [21.1, 3.5], weight: 1 }],
        rank: 3,
    },
    {
        name: 'Diana',
        players: [{ name: 'Diana', rating: [20.7, 2.8], weight: 1 }],
        rank: 4,
    },
    {
        name: 'Eve',
        players: [{ name: 'Eve', rating: [22.0, 3.9], weight: 1 }],
        rank: 5,
    },
    {
        name: 'Frank',
        players: [{ name: 'Frank', rating: [18.5, 2.1], weight: 1 }],
        rank: 6,
    },
    {
        name: 'Grace',
        players: [{ name: 'Grace', rating: [20.1, 3.2], weight: 1 }],
        rank: 7,
    },
    {
        name: 'Heidi',
        players: [{ name: 'Heidi', rating: [19.7, 2.9], weight: 1 }],
        rank: 8,
    },
];

const ffa16: InitialTeam[] = [
    {
        name: 'Alice',
        players: [{ name: 'Alice', rating: [23.3, 4.3], weight: 1 }],
        rank: 1,
    },
    {
        name: 'Bob',
        players: [{ name: 'Bob', rating: [19.9, 2.3], weight: 1 }],
        rank: 2,
    },
    {
        name: 'Charlie',
        players: [{ name: 'Charlie', rating: [21.1, 3.5], weight: 1 }],
        rank: 3,
    },
    {
        name: 'Diana',
        players: [{ name: 'Diana', rating: [20.7, 2.8], weight: 1 }],
        rank: 4,
    },
    {
        name: 'Eve',
        players: [{ name: 'Eve', rating: [22.0, 3.9], weight: 1 }],
        rank: 5,
    },
    {
        name: 'Frank',
        players: [{ name: 'Frank', rating: [18.5, 2.1], weight: 1 }],
        rank: 6,
    },
    {
        name: 'Grace',
        players: [{ name: 'Grace', rating: [20.1, 3.2], weight: 1 }],
        rank: 7,
    },
    {
        name: 'Heidi',
        players: [{ name: 'Heidi', rating: [19.7, 2.9], weight: 1 }],
        rank: 8,
    },
    {
        name: 'Ivan',
        players: [{ name: 'Ivan', rating: [24.0, 4.1], weight: 1 }],
        rank: 9,
    },
    {
        name: 'Judy',
        players: [{ name: 'Judy', rating: [20.4, 3.0], weight: 1 }],
        rank: 10,
    },
    {
        name: 'Karl',
        players: [{ name: 'Karl', rating: [19.2, 2.4], weight: 1 }],
        rank: 11,
    },
    {
        name: 'Laura',
        players: [{ name: 'Laura', rating: [21.3, 3.3], weight: 1 }],
        rank: 12,
    },
    {
        name: 'Mallory',
        players: [{ name: 'Mallory', rating: [23.5, 3.8], weight: 1 }],
        rank: 13,
    },
    {
        name: 'Niaj',
        players: [{ name: 'Niaj', rating: [22.2, 3.5], weight: 1 }],
        rank: 14,
    },
    {
        name: 'Olivia',
        players: [{ name: 'Olivia', rating: [20.9, 2.7], weight: 1 }],
        rank: 15,
    },
    {
        name: 'Peggy',
        players: [{ name: 'Peggy', rating: [19.5, 2.6], weight: 1 }],
        rank: 16,
    },
];

const config = getDefaultConfig();

const env = new TrueSkill(
    undefined,
    undefined,
    config.beta,
    config.tau,
    config.drawProbability
);

boxplot(() => {
    bench('Ratings - 2v2v2v2', () => {
        calculateRatings(env, teams2v2v2v2);
    });

    bench('Ratings - 4v4', () => {
        calculateRatings(env, teams4v4);
    });

    bench('Ratings - 4v4v4v4', () => {
        calculateRatings(env, teams4v4v4v4);
    });

    bench('Ratings - 8v8', () => {
        calculateRatings(env, teams8v8);
    });

    bench('Ratings - 16 ffa', () => {
        calculateRatings(env, ffa16);
    });

    bench('Ratings - 8 ffa', () => {
        calculateRatings(env, ffa8);
    });

    bench('Ratings - 4 ffa', () => {
        calculateRatings(env, ffa4);
    });

    bench('Ratings - 2 ffa', () => {
        calculateRatings(env, ffa2);
    });
});

boxplot(() => {
    bench('Expected Scores - 2v2v2v2', () => {
        calculateExpectedScores(env, teams2v2v2v2);
    });

    bench('Expected Scores - 4v4', () => {
        calculateExpectedScores(env, teams4v4);
    });

    bench('Expected Scores - 4v4v4v4', () => {
        calculateExpectedScores(env, teams4v4v4v4);
    });

    bench('Expected Scores - 8v8', () => {
        calculateExpectedScores(env, teams8v8);
    });

    bench('Expected Scores - 16 ffa', () => {
        calculateExpectedScores(env, ffa16);
    });

    bench('Expected Scores - 8 ffa', () => {
        calculateExpectedScores(env, ffa8);
    });

    bench('Expected Scores - 4 ffa', () => {
        calculateExpectedScores(env, ffa4);
    });

    bench('Expected Scores - 2 ffa', () => {
        calculateExpectedScores(env, ffa2);
    });
});

boxplot(() => {
    bench('Match Quality - 2v2v2v2', () => {
        calculateMatchQuality(env, teams2v2v2v2);
    });

    bench('Match Quality - 4v4', () => {
        calculateMatchQuality(env, teams4v4);
    });

    bench('Match Quality - 4v4v4v4', () => {
        calculateMatchQuality(env, teams4v4v4v4);
    });

    bench('Match Quality - 8v8', () => {
        calculateMatchQuality(env, teams8v8);
    });

    bench('Match Quality - 16 ffa', () => {
        calculateMatchQuality(env, ffa16);
    });

    bench('Match Quality - 8 ffa', () => {
        calculateMatchQuality(env, ffa8);
    });

    bench('Match Quality - 4 ffa', () => {
        calculateMatchQuality(env, ffa4);
    });

    bench('Match Quality - 2 ffa', () => {
        calculateMatchQuality(env, ffa2);
    });
});

await run();
