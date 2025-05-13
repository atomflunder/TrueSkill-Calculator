<template>
    <Card class="border-none shadow-none px-0">
        <CardHeader>
            <CardTitle> Import CSV </CardTitle>
            <CardDescription class="p-0">
                <p>
                    Import your teams as CSV. See the sample data or FAQ for the
                    required schema.
                </p>
                <DialogCopyButton
                    button-text="Copy Sample CSV"
                    :text-to-copy="sampleCsvData"
                />
            </CardDescription>

            <CardContent class="p-0">
                <Textarea
                    v-model="teamInput"
                    class="mt-4 min-h-[40vh]"
                    :placeholder="`Import your initial teams here as CSV:\n${sampleCsvData}`"
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
                <Button class="hover:cursor-pointer ml-auto" @click="parseCSV">
                    <Icon icon="lucide:file-spreadsheet" />
                    Import as CSV
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
import { InitialPlayerCSVSchema, type InitialTeam } from '~/types/trueskill';

const emits = defineEmits<{
    (e: 'teamsImported', newTeams: InitialTeam[]): void;
}>();

const teamInput = ref('');

const message: Ref<{ text: string; state: 'error' | 'success' | undefined }> =
    ref({
        text: '',
        state: undefined,
    });

function parseCSV() {
    const rows = teamInput.value.trim().split('\n');
    if (rows.length < 2) {
        message.value = {
            text: `Not enough CSV Rows! Need at least 2.`,
            state: 'error',
        };
        return;
    }

    const header = rows[0].split(',').map((h) => h.trim());

    const expectedHeaders = [
        'team_name',
        'team_rank',
        'player_name',
        'mu',
        'sigma',
        'weight',
    ];
    if (!expectedHeaders.every((h, i) => header[i] === h)) {
        message.value = {
            text: `CSV Header is invalid. See the example for the format.`,
            state: 'error',
        };
    }

    const players = [];

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(',').map((c) => c.trim());
        if (cells.length !== 6) continue;

        const rowData = {
            team_name: cells[0],
            team_rank: Number(cells[1]),
            player_name: cells[2],
            mu: Number(cells[3]),
            sigma: Number(cells[4]),
            weight: Number(cells[5]),
        };

        const result = v.safeParse(InitialPlayerCSVSchema, rowData);
        if (!result.success) {
            message.value = {
                text: `CSV validation failed on row ${i + 1}: ${JSON.stringify(result.issues.map((m) => m.message))}`,
                state: 'error',
            };
            return;
        }

        players.push(result.output);
    }

    const teamMap: Record<string, InitialTeam> = {};

    for (const player of players) {
        if (!teamMap[player.team_name]) {
            teamMap[player.team_name] = {
                name: player.team_name,
                rank: player.team_rank,
                players: [],
            };
        }

        teamMap[player.team_name].players.push({
            name: player.player_name,
            rating: [player.mu, player.sigma],
            weight: player.weight,
        });
    }

    const teams = Object.values(teamMap);

    if (teams.length < 2) {
        message.value = {
            text: 'Need at least 2 teams!',
            state: 'error',
        };
        return;
    }

    teamInput.value = '';
    message.value = {
        text: 'Successfully parsed CSV data!',
        state: 'success',
    };

    emits('teamsImported', teams as InitialTeam[]);
}

const sampleCsvData = `
team_name,team_rank,player_name,mu,sigma,weight
Team 1,1,Pep,25.0,8.33,1.0
Team 1,1,Pep 2,25.0,8.33,1.0
Team 2,2,Pep 3,25.0,8.33,1.0
Team 2,2,Pep 4,25.0,8.33,1.0
`;
</script>
