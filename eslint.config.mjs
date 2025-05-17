// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
    rules: {
        'vue/html-self-closing': 'off', // False positive with <br />
    },
}).prepend({
    ignores: ['**/components/ui/**/*'],
});
