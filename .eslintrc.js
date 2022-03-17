module.exports = {
    root: true,
    env: { node: true, "vue/setup-compiler-macros": true },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "plugin:vuejs-accessibility/recommended",
        "prettier",
    ],
    rules: { "vue/multi-word-component-names": "off", "vue/no-v-html": "off" },
};
