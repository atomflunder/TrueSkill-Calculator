<template>
    <Card class="rounded-2xl shadow-md border border-gray-200">
        <CardHeader>
            <CardTitle class="text-lg font-semibold">
                <Icon icon="lucide:users" class="mr-2 w-5 h-5 inline" />
                {{ team.name }}
            </CardTitle>

            <CardDescription>
                <div>
                    <p class="text-sm text-muted-foreground mt-1">
                        <Icon icon="lucide:star" class="mr-1 w-4 h-4 inline" />
                        Expected Score: {{ team.expectedScore.toFixed(4) }}
                    </p>
                    <p class="text-sm text-muted-foreground mt-1">
                        <Icon icon="lucide:medal" class="mr-1 w-4 h-4 inline" />
                        Placement: {{ team.rank }}
                    </p>
                </div>
            </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
            <div
                v-for="(player, i) in team.players"
                :key="i"
                class="border rounded-lg p-4 space-y-3 bg-accent"
            >
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                >
                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:user"
                                class="mr-2 w-5 h-5 inline"
                            />
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.name"
                            type="text"
                            readonly
                        />
                    </div>

                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:trophy"
                                class="mr-2 w-5 h-5 inline"
                            />
                            Player Rank
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.suggestedRank"
                            type="number"
                            readonly
                        />
                    </div>

                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:weight"
                                class="mr-2 w-5 h-5 inline"
                            />
                            Weight
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.weight"
                            type="number"
                            readonly
                        />
                    </div>
                </div>

                <div
                    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
                >
                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:sliders"
                                class="mr-2 w-5 h-5 inline"
                            />
                            Mu (μ)
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.rating[0]"
                            type="number"
                            readonly
                        />
                    </div>

                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:sliders"
                                class="mr-2 w-5 h-5 inline"
                            />
                            Sigma (σ)
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.rating[1]"
                            type="number"
                            readonly
                        />
                    </div>

                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:arrow-up-narrow-wide"
                                class="mr-2 w-5 h-5 inline"
                            />
                            Δ Mu
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.ratingChanges[0]"
                            type="number"
                            readonly
                        />
                    </div>

                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:arrow-up-narrow-wide"
                                class="mr-2 w-5 h-5 inline"
                            />
                            Δ Sigma
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.ratingChanges[1]"
                            type="number"
                            readonly
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/vue';
import { Input } from '@/components/ui/input';
import type { ResultingTeam } from '~/types/trueskill';

defineProps<{
    team: ResultingTeam;
}>();
</script>
