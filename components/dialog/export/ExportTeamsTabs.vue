<template>
    <Dialog>
        <DialogTrigger>
            <Button variant="secondary" class="hover:cursor-pointer text-xs">
                <Icon icon="lucide:download" class="w-4 h-4" />
                Export
            </Button>
        </DialogTrigger>
        <DialogContent class="min-w-[80vw] min-h-[80vh] px-0">
            <Tabs>
                <TabsList class="mx-6">
                    <TabsTrigger value="json" class="hover:cursor-pointer">
                        Export as JSON
                    </TabsTrigger>
                    <TabsTrigger value="csv" class="hover:cursor-pointer">
                        Export as CSV
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="json">
                    <TeamsJson :output-teams="outputTeams" />
                </TabsContent>
                <TabsContent value="csv">
                    <TeamsCsv :output-teams="outputTeams" />
                </TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { ResultingTeam } from '~/types/trueskill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamsJson from './TeamsJson.vue';
import TeamsCsv from './TeamsCsv.vue';

defineProps<{
    outputTeams: ResultingTeam[];
}>();
</script>
