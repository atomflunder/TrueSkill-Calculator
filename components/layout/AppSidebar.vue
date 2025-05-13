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
                                v-model="trueskillSettings.beta"
                                type="number"
                                step="0.1"
                                min="0"
                                max="99"
                                placeholder="Beta"
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Label> Tau (τ)</Label>
                            <Input
                                v-model="trueskillSettings.tau"
                                type="number"
                                step="0.01"
                                min="0"
                                max="99"
                                placeholder="Tau"
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Label> Draw Probability </Label>
                            <Input
                                v-model="trueskillSettings.drawProbability"
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                placeholder="Draw Probability"
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
                                min="1"
                                max="99"
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

const trueskillSettings = defineModel<TrueSkillSettings>('trueskillSettings', {
    required: true,
});

defineEmits<{
    (e: 'resetConfig'): void;
}>();
</script>
