<template>
    <Dialog>
        <DialogTrigger>
            <Button variant="secondary" class="hover:cursor-pointer text-xs">
                <Icon icon="lucide:upload" class="w-4 h-4" />
                Import
            </Button>
        </DialogTrigger>
        <DialogContent class="min-w-[80vw] min-h-[80vh] px-0">
            <Tabs>
                <TabsList class="mx-6">
                    <TabsTrigger value="json" class="hover:cursor-pointer">
                        Import as JSON
                    </TabsTrigger>
                    <TabsTrigger value="csv" class="hover:cursor-pointer">
                        Import as CSV
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="json">
                    <TeamsJson
                        @teams-imported="$emit('teamsImported', $event)"
                    />
                </TabsContent>
                <TabsContent value="csv">
                    <TeamsCsv
                        @teams-imported="$emit('teamsImported', $event)"
                    />
                </TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { InitialTeam } from '~/types/trueskill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamsJson from './TeamsJson.vue';
import TeamsCsv from './TeamsCsv.vue';

defineEmits<{
    (e: 'teamsImported', newTeams: InitialTeam[]): void;
}>();
</script>
