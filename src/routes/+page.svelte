<script lang="ts">
    import { Rating, rate } from 'ts-trueskill';

    let player1 = new Rating(25, 25/3);
    let player2 = new Rating(25, 25/3);

	const calculateRatings = function (player1: Rating, player2: Rating): Rating[][] {
		return rate([[player1], [player2]], [1, 2]);
	}

    const result = calculateRatings(player1, player2);

</script>

<h1>Test project</h1>
<p>This will be a TrueSkill Calculator, eventually.
    The result is {result}.
</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

