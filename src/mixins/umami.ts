import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            umamiInstalled: document.getElementById("umami-script") !== null,
        };
    },
    created() {
        if (
            !this.$developmentMode &&
            localStorage.getItem("umamiTracking") !== "false"
        ) {
            this.installUmami();

            if (localStorage.getItem("umamiTracking") === null) {
                localStorage.setItem("umamiTracking", "true");
            }
        }
    },
    methods: {
        installUmami() {
            if (
                !this.$developmentMode &&
                !document.getElementById("umami-script")
            ) {
                const umamiScript = document.createElement("script"),
                    scriptTag = document.getElementsByTagName("script")[0];

                umamiScript.async = true;
                umamiScript.defer = true;
                umamiScript.src = "https://umami.unisontech.org/umami.js";
                umamiScript.id = "umami-script";
                umamiScript.setAttribute(
                    "data-website-id",
                    this.$edgeMode
                        ? "377298e5-bec6-48f0-a2f1-7070f42f12ca"
                        : "ab9840ad-16a1-4b04-b87f-e5e396f466b4"
                );

                if (scriptTag.parentNode) {
                    scriptTag.parentNode.insertBefore(umamiScript, scriptTag);

                    console.log("Activated Umami anonymous analytics");
                } else {
                    console.error(
                        "An unknown error occurred when attempting to activate Umami"
                    );
                }
            }
        },
        uninstallUmami() {
            if (!this.$developmentMode) {
                const umamiScript = document.getElementById("umami-script");

                if (umamiScript) {
                    umamiScript.remove();
                    localStorage.setItem("umamiTracking", "false");

                    console.log("Deactivated Umami anonymous analytics");
                } else {
                    console.error(
                        "An unknown error occurred when attempting to deactivate Umami"
                    );
                }
            }
        },
    },
});
