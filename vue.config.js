// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;

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

        // config
        //     .plugin("preload")
        //     .use("@vue/preload-webpack-plugin")
        //     .tap(options => {
        //         options[0].include = "allChunks";
        //         return options;
        //     });
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
            exclude: [/\.map$/, /_redirects/, /_headers/]
        },
        manifestOptions: {
            backgroundColor: "#C2185B"
        }
    }
};
