<template>
    <Dialog>
        <DialogTrigger>
            <Button variant="secondary" class="hover:cursor-pointer text-xs">
                <Icon icon="lucide:message-circle-question" class="w-4 h-4" />
                FAQ
            </Button>
        </DialogTrigger>
        <DialogContent class="overflow-y-scroll max-h-screen">
            <DialogHeader>
                <DialogTitle>FAQ / How To</DialogTitle>
            </DialogHeader>

            <Accordion type="single" class="w-full" collapsible>
                <AccordionItem value="trueskill">
                    <AccordionTrigger class="font-bold"
                        >What is TrueSkill?</AccordionTrigger
                    >
                    <AccordionContent>
                        <p>
                            TrueSkill is a modern rating system for multiplayer
                            games developed and patented by Microsoft Research.
                            It is used in many games, including Halo, Gears of
                            War, Forza Motorsport, Tom Clancy's: Rainbow Six
                            Siege and many, many more. It uses a bayesian
                            approach to calculate the skill of each player in a
                            game. It is one of the most popular rating systems,
                            besides
                            <NuxtLink
                                to="https://en.wikipedia.org/wiki/Elo_rating_system"
                                :external="true"
                                class="hover:cursor-pointer underline"
                                >Elo</NuxtLink
                            >
                            and
                            <NuxtLink
                                to="https://en.wikipedia.org/wiki/Glicko_rating_system"
                                :external="true"
                                class="hover:cursor-pointer underline"
                                >Glicko-2</NuxtLink
                            >.
                        </p>

                        <p>
                            A player's rating is represented by a Gaussian
                            distribution, which is a bell curve. The mean of the
                            distribution represents the player's skill, called
                            Mu (µ), and the standard deviation represents the
                            player's uncertainty about their skill, called Sigma
                            (σ). The higher the standard deviation, the more
                            uncertain the player is about their skill. This
                            means that the real skill of a player is somewhere
                            within μ±3σ, with a 99% confidence.
                        </p>

                        <NuxtImg src="/trueskill-skilldia.jpg" />

                        <p>
                            The TrueSkill algorithm is very good at asserting
                            the skill of a player quickly. Here is a table of
                            the minimum amount of games needed to roughly
                            determine a player's skill.
                        </p>

                        <Table class="w-full text-sm border border-border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        class="whitespace-normal break-words"
                                        >Game Mode</TableHead
                                    >
                                    <TableHead
                                        class="whitespace-normal break-words"
                                        >Minimum Games Needed</TableHead
                                    >
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >16 Players Free-For-All</TableCell
                                    >
                                    <TableCell>3</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >8 Players Free-For-All</TableCell
                                    >
                                    <TableCell>3</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >4 Players Free-For-All</TableCell
                                    >
                                    <TableCell>5</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >2 Players Free-For-All</TableCell
                                    >
                                    <TableCell>12</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >4 Teams with 2 Players each</TableCell
                                    >
                                    <TableCell>10</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >4 Teams with 4 Players each</TableCell
                                    >
                                    <TableCell>20</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >2 Teams with 4 Players each</TableCell
                                    >
                                    <TableCell>46</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >2 Teams with 8 Players each</TableCell
                                    >
                                    <TableCell>91</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <p>
                            For more information, you can read the original
                            paper on TrueSkill here:
                            <NuxtLink
                                to="https://www.microsoft.com/en-us/research/wp-content/uploads/2007/01/NIPS2006_0688.pdf"
                                :external="true"
                                class="hover:cursor-pointer underline"
                            >
                                TrueSkill(TM): A Bayesian Skill Rating System
                            </NuxtLink>
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="config">
                    <AccordionTrigger class="font-bold"
                        >What do these Config Values mean?</AccordionTrigger
                    >
                    <AccordionContent>
                        <p>
                            You can fine-tune the TrueSkill algorithm to suit
                            your specific needs.
                        </p>

                        <Table class="w-full text-sm border border-border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Config</TableHead>
                                    <TableHead>Explanation</TableHead>
                                    <TableHead>Default Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >Beta (β)</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >The distance in rating points to
                                        guarantee about a 76% chance of winning
                                        for the higher-rated player. Set higher
                                        for luck-based games, lower for
                                        skill-based games.</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >25/6 ≈ 4.167
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >Tau (τ)</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >The additive dynamics factor. Higher
                                        values make ratings more dynamic.
                                        Winners gain more, losers lose more.
                                    </TableCell>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >25/300 ≈ 0.083
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >Draw Probability</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >The probability of a draw occurring.
                                        Set higher for draw-prone games, lower
                                        for decisive games. Can be set to 0 if
                                        draws are impossible.
                                    </TableCell>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >0.1 (10% chance)
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <p class="mt-4">
                            This calculator also has some settings to make your
                            life a bit easier:
                        </p>

                        <Table class="w-full text-sm border border-border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Setting</TableHead>
                                    <TableHead>Explanation</TableHead>
                                    <TableHead>Default Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >Default Mu (μ)</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >The default value of Mu (μ) for new
                                        players.
                                    </TableCell>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >25
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >Default Sigma (σ)</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >The default value of Sigma (σ) for new
                                        players.</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >25/3 ≈ 8.333</TableCell
                                    >
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >Default Team Size</TableCell
                                    >
                                    <TableCell
                                        class="whitespace-normal break-words"
                                        >The default team size of new teams.
                                    </TableCell>
                                    <TableCell>2 </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="howtousesite">
                    <AccordionTrigger class="font-bold"
                        >How do I use this calculator?
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul class="list-disc pl-4 pt-2">
                            <li>
                                Add or remove Teams and Players and assign each
                                the correct number
                            </li>
                            <li>
                                Assign each Team the correct Rank, meaning
                                Placement in the game. The lower the rank, the
                                better. If two or more Teams draw with each
                                other, assign them the same rank.
                            </li>
                            <li>
                                Assign Weights between 0 and 1 to each Player. A
                                Weight of 1 means the Player has played the
                                whole match, and values below 1 mean the Player
                                has left the game early. A Weight of 0 means the
                                Player has not played at all.
                            </li>
                            <li>
                                Optionally you can name each Team and Player to
                                make it easier to identify them.
                            </li>
                            <li>Calculate the new ratings!</li>
                        </ul>

                        <p class="mt-4">
                            The expected results will appear in the Resulting
                            Teams section. The players in the teams will be
                            updated with the new ranks, their suggested ranks,
                            the difference from before the match, and their
                            expected score.
                        </p>

                        <p>
                            You can also see the Match Quality which is the
                            percent chance of your match ending in a draw. The
                            higher this value, the closer your match will be.
                        </p>

                        <p>
                            You can also import and export the teams as CSV or
                            JSON for ease of use.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="howtouseapi">
                    <AccordionTrigger class="font-bold"
                        >How do I use the API?
                    </AccordionTrigger>
                    <AccordionContent>
                        <p>
                            The API is completely free, just make a POST Request
                            to /api/trueskill with the same request body schema
                            as the JSON import, with an additional, optional
                            config parameter:
                        </p>
                        <div class="bg-muted rounded p-4 mt-4 text-xs">
                            <pre><code>{
  // config is optional
  "config": {
    "beta": 4.166666666666667,
    "tau": 0.08333333333333333,
    "drawProbability": 0.1
  },
  "teams": [
    {
      "name": "Team 1",
      "rank": 1,
      "players": [
        {
          "name": "Pep",
          "rating": [
            25,
            8.33
          ],
          "weight": 1
        },
        {
          "name": "Pep 2",
          "rating": [
            25,
            8.33
          ],
          "weight": 1
        }
        // more players...
      ]
    },
    {
      "name": "Team 2",
      "rank": 2,
      "players": [
        {
          "name": "Pep 3",
          "rating": [
            25,
            8.33
          ],
          "weight": 1
        },
        {
          "name": "Pep 4",
          "rating": [
            25,
            8.33
          ],
          "weight": 1
        }
        // more players...
      ]
    }
    // more teams...
  ]
}</code></pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="suggestedrank">
                    <AccordionTrigger class="font-bold"
                        >What is the player rank?
                    </AccordionTrigger>
                    <AccordionContent>
                        <p>
                            A rank is a number to quantify a player's skill on a
                            leaderboard. The TrueSkill algorithm can be run with
                            any scale you desire. The "suggested rank" is used
                            by Microsoft and uses this formula to determine a
                            player's rank: <i>μ - (3 * σ)</i>. <br />
                            You'll notice that when setup with the default
                            values, the initial rank of a player is 0.
                            <i>25 - (3 * 25/3) = 0</i>. <br />
                            If you have played Halo 2 or 3, this scale will be
                            familiar to you, as it is used in the competitive
                            multiplayer ranks, 0-50.
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="expectedscore">
                    <AccordionTrigger class="font-bold"
                        >What is the expected score?
                    </AccordionTrigger>
                    <AccordionContent>
                        <p>
                            The expected score of a team is the chance of a team
                            to win the match, between 0 and 1. <br />
                            A value of 0 means a certain loss and a value of 1
                            means a certain win. Values near
                            <i>1 / (Team Count)</i> means draws are likely to
                            occur, resulting in a relatively even matchup (see
                            also: Match Quality).
                            <br />
                            This is not originally part of the TrueSkill
                            algorithm, but taken and adapted from here:
                            <NuxtLink
                                to="https://github.com/sublee/trueskill/issues/1#issuecomment-149762508"
                                :external="true"
                                class="hover:cursor-pointer underline"
                            >
                                sublee/trueskill/issues#1
                            </NuxtLink>
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/vue';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
</script>
