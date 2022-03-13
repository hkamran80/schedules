<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Import Period Names

            <v-spacer />

            <v-btn
                icon
                color="primary"
                @click="importNames"
                :disabled="
                    importablePeriodNames === null ||
                        importablePeriodNames === ''
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
                v-model="importablePeriodNames"
                rows="8"
                outlined
                label="Period Names"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import { mdiCalendarImport, mdiClose } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import { PeriodNames, PeriodNamesError } from "@/models/periods";
import { Nullable } from "@/models/types";
import { importPeriodNames, savePeriodNames } from "@/constructs/periods";

export default defineComponent({
    props: {
        scheduleId: {
            type: String,
            required: true,
            default: "",
        },
        periodNames: {
            type: Object as () => PeriodNames,
            required: true,
            default: function() {
                return {} as PeriodNames;
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }: SetupContext) {
        const toast = useToast();

        const importablePeriodNames = ref(null as Nullable<string>);

        const closeDialog = () => emit("close");
        const importNames = () => {
            if (importablePeriodNames.value) {
                const periodNames = importPeriodNames(
                    importablePeriodNames.value,
                    props.periodNames
                );

                if (periodNames.constructor === Object) {
                    toast.success("Successfully imported period names!");
                    savePeriodNames(
                        props.scheduleId,
                        periodNames as PeriodNames
                    );
                    emit("save", periodNames as PeriodNames);
                    emit("close");
                } else if (periodNames === PeriodNamesError.KEY_ERROR) {
                    toast.error(
                        "One of the period keys is incorrect. Please copy and paste the exported period names from Schedules."
                    );
                } else {
                    toast.error(
                        "Unable to import period names due to an unknown error. Please try again."
                    );
                }
            }
        };

        return {
            closeDialog,

            importablePeriodNames,
            importNames,

            // Icons
            mdiCalendarImport,
            mdiClose,
        };
    },
});
</script>
