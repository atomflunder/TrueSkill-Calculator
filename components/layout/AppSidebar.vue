<template>
    <Sidebar>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>TrueSkill Config</SidebarGroupLabel>
                <SidebarGroupContent class="p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Label> Beta (β) </Label>
                            <Input
                                :model-value="trueskillSettings.beta"
                                type="number"
                                step="0.1"
                                min="0"
                                max="99"
                                placeholder="Beta"
                                @update:model-value="
                                    debouncedEmit('updateBeta', Number($event))
                                "
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Label> Tau (τ)</Label>
                            <Input
                                :model-value="trueskillSettings.tau"
                                type="number"
                                step="0.01"
                                min="0"
                                max="99"
                                placeholder="Tau"
                                @update:model-value="
                                    debouncedEmit('updateTau', Number($event))
                                "
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Label> Draw Probability </Label>
                            <Input
                                :model-value="trueskillSettings.drawProbability"
                                type="number"
                                step="0.1"
                                min="0"
                                max="0.99"
                                placeholder="Draw Probability"
                                @update:model-value="
                                    debouncedEmit(
                                        'updateDrawProbability',
                                        Number($event)
                                    )
                                "
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Calculator Settings</SidebarGroupLabel>
                <SidebarGroupContent class="p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Label> Default Mu (μ) </Label>
                            <Input
                                v-model="trueskillSettings.defaultMu"
                                type="number"
                                placeholder="Default Mu"
                                step="0.1"
                                min="0"
                                max="99"
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Label> Default Sigma (σ) </Label>
                            <Input
                                v-model="trueskillSettings.defaultSigma"
                                type="number"
                                placeholder="Default Sigma"
                                step="0.1"
                                min="0.1"
                                max="99"
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Label> Default Team Size </Label>
                            <Input
                                v-model="trueskillSettings.defaultTeamSize"
                                type="number"
                                placeholder="Default Team Size"
                                step="1"
                                :min="MIN_AMOUNT_PLAYERS"
                                :max="MAX_AMOUNT_PLAYERS"
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem class="p-2">
                    <Button
                        class="hover:cursor-pointer"
                        variant="secondary"
                        @click="$emit('resetConfig')"
                    >
                        Reset Config to Default
                    </Button>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
</template>

<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDebounceFn } from '@vueuse/core';

const trueskillSettings = defineModel<TrueSkillSettings>('trueskillSettings', {
    required: true,
});

const emits = defineEmits<{
    (
        e: 'updateBeta' | 'updateTau' | 'updateDrawProbability',
        newValue: number
    ): void;
    (e: 'resetConfig'): void;
}>();

const debouncedEmit = useDebounceFn((eventName: string, ...args: unknown[]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    emits(eventName, ...args);
}, 500);
</script>
