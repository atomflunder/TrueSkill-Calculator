<h3>What is TrueSkill?</h3>
TrueSkill is a modern rating system for multiplayer games developed and patented by Microsoft Research.
It is used in many games, including Halo, Gears of War, Forza Motorsport, Tom Clancy's: Rainbow Six Siege
and many, many more. It uses a bayesian approach to calculate the skill of each player in a game. It
is one of the most popular rating systems, besides
<a href="https://en.wikipedia.org/wiki/Elo_rating_system">Elo</a> and
<a href="https://en.wikipedia.org/wiki/Glicko_rating_system">Glicko-2</a>.
<br />
<br />
A player's rating is represented by a Gaussian distribution, which is a bell curve. The mean of the distribution
represents the player's skill, called Mu (µ), and the standard deviation represents the player's uncertainty
about their skill, called Sigma (σ). The higher the standard deviation, the more uncertain the player
is about their skill. This means that the real skill of a player is somewhere within μ±3σ, with a 99%
confidence.
<br />
<br />
<img src="trueskill-skilldia.jpg" alt="An example of a Player's Rating." />
<br />
<br />
The TrueSkill algorithm is very good at asserting the skill of a player <i>quickly</i>. Here is a
table of the minimum amount of games needed to roughly determine a player's skill.
<br />
<br />
<table>
	<th>Game Mode</th>
	<th>Minimum Games Needed</th>

	<tr>
		<td>16 Players Free-For-All</td>
		<td>3</td>
	</tr>
	<tr>
		<td>8 Players Free-For-All</td>
		<td>3</td>
	</tr>
	<tr>
		<td>4 Players Free-For-All</td>
		<td>5</td>
	</tr>
	<tr>
		<td>2 Players Free-For-All</td>
		<td>12</td>
	</tr>
	<tr>
		<td>4 Teams With 2 Players each</td>
		<td>10</td>
	</tr>
	<tr>
		<td>4 Teams With 4 Players each</td>
		<td>20</td>
	</tr>
	<tr>
		<td>2 Teams With 4 Players each</td>
		<td>46</td>
	</tr>
	<tr>
		<td>2 Teams With 8 Players each</td>
		<td>91</td>
	</tr>
</table>
<br />
<br />
For more information, you can read the original paper on TrueSkill here:
<a href="https://www.microsoft.com/en-us/research/wp-content/uploads/2007/01/NIPS2006_0688.pdf"
	>TrueSkill(TM): A Bayesian Skill Rating System</a
>

<style>
	table {
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #f2f2f2;
		padding: 5px;
	}
</style>
