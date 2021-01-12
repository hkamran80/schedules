module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title =
                process.env.NODE_ENV === "development"
                    ? "Schedules (dev)"
                    : "Schedules";
            return args;
        });
    },
    pwa: {
        name:
            process.env.NODE_ENV === "development"
                ? "Schedules (dev)"
                : "Schedules",
        themeColor: "#C2185B",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js",
            exclude: [/\.map$/, /_redirects/]
        },
        manifestOptions: {
            backgroundColor: "#C2185B"
        }
    }
};
