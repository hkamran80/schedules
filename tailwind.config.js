/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Barlow", ...defaultTheme.fontFamily.sans],
                serif: [...defaultTheme.fontFamily.serif],
                mono: [...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
