<template>
    <div class="flex justify-between items-center w-full p-2">
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Button
                        variant="ghost"
                        class="hover:cursor-pointer"
                        @click="toggleSidebar"
                    >
                        <Icon icon="lucide:menu" />
                    </Button>
                </NavigationMenuItem>

                <NavigationMenuItem class="hidden sm:block">
                    TrueSkill Calculator
                </NavigationMenuItem>

                <NavigationMenuItem class="ml-0 sm:ml-2">
                    <DialogHowTo />
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <ImportTeamsTabs
                        @teams-imported="$emit('teamsImported', $event)"
                    />
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <ExportTeamsTabs
                        :output-teams="outputTeams"
                        @teams-exported="$emit('teamsExported')"
                    />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
            <NavigationMenuList class="flex items-center space-x-4">
                <NavigationMenuItem>
                    <div class="flex items-center">
                        <Switch
                            class="cursor-pointer"
                            aria-label="Switch Theme"
                            :model-value="isDark"
                            @update:model-value="toggleTheme"
                        >
                            <template #thumb>
                                <div
                                    class="flex items-center justify-center w-full h-full"
                                >
                                    <Icon
                                        v-if="isDark"
                                        icon="lucide:moon"
                                        class="w-3 h-3 text-slate-50"
                                    />
                                    <Icon
                                        v-else
                                        icon="lucide:sun"
                                        class="w-3 h-3 text-slate-700"
                                    />
                                </div>
                            </template>
                        </Switch>
                    </div>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NuxtLink
                        to="https://github.com/atomflunder/trueskill-calculator"
                        target="_blank"
                    >
                        <Button
                            variant="link"
                            class="hover:cursor-pointer"
                            aria-label="Link to GitHub"
                        >
                            <Icon icon="simple-icons:github" />
                            <Label class="hidden sm:inline">
                                View on GitHub
                            </Label>
                        </Button>
                    </NuxtLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </div>

    <Separator />
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useSidebar } from '@/components/ui/sidebar';
import ExportTeamsTabs from '../dialog/export/ExportTeamsTabs.vue';
import ImportTeamsTabs from '../dialog/import/ImportTeamsTabs.vue';
import type { InitialTeam, ResultingTeam } from '~/types/trueskill';
const { toggleSidebar } = useSidebar();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

function toggleTheme() {
    if (isDark.value) {
        colorMode.preference = 'light';
    } else {
        colorMode.preference = 'dark';
    }
}

defineProps<{
    outputTeams: ResultingTeam[];
}>();

defineEmits<{
    (e: 'teamsImported', newTeams: InitialTeam[]): void;
    (e: 'teamsExported'): void;
}>();
</script>
