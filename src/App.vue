<template>
    <v-app id="app">
        <v-main>
            <v-container fluid>
                <navigation-bar />

                <router-view :schedules="schedules" />

                <v-snackbar bottom right :value="updateExists" :timeout="-1">
                    An update is available for Schedules! Check out what's new
                    on the homepage after the update!

                    <template v-slot:action="{ attrs }">
                        <v-btn
                            text
                            color="primary"
                            @click="refreshApp"
                            v-bind="attrs"
                        >
                            Update
                        </v-btn>
                    </template>
                </v-snackbar>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    ref,
    SetupContext,
    watch,
} from "@vue/composition-api";
import NavigationBar from "@/components/NavigationBar.vue";

import { provideToast } from "vue-toastification/composition";
import { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import schedulesJson from "@/schedules.json";
import { Schedule } from "@/structures/schedule";

import { installUmami, umamiInstallStatus } from "@/composables/umami";
import { loadUpdateMechanism } from "@/composables/update";

// Temporary
import { loadFromStorage } from "@/constructs/storage";
import { StorageKeyType } from "@/structures/storage";

const schedules = schedulesJson as Schedule;

export default defineComponent({
    components: { NavigationBar },
    setup(_, context: SetupContext) {
        // Toast
        provideToast({
            position: POSITION.BOTTOM_RIGHT,
            transition: "Vue-Toastification__bounce",
            maxToasts: 3,
            newestOnTop: true,
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            draggable: false,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            icon: true,
            rtl: false,
        });

        // Page Title
        const baseDocumentTitle = ref("Schedules");
        watch(
            () => context.root.$route.name,
            (newName) => {
                if (newName === "Home") {
                    document.title = baseDocumentTitle.value;
                } else if (
                    newName === "Schedule" &&
                    typeof schedules[context.root.$route.params.id] !==
                        "undefined"
                ) {
                    document.title = `${baseDocumentTitle.value} | ${
                        schedules[context.root.$route.params.id].name
                    }`;
                } else if (newName === "NotFound") {
                    document.title = `${baseDocumentTitle.value} | Page Not Found`;
                } else {
                    document.title = baseDocumentTitle.value;
                }
            }
        );

        onMounted(() => {
            // Umami
            const { allowed } = umamiInstallStatus();
            console.debug(`Current status: ${allowed.value}`);
            console.debug(
                `LS variable: ${loadFromStorage(
                    "",
                    StorageKeyType.ANALYTICS_STATUS
                )}`
            );
            if (allowed.value === true) {
                installUmami(context.root);
            }
        });

        // Update Mechanism
        const { updateExists, refreshApp } = loadUpdateMechanism();

        return { schedules, baseDocumentTitle, updateExists, refreshApp };
    },
});
</script>

<style>
#app {
    font-family: Lato, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    padding: 15px 45px;
}

a {
    text-decoration: none;
}

/* Global Styles */
.text-wrap--break {
    display: inline-block;
    word-break: break-word !important;
    word-wrap: break-word;
}
</style>
