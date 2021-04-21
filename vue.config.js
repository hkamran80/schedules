const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const schedules = require("./src/schedules.json");

const webTitle =
    process.env.NODE_ENV === "development"
        ? "Schedules (dev)"
        : process.env.VUE_APP_EDGE_MODE === "true"
        ? "Schedules (edge)"
        : "Schedules";

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title = webTitle;
            return args;
        });

        config.plugins.delete("prefetch");
    },
    configureWebpack: {
        output: {
            crossOriginLoading: "anonymous"
        },
        plugins: [
            new PreloadWebpackPlugin({
                rel: "preload",
                include: "allChunks"
            })
        ]
    },
    pwa: {
        name: webTitle,
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
                /schedules\.json$/
            ]
        },
        manifestOptions: {
            icons: [
                {
                    src: "/img/favicons/favicon-32.png",
                    sizes: "32x32",
                    type: "image/png"
                },
                {
                    src: "/img/favicons/favicon-16.png",
                    sizes: "16x16",
                    type: "image/png"
                },
                {
                    src: "/img/favicons/favicon-144.png",
                    sizes: "144x144",
                    type: "image/png"
                },
                {
                    src: "/img/favicons/favicon-152.png",
                    sizes: "152x152",
                    type: "image/png"
                },
                {
                    src: "/img/favicons/safari-pinned-tab.svg",
                    sizes: "942x942",
                    type: "image/svg+xml"
                }
            ],
            shortcuts: [
                Object.values(schedules.slice(0, 4)).map(schedule => {
                    return {
                        name: schedule.name,
                        short_name: schedule.shortName,
                        description: `The ${schedule.name}`,
                        icons: [
                            {
                                src: "/img/icons/school-outline.192.png",
                                sizes: "192x192"
                            }
                        ]
                    };
                })
            ],
            display_override: ["minimal-ui"],
            display: "standalone",
            background_color: "#6D1E3B",
            url: process.env.VUE_APP_EDGE_MODE
                ? "https://beta-schedules.unisontech.org"
                : "https://schedules.unisontech.org",
            manifestUrl: "/manifest.json",
            lang: "en",
            orientation: "any",
            description:
                "An app for schedules. Find out exactly how much time is remaining in a period or what the period is.",
            scope: "https://beta-schedules.unisontech.org",
            categories: ["productivity", "utilities"],
            prefer_related_applications: false,
            related_applications: []
        }
    }
};
