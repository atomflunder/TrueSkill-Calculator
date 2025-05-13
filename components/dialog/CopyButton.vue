<template>
    <Button
        variant="secondary"
        class="hover:cursor-pointer text-xs"
        @click="copyToClipboard"
    >
        <Icon
            :icon="recentlyCopied ? 'lucide:check' : 'lucide:clipboard-copy'"
        />
        {{ recentlyCopied ? 'Copied to clipboard!' : buttonText }}
    </Button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = defineProps<{
    buttonText: string;
    textToCopy: string;
}>();

const recentlyCopied = ref(false);

function copyToClipboard() {
    recentlyCopied.value = true;
    navigator.clipboard.writeText(props.textToCopy);
    setTimeout(() => (recentlyCopied.value = false), 2000);
}
</script>
