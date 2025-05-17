<template>
    <Card class="border-none shadow-none px-0">
        <CardHeader>
            <CardTitle> Import JSON </CardTitle>
            <CardDescription class="p-0">
                <p>
                    Import your teams as JSON. See the sample data or FAQ for
                    the required schema.
                </p>
                <DialogCopyButton
                    button-text="Copy Sample JSON"
                    :text-to-copy="sampleJsonData"
                />
            </CardDescription>

            <CardContent class="p-0">
                <Textarea
                    v-model="teamInput"
                    class="mt-4 min-h-[40vh]"
                    :placeholder="`Import your initial teams here as JSON:\n${sampleJsonData}`"
                />
            </CardContent>

            <CardFooter class="p-0 mt-4 min-h-12">
                <Alert
                    v-if="message.state === 'error'"
                    variant="destructive"
                    class="mr-4 p-2 border-red-400"
                >
                    <Icon icon="lucide:circle-alert" />
                    <AlertDescription class="text-xs sm:text-sm">{{
                        message.text
                    }}</AlertDescription>
                </Alert>
                <Alert
                    v-else-if="message.state === 'success'"
                    variant="default"
                    class="mr-4 p-2 border-green-400 text-green-500"
                >
                    <Icon icon="lucide:circle-check-big" />
                    <AlertDescription class="text-green-500">{{
                        message.text
                    }}</AlertDescription>
                </Alert>
                <Button class="hover:cursor-pointer ml-auto" @click="parseJSON">
                    <Icon icon="lucide:file-json" />
                    Import as JSON
                </Button>
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icon } from '@iconify/vue';
import * as v from 'valibot';
import { InitialTeamsJSONSchema, type InitialTeam } from '~/types/trueskill';

const emits = defineEmits<{
    (e: 'teamsImported', newTeams: InitialTeam[]): void;
}>();

const message: Ref<{ text: string; state: 'error' | 'success' | undefined }> =
    ref({
        text: '',
        state: undefined,
    });

const teamInput = ref('');

function parseJSON() {
    let parsed: unknown;

    try {
        parsed = JSON.parse(teamInput.value);
    } catch (err) {
        message.value = {
            text: `Error parsing JSON: ${err}`,
            state: 'error',
        };
        return;
    }

    const result = v.safeParse(InitialTeamsJSONSchema, parsed);
    if (!result.success) {
        message.value = {
            text: `Error parsing JSON: ${JSON.stringify(result.issues.map((m) => m.message))}`,
            state: 'error',
        };
        return;
    }

    if (result.output.teams.length < 2) {
        message.value = {
            text: 'Need at least 2 teams!',
            state: 'error',
        };
        return;
    }

    teamInput.value = '';
    message.value = {
        text: 'Successfully parsed JSON data!',
        state: 'success',
    };

    emits('teamsImported', result.output.teams as InitialTeam[]);
}

const sampleJsonData = `
{
    "teams": [
        {
            "name": "Team 1",
            "rank": 1,
            "players": [
                {
                    "name": "Pep",
                    "rating": [25.0, 8.33],
                    "weight": 1.0
                },
                {
                    "name": "Pep 2",
                    "rating": [25.0, 8.33],
                    "weight": 1.0
                }
            ]
        },
        {
            "name": "Team 2",
            "rank": 2,
            "players": [
                {
                    "name": "Pep 3",
                    "rating": [25.0, 8.33],
                    "weight": 1.0
                },
                {
                    "name": "Pep 4",
                    "rating": [25.0, 8.33],
                    "weight": 1.0
                }
            ]
        }
    ]
}
`;
</script>
