<template>
    <Card class="rounded-2xl shadow-md border border-gray-200">
        <CardHeader>
            <CardTitle class="flex justify-between items-center gap-2">
                <div class="flex items-center gap-2 w-full">
                    <Icon
                        icon="lucide:users"
                        class="w-5 h-5 text-muted-foreground"
                    />
                    <Input
                        class="font-semibold text-lg flex-1 border-muted-foreground"
                        :model-value="team.name"
                        type="text"
                        placeholder="Enter team name"
                        @update:model-value="
                            $emit('teamRenamed', $event.toString())
                        "
                    />
                </div>

                <Button
                    variant="ghost"
                    class="text-red-500 hover:text-red-600 hover:cursor-pointer p-1"
                    @click="$emit('teamRemoved')"
                >
                    <Icon icon="lucide:trash" class="w-5 h-5" />
                </Button>
            </CardTitle>
        </CardHeader>

        <CardContent class="space-y-6">
            <div
                v-for="(player, i) in team.players"
                :key="i"
                class="border rounded-lg p-4 space-y-3 bg-accent"
            >
                <div class="flex justify-between items-center gap-2">
                    <div class="flex items-center gap-2 flex-1">
                        <Icon
                            icon="lucide:user"
                            class="w-5 h-5 text-muted-foreground"
                        />
                        <Input
                            class="font-normal flex-1 border-muted-foreground"
                            :model-value="player.name"
                            type="text"
                            placeholder="Player name"
                            @update:model-value="
                                $emit('playerUpdated', i, {
                                    name: $event.toString(),
                                    rating: player.rating,
                                    weight: player.weight,
                                })
                            "
                        />
                    </div>

                    <Button
                        variant="ghost"
                        class="text-red-500 hover:text-red-600 hover:cursor-pointer p-1"
                        @click="$emit('playerRemoved', i)"
                    >
                        <Icon icon="lucide:trash" class="w-4 h-4" />
                    </Button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <Label
                            class="text-sm text-muted-foreground flex items-center gap-1"
                        >
                            <Icon icon="lucide:sliders" class="w-4 h-4" /> Mu
                            (μ)
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.rating[0]"
                            type="number"
                            min="-100"
                            max="100"
                            step="0.1"
                            placeholder="Mu rating"
                            @update:model-value="
                                $emit('playerUpdated', i, {
                                    name: player.name,
                                    rating: [Number($event), player.rating[1]],
                                    weight: player.weight,
                                })
                            "
                        />
                    </div>

                    <div>
                        <Label
                            class="text-sm text-muted-foreground flex items-center gap-1"
                        >
                            <Icon icon="lucide:sliders" class="w-4 h-4" /> Sigma
                            (σ)
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.rating[1]"
                            type="number"
                            min="-100"
                            max="100"
                            step="0.1"
                            placeholder="Sigma rating"
                            @update:model-value="
                                $emit('playerUpdated', i, {
                                    name: player.name,
                                    rating: [player.rating[0], Number($event)],
                                    weight: player.weight,
                                })
                            "
                        />
                    </div>

                    <div>
                        <Label
                            class="text-sm text-muted-foreground flex items-center gap-1"
                        >
                            <Icon icon="lucide:weight" class="w-4 h-4" /> Weight
                        </Label>
                        <Input
                            class="font-normal border-muted-foreground"
                            :model-value="player.weight"
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            placeholder="Player weight"
                            @update:model-value="
                                $emit('playerUpdated', i, {
                                    name: player.name,
                                    rating: player.rating,
                                    weight: Number($event),
                                })
                            "
                        />
                    </div>
                </div>
            </div>
        </CardContent>

        <CardFooter>
            <Button
                variant="ghost"
                class="text-green-500 hover:text-green-600 hover:cursor-pointer mx-auto flex items-center gap-1"
                @click="$emit('playerAdded')"
            >
                <Icon icon="lucide:plus" class="w-4 h-4" />
                Add Player
            </Button>
        </CardFooter>
    </Card>
</template>

<script setup lang="ts">
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Icon } from '@iconify/vue';
import { Input } from '@/components/ui/input';

import type { InitialPlayer, InitialTeam } from '~/types/trueskill';

defineProps<{
    team: InitialTeam;
    index: number;
}>();

defineEmits<{
    (e: 'playerUpdated', playerIndex: number, newPlayer: InitialPlayer): void;
    (e: 'playerAdded'): void;
    (e: 'playerRemoved', index: number): void;
    (e: 'teamRenamed', newName: string): void;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (e: 'teamRemoved'): void;
}>();
</script>
