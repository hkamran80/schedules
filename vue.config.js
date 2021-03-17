module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title =
                process.env.NODE_ENV === "development"
                    ? "Schedules (dev)"
                    : process.env.VUE_APP_EDGE_MODE === "true"
                    ? "Schedules (edge)"
                    : "Schedules";
            return args;
        });
    },
    pwa: {
        name:
            process.env.NODE_ENV === "development"
                ? "Schedules (dev)"
                : process.env.VUE_APP_EDGE_MODE === "true"
                ? "Schedules (edge)"
                : "Schedules",
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
