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
                    @teams-imported="initialTeams = $event"
                    @teams-exported="calculateTeams"
                />

                <CardsInitialTeam v-for="(team, i) in initialTeams" :key="i" />

                <Button @click="calculateTeams">Calc</Button>

                <CardsResultingTeam
                    v-for="(team, i) in resultingTeams"
                    :key="i"
                />
            </slot>
        </main>
    </SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarProvider } from '@/components/ui/sidebar';
import type {
    InitialTeam,
    TrueSkillBody,
    TrueSkillResult,
} from '@/types/trueskill';

const trueskillSettings = ref<TrueSkillSettings>(getDefaultConfig());
function resetConfig() {
    trueskillSettings.value = getDefaultConfig();
}

const initialTeams = ref<InitialTeam[]>(getFirstTwoTeams());
const resultingTeams = ref<TrueSkillResult>();

async function calculateTeams() {
    const body: TrueSkillBody = {
        teams: initialTeams.value,
        config: trueskillSettings.value,
    };

    const { data } = await useFetch<TrueSkillResult>('/api/trueskill', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (data.value) {
        resultingTeams.value = data.value;
    }
}
</script>
