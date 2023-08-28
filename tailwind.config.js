/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["'Nunito Sans'", ...defaultTheme.fontFamily.sans],
                serif: [...defaultTheme.fontFamily.serif],
                mono: [...defaultTheme.fontFamily.mono],
            },
            colors: {
                "ut-grey": "#151515",
                "ut-grey-hover": "#1e1e1e",
                "ut-grey-light": "#313131",
            },
            spacing: {
                256: "48rem",
                128: "32rem",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
