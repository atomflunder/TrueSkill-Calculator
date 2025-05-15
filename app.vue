<template>
    <SidebarProvider>
        <LayoutAppSidebar
            :trueskill-settings="trueskillSettings"
            @reset-config="resetConfig"
        />

        <main class="w-full">
            <slot>
                <LayoutHeaderComponent
                    :output-teams="resultingTeams?.teams || []"
                    @teams-imported="(newTeams) => (initialTeams = newTeams)"
                    @teams-exported="calculateTeams"
                />

                <div
                    class="p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    <CardsInitialTeam
                        v-for="(team, i) in initialTeams"
                        :key="i"
                        :team="team"
                        :index="i"
                        @team-removed="removeTeam(initialTeams, i)"
                        @team-renamed="(newName) => (team.name = newName)"
                        @team-rank-updated="
                            (newRank) =>
                                updateTeamRanks(
                                    team,
                                    initialTeams.length,
                                    newRank
                                )
                        "
                        @player-added="addPlayerToTeam(trueskillSettings, team)"
                        @player-removed="
                            (index) => removePlayerFromTeam(team, index)
                        "
                        @player-updated="
                            (index, newPlayer) =>
                                (team.players[index] = newPlayer)
                        "
                    />
                </div>

                <div class="flex flex-col sm:flex-row gap-4 p-4 sm:p-8">
                    <Button
                        class="hover:cursor-pointer w-full sm:w-auto"
                        variant="secondary"
                        @click="addTeam(trueskillSettings, initialTeams)"
                    >
                        <Icon icon="lucide:plus" class="w-4 h-4" />
                        Add New Team
                    </Button>

                    <Button
                        class="hover:cursor-pointer w-full sm:w-auto"
                        variant="secondary"
                        @click="
                            initialTeams = getFirstTwoTeams(trueskillSettings)
                        "
                    >
                        <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
                        Reset Teams
                    </Button>

                    <Button
                        class="hover:cursor-pointer w-full sm:w-auto"
                        @click="calculateTeams"
                    >
                        <Icon icon="lucide:settings-2" class="w-4 h-4" />
                        Calculate Result
                    </Button>
                </div>

                <div
                    v-if="resultingTeams"
                    class="p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    <CardsResultingTeam
                        v-for="(team, i) in resultingTeams.teams"
                        :key="i"
                        :team="team"
                        :match-quality="resultingTeams.matchQuality"
                    />
                </div>
            </slot>
        </main>
    </SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarProvider } from '@/components/ui/sidebar';
import { Icon } from '@iconify/vue';
import type {
    InitialTeam,
    TrueSkillBody,
    TrueSkillResult,
} from '@/types/trueskill';

const trueskillSettings = ref<TrueSkillSettings>(getDefaultConfig());
function resetConfig() {
    trueskillSettings.value = getDefaultConfig();
}

const initialTeams = ref<InitialTeam[]>(
    getFirstTwoTeams(trueskillSettings.value)
);
const resultingTeams = ref<TrueSkillResult>();

async function calculateTeams() {
    const body: TrueSkillBody = {
        teams: initialTeams.value,
        config: trueskillSettings.value,
    };

    const result = await $fetch<TrueSkillResult>('/api/trueskill', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    resultingTeams.value = result;
}

await calculateTeams();

watch(
    initialTeams,
    async () => {
        await calculateTeams();
    },
    {
        deep: 3,
    }
);
</script>
