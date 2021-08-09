/* eslint-disable @typescript-eslint/no-var-requires */

const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const schedules = require("./src/schedules.json");

const title =
        process.env.NODE_ENV === "development"
            ? "Schedules (dev)"
            : process.env.VUE_APP_EDGE_MODE === "true"
            ? "Schedules (edge)"
            : "Schedules",
    url =
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8080"
            : process.env.VUE_APP_EDGE_MODE === "true"
            ? "https://beta-schedules.unisontech.org"
            : "https://schedules.unisontech.org",
    scheduleKeys = Object.keys(schedules),
    scheduleValues = Object.values(schedules);

const description =
    "An app for schedules. Find out exactly how much time is remaining in a period or what the period is.";

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = title;
            args[0].url = url;
            args[0].description = description;
            args[0].developmentMode = process.env.NODE_ENV === "development";

            return args;
        });

        config.plugins.delete("prefetch");
    },
    configureWebpack: {
        output: {
            crossOriginLoading: "anonymous",
        },
        plugins: [
            new PreloadWebpackPlugin({
                rel: "preload",
                include: ["schedule"],
            }),
        ],
    },
    pwa: {
        name: title,
        themeColor: "#6D1E3B",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js",
            exclude: [
                /\.map$/,
                /img\/favicons\//,
                /social_preview\.png/,
                /favicon\.ico$/,
                /^manifest.*\.js?$/,
                /_redirects/,
                /_headers/,
            ],
        },
        manifestOptions: {
            icons: [
                // Favicons
                {
                    src: "/img/favicons/favicon-16.png",
                    sizes: "16x16",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/img/favicons/favicon-32.png",
                    sizes: "32x32",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/img/favicons/favicon-144.png",
                    sizes: "144x144",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/img/favicons/favicon-152.png",
                    sizes: "152x152",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/img/favicons/favicon-512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/img/favicons/safari-pinned-tab.svg",
                    sizes: "942x942",
                    type: "image/svg+xml",
                    purpose: "any",
                },

                // Maskable
                {
                    src: "/img/maskable/maskable-16.png",
                    sizes: "16x16",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/img/maskable/maskable-32.png",
                    sizes: "32x32",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/img/maskable/maskable-144.png",
                    sizes: "144x144",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/img/maskable/maskable-152.png",
                    sizes: "152x152",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/img/maskable/maskable-192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "maskable",
                },
                {
                    src: "/img/maskable/maskable-196.png",
                    sizes: "196x196",
                    type: "image/png",
                    purpose: "maskable",
                },
            ],
            shortcuts: scheduleValues.slice(0, 4).map((schedule) => {
                return {
                    name: schedule.name,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    short_name: schedule.shortName,
                    description: `The ${schedule.name}`,
                    url: `/schedule/${
                        scheduleKeys[
                            scheduleValues.indexOf(
                                scheduleValues.filter(
                                    (scheduleValue) =>
                                        scheduleValue.name === schedule.name
                                )[0]
                            )
                        ]
                    }`,
                    icons: [
                        {
                            src: `/img/icons/${schedule.icon}.192.png`,
                            sizes: "192x192",
                        },
                    ],
                };
            }),

            // eslint-disable-next-line @typescript-eslint/camelcase
            display_override: ["minimal-ui"],
            display: "standalone",

            // eslint-disable-next-line @typescript-eslint/camelcase
            background_color: "#6D1E3B",
            url: url,
            manifestUrl: "/manifest.json",
            lang: "en",
            orientation: "natural",
            description: description,
            scope: url,
            categories: ["productivity", "utilities"],

            // eslint-disable-next-line @typescript-eslint/camelcase
            prefer_related_applications: false,

            // eslint-disable-next-line @typescript-eslint/camelcase
            related_applications: [],
        },
    },
};
