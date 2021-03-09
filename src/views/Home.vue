<template>
    <center-layout>
        <header class="pb-4">
            <h2>Welcome! Select a schedule to begin!</h2>
        </header>

        <v-card
            v-for="(schedule, id) in schedules"
            :key="id"
            :color="schedule.color"
            :to="`/schedule/${id}`"
            :title="schedule.name"
            :aria-label="schedule.name"
            class="mx-auto schedule-card text-wrap--break"
            dark
            outlined
        >
            <v-card-title>
                <v-icon medium left v-text="schedule.icon" />
                <span v-text="schedule.name" />
            </v-card-title>
        </v-card>

        <v-divider class="my-5" />

        <v-card
            :to="{ name: 'NewSchedule' }"
            class="mx-auto schedule-card text-wrap--break"
            outlined
            v-if="$edge_mode || $dev_mode"
        >
            <v-card-title>
                <v-icon medium left>
                    mdi-plus
                </v-icon>
                New Schedule (alpha)
            </v-card-title>
        </v-card>

        <v-divider class="my-5" />

        <v-card
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.whatsNew = true"
        >
            <v-card-title>
                What's New
            </v-card-title>
        </v-card>

        <v-card
            class="mx-auto schedule-card text-wrap--break"
            outlined
            @click="dialogs.privacy = true"
        >
            <v-card-title>
                Privacy Notice
            </v-card-title>
        </v-card>

        <v-dialog v-model="dialogs.whatsNew" width="750" scrollable>
            <whats-new @close="closeDialogs" />
        </v-dialog>
        <v-dialog v-model="dialogs.privacy" width="750" scrollable>
            <privacy
                @installUmami="installUmami"
                @uninstallUmami="uninstallUmami"
                @close="closeDialogs"
            />
        </v-dialog>
    </center-layout>
</template>

<script>
import CenterLayout from "@/components/CenterLayout.vue";
import WhatsNew from "@/components/dialogs/WhatsNew.vue";
import Privacy from "@/components/dialogs/Privacy.vue";

export default {
    name: "Home",
    props: {
        schedules: Object
    },
    components: { CenterLayout, WhatsNew, Privacy },
    data: function() {
        return {
            dialogs: {
                whatsNew: false,
                privacy: false
            }
        };
    },
    created() {
        if (
            !this.$dev_mode &&
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
            let umamiScript = document.createElement("script"),
                scriptTag = document.getElementsByTagName("script")[0];

            umamiScript.async = true;
            umamiScript.defer = true;
            umamiScript.src = "https://umami-sepia.vercel.app/umami.js";
            umamiScript.id = "umami-script";
            umamiScript.setAttribute(
                "data-website-id",
                this.$edge_mode
                    ? "377298e5-bec6-48f0-a2f1-7070f42f12ca"
                    : "ab9840ad-16a1-4b04-b87f-e5e396f466b4"
            );

            scriptTag.parentNode.insertBefore(umamiScript, scriptTag);

            console.log("Activated Umami anonymous analytics");
        },
        uninstallUmami: function() {
            let umamiScript = document.getElementById("umami-script");

            umamiScript.remove();
            localStorage.setItem("umamiTracking", "false");

            console.log("Deactivated Umami anonymous analytics");
        },
        closeDialogs: function() {
            this.dialogs.whatsNew = false;
            this.dialogs.privacy = false;
        }
    }
};
</script>

<style scoped>
.v-card.schedule-card {
    padding: 0 5px;
    margin: 10px 0;
    text-align: center;
    word-break: break-word;
    word-wrap: break-word;
}
.v-card.schedule-card i.v-icon {
    margin-right: 15px;
}
</style>
