<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Export Notifications

            <v-spacer />

            <v-btn icon color="primary" @click="copyAllowedNotifications">
                <v-icon v-text="mdiContentCopy" />
            </v-btn>
            <v-btn icon color="primary" @click="closeDialog">
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-textarea
                id="exportableAllowedNotifications"
                v-model="exportableAllowedNotifications"
                rows="8"
                readonly
                outlined
                label="Exportable Notifications"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from "@vue/composition-api";
import { mdiContentCopy, mdiClose } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import { AllowedNotifications } from "@/structures/notifications";

export default defineComponent({
    props: {
        allowedNotifications: {
            type: Object as () => AllowedNotifications,
            required: true,
            default: function() {
                return {} as AllowedNotifications;
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }: SetupContext) {
        const toast = useToast();

        const exportableAllowedNotifications = computed(() =>
            JSON.stringify(props.allowedNotifications)
        );

        const closeDialog = () => emit("close");
        const copyAllowedNotificationsFallback = () => {
            const element = document.getElementById(
                "exportableAllowedNotifications"
            ) as HTMLInputElement;

            if (element) {
                element.select();

                try {
                    document.execCommand("copy");
                    toast.info("Copied allowed notifications to the clipboard");
                } catch (error) {
                    toast.error(
                        "Unable to copy the allowed notifications to the clipboard"
                    );
                    console.error(
                        "Unable to copy allowed notifications via fallback: ",
                        error
                    );
                }
            }
        };
        const copyAllowedNotifications = () =>
            navigator.clipboard
                .writeText(exportableAllowedNotifications.value)
                .then(
                    () =>
                        toast.info(
                            "Copied allowed notifications to the clipboard"
                        ),
                    () => copyAllowedNotificationsFallback()
                );

        return {
            closeDialog,
            exportableAllowedNotifications,
            copyAllowedNotifications,

            // Icons
            mdiContentCopy,
            mdiClose,
        };
    },
});
</script>
