# TrueSkill Calculator

A simple and fast Online TrueSkill calculator.  
[Link to the calculator](https://trueskill-calculator.vercel.app/)

## Table of Contents

- [What is TrueSkill?](#what-is-trueskill)
- [Why?](#why)
- [Usage](#usage)
    - [Website](#website)
    - [API](#api)
- [Configuration](#configuration)
    - [Config Settings](#config-settings)
    - [Website Settings](#website-settings)
- [Contributing](#contributing)
- [Running locally](#running-locally)
- [License](#license)
- [Packages used](#packages-used)

## What is TrueSkill?

TrueSkill is a modern rating system for multiplayer games developed and patented by Microsoft Research.
It is used in many games, including Halo, Gears of War, Forza Motorsport, Tom Clancy's: Rainbow Six
Siege and many, many more. It uses a bayesian approach to calculate the skill of each player in a
game. It is one of the most popular rating systems, besides [Elo](https://en.wikipedia.org/wiki/Elo_rating_system) and [Glicko-2](https://en.wikipedia.org/wiki/Glicko_rating_system).

A player's rating is represented by a Gaussian distribution, which is a bell curve. The mean of the
distribution represents the player's skill, called Mu (µ), and the standard deviation represents
the player's uncertainty about their skill, called Sigma (σ). The higher the standard deviation,
the more uncertain the player is about their skill. This means that the real skill of a player is
somewhere within μ±3σ, with a 99% confidence.

![](./assets/trueskill-skilldia.jpg)

The TrueSkill algorithm is very good at asserting the skill of a player <i>quickly</i>. Here is
a table of the minimum amount of games needed to roughly determine a player's skill.

| Game Mode                   | Minimum Games Needed |
| --------------------------- | -------------------- |
| 16 Players Free-For-All     | 3                    |
| 8 Players Free-For-All      | 3                    |
| 4 Players Free-For-All      | 5                    |
| 2 Players Free-For-All      | 12                   |
| 4 Teams with 2 Players each | 10                   |
| 4 Teams with 4 Players each | 20                   |
| 2 Teams with 4 Players each | 46                   |
| 2 Teams with 8 Players each | 91                   |

For more information, you can read the original paper on TrueSkill here:  
[TrueSkill(TM): A Bayesian Skill Rating System](https://www.microsoft.com/en-us/research/wp-content/uploads/2007/01/NIPS2006_0688.pdf)

## Why?

The original, official TrueSkill calculator by Microsoft seems to have gone offline in 2018 and I could not find any replacement. [Link to Wayback Machine](https://web.archive.org/web/20230000000000*/http://boson.research.microsoft.com:80/trueskill/rankcalculator.aspx).  
So, I decided to create my own.

## Usage

You can use this calculator via the website, or via the provided, 100% free, API.

### Website

TODO: Explain the website

### API

Instead of using the website directly, you can also use the provided API to calculate your results.

`POST /api/trueskill`

<details>
<summary>Sample Request Body:</summary>

```jsonc
{
    // config param is optional
    "config": {
        "beta": 4.166666666666667,
        "tau": 0.08333333333333333,
        "drawProbability": 0.1,
    },
    "teams": [
        {
            "name": "Team 1",
            "rank": 1,
            "players": [
                {
                    "name": "Pep",
                    "rating": [25.0, 8.33],
                    "weight": 1.0,
                },
                {
                    "name": "Pep 2",
                    "rating": [25.0, 8.33],
                    "weight": 1.0,
                },
                // more players ...
            ],
        },
        {
            "name": "Team 2",
            "rank": 2,
            "players": [
                {
                    "name": "Pep 3",
                    "rating": [25.0, 8.33],
                    "weight": 1.0,
                },
                {
                    "name": "Pep 4",
                    "rating": [25.0, 8.33],
                    "weight": 1.0,
                },
                // more players ...
            ],
        },
        // more teams ...
    ],
}
```

</details>

<details>
<summary>Sample Response Body:</summary>

```jsonc
{
    "teams": [
        {
            "name": "Team 1",
            "rank": 1,
            "players": [
                {
                    "name": "Pep",
                    "rating": [28.106874248258354, 7.771343226309424],
                    "weight": 1,
                    "ratingChanges": [3.1068742482583502, -0.5586567736905756],
                },
                {
                    "name": "Pep 2",
                    "rating": [28.106874248258354, 7.771343226309424],
                    "weight": 1,
                    "ratingChanges": [3.1068742482583502, -0.5586567736905756],
                },
            ],
            "expectedScore": 0.5,
        },
        {
            "name": "Team 2",
            "rank": 2,
            "players": [
                {
                    "name": "Pep 3",
                    "rating": [21.893125751741643, 7.771343226309424],
                    "weight": 1,
                    "ratingChanges": [-3.106874248258361, -0.5586567736905756],
                },
                {
                    "name": "Pep 4",
                    "rating": [21.893125751741643, 7.771343226309424],
                    "weight": 1,
                    "ratingChanges": [-3.106874248258361, -0.5586567736905756],
                },
            ],
            "expectedScore": 0.5,
        },
    ],
    "matchQuality": 44.73567439300163,
}
```

</details>

See also the OpenAPI Spec: [openapi.yml](./openapi.yml)

## Configuration

### Config Settings

The TrueSkill algorithm allows you to freely set these config parameters to tweak the rating calculations:

| Parameter            | Description                                                                                                                                                         | Default Value    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **Beta (β)**         | The distance in rating points to guarantee about a 76% chance of winning for the higher-rated player. Set higher for luck-based games, lower for skill-based games. | 25/6 ≈ 4.167     |
| **Tau (τ)**          | The additive dynamics factor. Higher values make ratings more dynamic—winners gain more, losers lose more.                                                          | 25/300 ≈ 0.083   |
| **Draw Probability** | The probability of a draw occurring. Set higher for draw-prone games, lower for decisive games. Can be set to 0 if draws are impossible.                            | 0.1 (10% chance) |

### Website Settings

On the website there are these additional settings:

| Parameter             | Description                                     | Default Value |
| --------------------- | ----------------------------------------------- | ------------- |
| **Default Mu (μ)**    | The default value of Mu (μ) for new players.    | 25            |
| **Default Sigma (σ)** | The default value of Sigma (σ) for new players. | 25/3 ≈ 8.333  |
| **Default Team Size** | The default team size of new teams.             | 2             |

## Contributing

Contributions of any kind are always welcome.  
If you find a bug or have a feature request, please open an issue.  
Alternatively you can also open a pull request to add features and fix bugs directly.

Thanks for your help!

## Running locally

1. Clone the repository
2. Install the dependencies with `bun install`
3. Run the dev server with `bun run dev`
4. Open [localhost:3000](http://localhost:3000) in your browser

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.  
However, please keep in mind that TrueSkill itself is patented for _commercial projects_ by Microsoft.

## Packages used

- [Vue](https://vuejs.org/)
- [Nuxt](https://vitejs.dev/)
- [ts-trueskill](https://www.npmjs.com/package/ts-trueskill)
