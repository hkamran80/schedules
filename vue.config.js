module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title = "Schedules";
            return args;
        });
    },
    pwa: {
        name: "Schedules (beta)",
        themeColor: "#2c3e50",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js",
            exclude: ["/_redirects", "/version.json"],
            //skipWaiting: true,
            //clientsClaim: true
        },
        manifestOptions: {
            backgroundColor: "#2c3e50"
        }
    }
};
