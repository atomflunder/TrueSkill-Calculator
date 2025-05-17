<template>
    <Card class="border-none shadow-none px-0">
        <CardHeader>
            <CardTitle> Export CSV </CardTitle>
            <CardDescription class="p-0">
                <p>Export your teams as CSV.</p>
            </CardDescription>

            <CardContent class="p-0">
                <Textarea
                    readonly
                    :model-value="teamsToCsv()"
                    class="mt-4 min-h-[40vh]"
                    placeholder="Setup some teams to export!"
                />
            </CardContent>

            <CardFooter class="p-0">
                <DialogCopyButton
                    button-text="Copy as CSV"
                    :text-to-copy="teamsToCsv()"
                />
            </CardFooter>
        </CardHeader>
    </Card>
</template>

<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { ResultingPlayer, ResultingTeam } from '~/types/trueskill';

function teamsToCsv() {
    const header = [
        'team_name',
        'team_rank',
        'player_name',
        'mu',
        'sigma',
        'weight',
        'expected_score',
        'rating_change_mu',
        'rating_change_sigma',
    ];

    const rows = props.outputTeams
        .map((team) => {
            return team.players
                .map((player: ResultingPlayer) => {
                    return [
                        team.name,
                        team.rank,
                        player.name,
                        player.rating[0],
                        player.rating[1],
                        player.weight,
                        team.expectedScore,
                        player.ratingChanges[0],
                        player.ratingChanges[1],
                    ].join(',');
                })
                .join('\n');
        })
        .join('\n');

    return [header.join(','), rows].join('\n');
}

const props = defineProps<{
    outputTeams: ResultingTeam[];
}>();
</script>
