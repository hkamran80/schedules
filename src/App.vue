<template>
    <v-app id="app">
        <v-main>
            <v-container fluid>
                <utds-navigation-bar
                    :title="
                        `Schedules ${
                            $edgeMode
                                ? '(edge)'
                                : $developmentMode
                                ? '(dev)'
                                : ''
                        }`.trim()
                    "
                    :vueRouterInstalled="true"
                    homeLinkColor="primary"
                    :buttons="navigationButtons"
                    @toggleTheme="toggleTheme"
                />

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
    SetupContext,
    onMounted,
    watch,
} from "@vue/composition-api";
import { mdiThemeLightDark, mdiCommentMultipleOutline } from "@mdi/js";
import {
    UtdsNavigationBar,
    UtdsNavigationBarStructures,
} from "utds-component-library";

import { provideToast } from "vue-toastification/composition";
import { POSITION } from "vue-toastification";

import schedulesJson from "@/schedules.json";
import { Schedule } from "@/models/schedule";
import { OldStorageItems } from "@/models/storage";

import { checkExistence, convertAnalytics } from "@/constructs/update";

import { installUmami, umamiInstallStatus } from "@/composables/umami";
import { loadUpdateMechanism } from "@/composables/update";
import { initializeThemeState, toggleThemeState } from "@/composables/theme";

const schedules = schedulesJson as Schedule;

export default defineComponent({
    components: { UtdsNavigationBar },
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
        const baseDocumentTitle = `Schedules ${
            context.root.$edgeMode
                ? "(edge)"
                : context.root.$developmentMode
                ? "(dev)"
                : ""
        }`.trim();
        watch(
            () => context.root.$route.name,
            (newName) => {
                if (newName === "Home") {
                    document.title = baseDocumentTitle;
                } else if (
                    newName === "Schedule" &&
                    typeof schedules[context.root.$route.params.id] !==
                        "undefined"
                ) {
                    document.title = `${baseDocumentTitle} | ${
                        schedules[context.root.$route.params.id].name
                    }`;
                } else if (newName === "NotFound") {
                    document.title = `${baseDocumentTitle} | Page Not Found`;
                } else {
                    document.title = baseDocumentTitle;
                }
            }
        );

        onMounted(() => {
            // Conversion
            const oldKeysCheck = checkExistence(null);
            if (oldKeysCheck.indexOf(OldStorageItems.ANALYTICS_STATUS) !== -1) {
                convertAnalytics();
            }

            // Umami
            const { allowed } = umamiInstallStatus();

            if (allowed.value === true) {
                installUmami(context.root);
            }
        });

        // Update Mechanism
        const { updateExists, refreshApp } = loadUpdateMechanism();

        // Theming
        initializeThemeState(context.root);
        const toggleTheme = () => toggleThemeState(context.root);

        // Navigation Bar
        const navigationButtons = [
            {
                type: UtdsNavigationBarStructures.ButtonType.Link,
                assistanceLabel: "Open Feedback Form",
                color: "primary",
                icon: mdiCommentMultipleOutline,
                visibleType: UtdsNavigationBarStructures.ButtonVisibleType.Icon,
                href: "https://form.typeform.com/to/g0MlHGXj",
                target: UtdsNavigationBarStructures.LinkTarget.NewTab,
                linkType:
                    UtdsNavigationBarStructures.LinkButtonLinkType.External,
            },
            {
                type: UtdsNavigationBarStructures.ButtonType.Function,
                assistanceLabel: "Toggle Theme",
                color: "primary",
                icon: mdiThemeLightDark,
                visibleType: UtdsNavigationBarStructures.ButtonVisibleType.Icon,
                callbackName: "toggleTheme",
            },
        ];

        return {
            schedules,
            baseDocumentTitle,
            updateExists,
            refreshApp,
            navigationButtons,

            toggleTheme,

            // Icons
            mdiThemeLightDark,
            mdiCommentMultipleOutline,
        };
    },
});
</script>

<style>
@import "~vue-toastification/dist/index.css";
@import "~utds-component-library/dist/utds-component-library.css";

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
