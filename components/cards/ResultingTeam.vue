<template>
    <Card class="rounded-2xl shadow-md">
        <CardHeader>
            <div>
                <div>
                    <CardTitle
                        class="text-lg font-semibold flex items-center gap-2"
                    >
                        <Icon icon="lucide:users" class="w-5 h-5" />
                        {{ team.name.slice(0, 13) || 'Unnamed Team' }}
                    </CardTitle>
                    <p
                        class="text-md text-muted-foreground flex items-center gap-2"
                    >
                        <Icon icon="lucide:medal" class="w-4 h-4" />
                        Placement: {{ team.rank }}
                    </p>
                </div>

                <div class="text-xs text-muted-foreground mt-2">
                    <p class="flex items-center gap-1">
                        <Icon icon="lucide:star" class="w-4 h-4" />
                        Expected Score: {{ team.expectedScore.toFixed(4) }}
                    </p>
                </div>
            </div>
        </CardHeader>

        <CardContent class="space-y-6">
            <div
                v-for="(player, i) in team.players"
                :key="i"
                class="border rounded-lg p-4 space-y-3 bg-accent"
            >
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3"
                >
                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon icon="lucide:user" class="w-4 h-4 inline" />
                            Player Name
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
                            <Icon icon="lucide:trophy" class="w-4 h-4 inline" />
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
                            <Icon icon="lucide:weight" class="w-4 h-4 inline" />
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

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div>
                        <Label class="text-sm text-muted-foreground">
                            <Icon
                                icon="lucide:sliders"
                                class="w-4 h-4 inline"
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
                                class="w-4 h-4 inline"
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
                                class="w-4 h-4 inline"
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
                                class="w-4 h-4 inline"
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

<style scoped>
input[type='number'][readonly]::-webkit-inner-spin-button,
input[type='number'][readonly]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'][readonly] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>
