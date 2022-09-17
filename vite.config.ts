import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import htmlConfig from "vite-plugin-html-config";
import { VitePWA } from "vite-plugin-pwa";

const name = "Schedules";
const keywords = "schedule schedules auhsd twcp time";
const description =
    "The app for all your schedules. Select a schedule and keep track of how much time there is remaining in a period.";
const faviconUrl =
    "https://next-schedules.unisontech.org/assets/images/favicons/favicon-192.png";
const twitterUsername = "@unisontechorg";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    helpCenter: [
                        "./src/views/HelpCenter.vue",
                        "./src/views/HelpCenterTopic.vue",
                    ],
                    releaseNotes: [
                        "./src/views/ReleaseNotes.vue",
                        "./src/components/ReleaseNotes.vue",
                    ],
                    scheduleSettings: [
                        "./src/components/Settings.vue",
                        "./src/components/EditNotifications.vue",
                        "./src/components/EditPeriodNames.vue",
                    ],
                },
            },
        },
    },
    plugins: [
        htmlConfig({
            metas: [
                { charset: "UTF-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0",
                },
                {
                    name: "keywords",
                    content: keywords,
                },
                {
                    name: "description",
                    content: description,
                },
                { name: "robots", content: "index, follow" },

                // Open Graph
                { property: "og:title", content: name },
                {
                    property: "og:image",
                    content: faviconUrl,
                },
                { property: "og:type", content: "website" },
                { property: "og:description", content: description },

                // Twitter Cards
                { name: "twitter:card", content: "summary" },
                { name: "twitter:site", content: twitterUsername },
                { name: "twitter:creator", content: twitterUsername },
                { name: "twitter:title", content: name },
                { name: "twitter:description", content: description },
                {
                    name: "twitter:image",
                    content: faviconUrl,
                },
                {
                    name: "twitter:image:alt",
                    content: `The ${name} logo`,
                },
            ],
            links: [
                {
                    rel: "icon",
                    type: "image/png",
                    href: "/assets/images/favicons/favicon-192.png",
                },
                { rel: "preconnect", href: "https://fonts.googleapis.com/" },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
            ],
            style: `/* latin-ext */
            @font-face {
              font-family: 'Barlow';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/barlow/v11/7cHpv4kjgoGqM7E_Ass5ynghnQci.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            /* latin */
            @font-face {
              font-family: 'Barlow';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/barlow/v11/7cHpv4kjgoGqM7E_DMs5ynghnQ.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            `,
        }),
        VitePWA({
            mode: "development",
            base: "/",
            srcDir: "src",
            strategies: "injectManifest",
            filename: "sw.ts",
            manifest: {
                id: "https://next-schedules.unisontech.org",
                name: "Schedules",
                short_name: "Schedules",
                theme_color: "#BE185D",
                start_url: "/",
                display: "standalone",
                background_color: "#000000",
                orientation: "natural",
                prefer_related_applications: true,
                related_applications: [
                    {
                        platform: "play",
                        url: "https://play.google.com/store/apps/details?id=com.hkamran.schedules",
                        id: "com.hkamran.schedules",
                    },
                ],
            },
            devOptions: {
                enabled: true,
                type: "module",
                navigateFallback: "index.html",
            },
        }),
        vue(),
    ],
});