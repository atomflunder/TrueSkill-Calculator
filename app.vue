<template>
    <SidebarProvider>
        <LayoutAppSidebar
            :trueskill-settings="trueskillSettings"
            @update-beta="(newBeta) => (trueskillSettings.beta = newBeta)"
            @update-tau="(newTau) => (trueskillSettings.tau = newTau)"
            @update-draw-probability="
                (newDrawProbability) =>
                    (trueskillSettings.drawProbability = newDrawProbability)
            "
            @reset-config="resetConfig"
        />

        <main class="w-full">
            <slot>
                <LayoutHeaderComponent
                    :output-teams="resultingTeams?.teams || []"
                    @teams-imported="(newTeams) => (initialTeams = newTeams)"
                />

                <section class="mt-8 px-4 sm:px-8">
                    <div class="mb-4">
                        <h2 class="text-xl font-semibold">Initial Teams:</h2>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 mb-6">
                        <Button
                            class="w-full sm:w-auto hover:cursor-pointer"
                            variant="secondary"
                            @click="addTeam(trueskillSettings, initialTeams)"
                        >
                            <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
                            Add New Team
                        </Button>

                        <Button
                            class="w-full sm:w-auto hover:cursor-pointer"
                            variant="secondary"
                            @click="
                                initialTeams =
                                    getFirstTwoTeams(trueskillSettings)
                            "
                        >
                            <Icon
                                icon="lucide:rotate-ccw"
                                class="w-4 h-4 mr-2"
                            />
                            Reset Teams
                        </Button>
                    </div>

                    <div
                        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
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
                            @player-added="
                                addPlayerToTeam(trueskillSettings, team)
                            "
                            @player-removed="
                                (index) => removePlayerFromTeam(team, index)
                            "
                            @player-updated="
                                (index, newPlayer) =>
                                    (team.players[index] = newPlayer)
                            "
                        />
                    </div>
                </section>

                <Separator class="mt-8" />

                <section v-if="resultingTeams" class="mt-8 px-4 sm:px-8">
                    <div class="mb-4">
                        <h2 class="text-xl font-semibold">Resulting Teams:</h2>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 mb-6">
                        Match Quality:
                        {{ (resultingTeams.matchQuality * 100).toFixed(4) }}%
                    </div>

                    <div
                        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                        <CardsResultingTeam
                            v-for="(team, i) in resultingTeams.teams"
                            :key="i"
                            :team="team"
                        />
                    </div>
                </section>
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

watch(
    () => [
        trueskillSettings.value.beta,
        trueskillSettings.value.tau,
        trueskillSettings.value.drawProbability,
    ],
    async () => {
        await calculateTeams();
    }
);
</script>
