<template>
    <utds-navigation-bar
        :title="
            `Schedules ${
                $edgeMode ? '(edge)' : $developmentMode ? '(dev)' : ''
            }`.trim()
        "
        :vueRouterInstalled="true"
        homeLinkColor="primary"
        :buttons="buttons"
        @toggleTheme="toggleTheme"
    />
</template>

<script>
import {
    UtdsNavigationBar,
    UtdsNavigationBarStructures,
} from "utds-component-library";
import { mdiThemeLightDark, mdiCommentMultipleOutline } from "@mdi/js";

import "utds-component-library/dist/utds-component-library.css";

export default {
    name: "NavigationBar",
    components: { UtdsNavigationBar },
    data: function() {
        return {
            buttons: [
                {
                    type: UtdsNavigationBarStructures.ButtonType.Link,
                    assistanceLabel: "Open Feedback Form",
                    color: "primary",
                    icon: mdiCommentMultipleOutline,
                    visibleType:
                        UtdsNavigationBarStructures.ButtonVisibleType.Icon,
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
                    visibleType:
                        UtdsNavigationBarStructures.ButtonVisibleType.Icon,
                    callbackName: "toggleTheme",
                },
            ],
            mdiThemeLightDark,
            mdiCommentMultipleOutline,
        };
    },
    created() {
        if (this.$vuetify.breakpoint.mobile) {
            document.documentElement.style.setProperty(
                "--header-icons-margin-left",
                "0px"
            );
        }
    },
    mounted() {
        // Set theme
        const theme = localStorage.getItem("darkTheme");
        if (theme) {
            if (theme === "true") {
                this.$vuetify.theme.dark = true;
            } else {
                this.$vuetify.theme.dark = false;
            }
        } else if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            this.$vuetify.theme.dark = true;
            localStorage.setItem(
                "darkTheme",
                this.$vuetify.theme.dark.toString()
            );
        }
    },
    methods: {
        toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem(
                "darkTheme",
                this.$vuetify.theme.dark.toString()
            );
        },
    },
};
</script>

<style>
:root {
    --header-icons-margin-left: 10px;
}
</style>

<style scoped>
#navigation {
    padding: 30px 0;
}

#navigation a {
    font-weight: bold;
}

#navigation a.router-link-exact-active {
    color: var(--v-primary-base);
}

#navigation .navigation-item {
    margin: 0 var(--header-icons-margin-left);
}
</style>
