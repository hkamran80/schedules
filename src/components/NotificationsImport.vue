<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Import Notifications

            <v-spacer />

            <v-btn
                icon
                color="primary"
                @click="importNotifications"
                :disabled="
                    importableNotifications === null ||
                        importableNotifications === ''
                "
            >
                <v-icon v-text="mdiCalendarImport" />
            </v-btn>
            <v-btn
                icon
                color="primary"
                title="Close dialog"
                aria-label="Close dialog"
                @click="closeDialog"
            >
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-textarea
                v-model="importableNotifications"
                rows="8"
                outlined
                label="Notifications"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import { mdiCalendarImport, mdiClose } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import { Nullable } from "@/structures/types";
import {
    AllowedNotifications,
    NotificationSettingsError,
} from "@/structures/notifications";
import {
    importNotificationSettings,
    saveAllowedNotifications,
} from "@/constructs/notifications";

export default defineComponent({
    props: {
        scheduleId: {
            type: String,
            required: true,
            default: "",
        },
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

        const importableNotifications = ref(null as Nullable<string>);

        const closeDialog = () => emit("close");
        const importNotifications = () => {
            if (importableNotifications.value) {
                const allowedNotifications = importNotificationSettings(
                    importableNotifications.value,
                    props.allowedNotifications
                );

                if (allowedNotifications.constructor === Object) {
                    toast.success("Succesfully imported period names!");
                    saveAllowedNotifications(
                        props.scheduleId,
                        allowedNotifications as AllowedNotifications
                    );
                    emit(
                        "save",
                        allowedNotifications as AllowedNotifications,
                        true
                    );
                    emit("close");
                } else if (
                    allowedNotifications ===
                    NotificationSettingsError.KV_PAIR_ERROR
                ) {
                    toast.error(
                        "One of the key/value pairs is incorrect. Please copy and paste the exported notification settings from Schedules."
                    );
                } else if (
                    allowedNotifications ===
                    NotificationSettingsError.ROOT_KEY_ERROR
                ) {
                    toast.error(
                        "One of the root keys is incorrect. Please copy and paste the exported notification settings from Schedules"
                    );
                } else if (
                    allowedNotifications ===
                    NotificationSettingsError.IMPORT_ERROR
                ) {
                    toast.error(
                        "Unable to import notification settings due to a parsing error. Please try again."
                    );
                } else {
                    toast.error(
                        "Unable to import notification settings due to an unknown error. Please try again."
                    );
                }
            }
        };

        return {
            closeDialog,

            importableNotifications,
            importNotifications,

            // Icons
            mdiCalendarImport,
            mdiClose,
        };
    },
});
</script>
