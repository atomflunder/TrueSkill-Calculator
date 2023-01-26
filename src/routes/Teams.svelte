<script lang="ts">
    import { Rating, rate } from 'ts-trueskill';

    export let teamCount = 2;
    export let currentTeams: Rating[][] = [
        [new Rating(25, 25/3), new Rating(25, 25/3)],
        [new Rating(25, 25/3), new Rating(25, 25/3)]
    ];

    export const incrementTeamCount = () => {
        if (teamCount < 50) {
            teamCount += 1;
            currentTeams.push([new Rating(25, 25/3), new Rating(25, 25/3)]);
            currentTeams = currentTeams;
        }
    }

    export const decreaseTeamCount = () => {
        if (teamCount > 2) {
            teamCount -= 1;
            currentTeams.pop();
            currentTeams = currentTeams;
        }  
    }

	export const calculateRatings = function (players: Rating[][]): Rating[][] {
        const ranks = [];
        // TODO: Add support for draws
        for (let i = 0; i < players.length; i++) {
            ranks.push(i);
        }
		return rate(players, ranks);
	}

    export const teamToString = function(players: Rating[]): string {
        let result = '';
        for (let i = 0; i < players.length; i++) {
            const rank = players[i].mu - 3 * players[i].sigma;
            result += `Mu (μ): ${players[i].mu.toFixed(3)} - Sigma (σ): ${players[i].sigma.toFixed(3)} - Rank: ${rank.toFixed(3)}\n`;
        }
        return result;
    }
</script>

<h1>TrueSkill Online Calculator</h1>
<button on:click={() => incrementTeamCount()}>
    Add Team
</button>
<button on:click={() => decreaseTeamCount()}>
    Remove Team
</button>
<p>Starting Teams: ({teamCount})</p>
<ul>
	{#each currentTeams as team, i}
		<li>
			Team {i + 1}: {teamToString(team)}
		</li>
	{/each}
</ul>
<p>Resulting Teams: ({teamCount})</p>
<ul>
    {#each calculateRatings(currentTeams) as team, i}
        <li>
            Team {i + 1}: {teamToString(team)}
        </li>
    {/each}
</ul>