<template>
    <Card class="border-none shadow-none px-0">
        <CardHeader>
            <CardTitle> Export JSON </CardTitle>
            <CardDescription class="p-0">
                <p>Export your teams as JSON.</p>
            </CardDescription>

            <CardContent class="p-0">
                <Textarea
                    readonly
                    :model-value="teamsToJson()"
                    class="mt-4 min-h-[40vh]"
                    placeholder="Setup some teams to export!"
                />
            </CardContent>

            <CardFooter class="p-0">
                <DialogCopyButton
                    button-text="Copy as JSON"
                    :text-to-copy="teamsToJson()"
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
import type { ResultingTeam } from '~/types/trueskill';

function teamsToJson() {
    return JSON.stringify({ teams: props.outputTeams }, undefined, 2);
}

const props = defineProps<{
    outputTeams: ResultingTeam[];
}>();
</script>
