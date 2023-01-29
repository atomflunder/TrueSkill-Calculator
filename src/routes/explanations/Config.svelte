<h3>Explanation of the values:</h3>
<table>
	<th>Config Value</th>
	<th>Explanation</th>
	<th>Default Setting</th>

	<tr>
		<td><b>Default Mu (μ)</b></td>
		<td>
			The default Value of Mu (μ) for new players. This is the rating value that new players will
			start with.
		</td>
		<td><b>25.0</b></td>
	</tr>

	<tr>
		<td><b>Default Sigma (σ)</b></td>
		<td>
			The default Value of Sigma (σ) for new players. This is the rating uncertainty that new
			players will start with.
		</td>
		<td>25/3 ≈ <b>8.333</b></td>
	</tr>

	<tr>
		<td><b>Beta (β)</b></td>
		<td>
			The distance in rating points to guarantee about a 76% chance of winning for the higher rated
			player. If your game is more luck based, set this to a higher value. If your game is more
			reliant on pure skill, set this to a lower value.
		</td>
		<td>25/6 ≈ <b>4.167</b></td>
	</tr>

	<tr>
		<td><b>Tau (τ)</b></td>
		<td>
			The additive dynamics factor, the higher the value, the more dynamic the ratings will be. This
			means the winner will gain more rating, and the loser will lose more rating.
		</td>
		<td>25/300 ≈ <b>0.083</b></td>
	</tr>

	<tr>
		<td><b>Draw Probability</b></td>
		<td>
			The probability of a draw occurring. If your game has a high chance of ending in a draw set
			this to a higher value. If your game has a low chance of ending in a draw set this to a lower
			value. You can also set this to 0 if draws are impossible.
		</td>
		<td><b>0.1</b></td>
	</tr>
</table>

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
