import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    css: ['~/assets/css/tailwind.css'],
    colorMode: {
        classSuffix: '',
        preference: 'dark',
        fallback: 'dark',
        storage: 'localStorage',
        storageKey: 'colorMode',
    },
    devtools: { enabled: true },
    modules: [
      '@nuxt/test-utils/module',
      '@nuxt/eslint',
      'shadcn-nuxt',
      'shadcn-nuxt',
      '@nuxt/icon',
      '@nuxtjs/color-mode',
      '@nuxt/image',
    ],
    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
    vite: {
        plugins: [tailwindcss()],
    },
});