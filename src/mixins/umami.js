export default {
    data() {
        return {
            umamiInstalled: document.getElementById("umami-script") !== null
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
        installUmami: function() {
            if (
                !this.$developmentMode &&
                !document.getElementById("umami-script")
            ) {
                let umamiScript = document.createElement("script"),
                    scriptTag = document.getElementsByTagName("script")[0];

                umamiScript.async = true;
                umamiScript.defer = true;
                umamiScript.src = "https://umami-sepia.vercel.app/umami.js";
                umamiScript.id = "umami-script";
                umamiScript.setAttribute(
                    "data-website-id",
                    this.$edgeMode
                        ? "377298e5-bec6-48f0-a2f1-7070f42f12ca"
                        : "ab9840ad-16a1-4b04-b87f-e5e396f466b4"
                );

                scriptTag.parentNode.insertBefore(umamiScript, scriptTag);

                console.log("Activated Umami anonymous analytics");
            }
        },
        uninstallUmami: function() {
            if (!this.$developmentMode) {
                let umamiScript = document.getElementById("umami-script");

                umamiScript.remove();
                localStorage.setItem("umamiTracking", "false");

                console.log("Deactivated Umami anonymous analytics");
            }
        }
    }
};
