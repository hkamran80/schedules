// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;

const pageTitle =
    process.env.NODE_ENV === "development"
        ? "Schedules (dev)"
        : process.env.VUE_APP_EDGE_MODE === "true"
        ? "Schedules (edge)"
        : "Schedules";

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title = pageTitle;

            return args;
        });
    },
    configureWebpack: {
        output: {
            crossOriginLoading: "anonymous"
        }
        // plugins: [new BundleAnalyzerPlugin()]
    },
    pwa: {
        name: pageTitle,
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
