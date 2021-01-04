module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title =
                process.env.NODE_ENV === "development"
                    ? "Schedules (beta)"
                    : "Schedules";
            return args;
        });
    },
    pwa: {
        name:
            process.env.NODE_ENV === "development"
                ? "Schedules (beta)"
                : "Schedules",
        themeColor: "#2c3e50",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js",
            exclude: [/\.map$/, /_redirects/]
        },
        manifestOptions: {
            backgroundColor: "#2c3e50"
        }
    }
};
