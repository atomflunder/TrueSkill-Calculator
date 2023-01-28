# TrueSkill Calculator

A simple and fast Online TrueSkill calculator.  
[Link to the calculator](https://trueskill-calc.vercel.app/)

## What is TrueSkill?

TrueSkill is a modern rating system for multiplayer games developed by Microsoft Research. It is used in many games, including Halo, Gears of War, Forza Motorsport, Tom Clancy's: Rainbow Six Siege and many, many more.  
It uses a bayesian approach to calculate the skill of each player in a game. You can read more about it [here](https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/).

## Why?

The original, official TrueSkill calculator by Microsoft seems to have gone offline in 2018 and I could not find any replacement. [Link to Wayback Machine](https://web.archive.org/web/20230000000000*/http://boson.research.microsoft.com:80/trueskill/rankcalculator.aspx).  
So, I decided to create my own.

## How to use

Add or remove Teams and assign each the correct number of players present in your game.  
Then assign each Team the correct **Rank**, meaning Placement in the game. The lower the rank, the better.  
If two or more Teams draw with each other, assign them the same rank.  
You can also assign **Weights** between 0 and 1 to each Player. A Weight of 1 means the Player has played the whole match, and values below 1 mean the Player has left the game early.  
The expected results will appear in the **Resulting Teams** section.  
Also, you can see the **Match Quality** which is the percent chance of your match ending in a draw. The higher this value, the closer your match will be.

When you're done you can copy the resulting Teams to your clipboard in CSV format all at once or one-by-one.

This calculator supports up to 128 Teams with up to 256 players each.

## Configuration

You can configure the following settings to adjust the algorithm to your needs:

- **Default Mu (μ):** The default Value of Mu (μ) for new players. By default set to 25.
- **Default Sigma (σ):** The default Value of Sigma (σ) for new players. By default set to 25/3 ≈ 8.333.
- **Beta (β):** The distance in rating points to guarantee about a 76% chance of winning for the higher rated player. If your game is more luck based, set this higher. If your game is more reliant on pure skill, set this to a lower value. By default set to 25/6 ≈ 4.167.
- **Tau (τ):** The additive dynamics factor, the higher the value, the more dynamic the ratings will be. By default set to 25/300 ≈ 0.083.
- **Draw Probability:** The chance of a draw occurring in your game. If your game is draw-heavy (e.g. High-level chess) set this higher. If draws are unlikely to occur, set this lower. If draws are impossible by design set this to 0. By default set to 0.1, meaning a 10% chance of a draw ocurring.

## Contributing

Contributions of any kind are always welcome.  
If you find a bug or have a feature request, please open an issue.  
Alternatively you can also open a pull request to add features and fix bugs directly.

Thanks for your help!

## Running locally

1. Clone the repository
2. Install the dependencies with `npm install`
3. Run the dev server with `npm run dev`
4. Open [localhost:5173](http://localhost:5173) in your browser

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Packages used

- [Svelte](https://svelte.dev/)
- [ts-trueskill](https://www.npmjs.com/package/ts-trueskill)
