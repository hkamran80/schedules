const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

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
        themeColor: "#C2185B",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js",
            exclude: [/\.map$/, /_redirects/, /_headers/, /schedules\.json$/]
        },
        manifestOptions: {
            background_color: "#C2185B"
        },
        iconPaths: {
            favicon32: "img/favicons/favicon-32.png",
            favicon16: "img/favicons/favicon-16.png",
            appleTouchIcon: "img/favicons/favicon-152.png",
            maskIcon: "img/favicons/safari-pinned-tab.svg",
            msTileImage: "img/favicons/favicon-144.png"
        }
    }
};
