<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Export Period Names

            <v-spacer />

            <v-btn icon color="primary" @click="copyPeriodNames">
                <v-icon v-text="mdiContentCopy" />
            </v-btn>
            <v-btn icon color="primary" @click="closeDialog">
                <v-icon v-text="mdiClose" />
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-textarea
                id="exportablePeriodNames"
                v-model="exportablePeriodNames"
                rows="8"
                readonly
                outlined
                label="Exportable Period Names"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from "@vue/composition-api";
import { mdiContentCopy, mdiClose } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import { PeriodNames } from "@/structures/periods";

export default defineComponent({
    props: {
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

        const exportablePeriodNames = computed(() =>
            JSON.stringify(props.periodNames)
        );

        const closeDialog = () => emit("close");
        const copyPeriodNamesFallback = () => {
            const element = document.getElementById(
                "exportablePeriodNames"
            ) as HTMLInputElement;

            if (element) {
                element.select();

                try {
                    document.execCommand("copy");
                    toast.info("Copied period names to the clipboard");
                } catch (error) {
                    toast.error(
                        "Unable to copy the period names to the clipboard"
                    );
                    console.error(
                        "Unable to copy period names via fallback: ",
                        error
                    );
                }
            }
        };
        const copyPeriodNames = () =>
            navigator.clipboard.writeText(exportablePeriodNames.value).then(
                () => toast.info("Copied period names to the clipboard"),
                () => copyPeriodNamesFallback()
            );

        return {
            closeDialog,
            exportablePeriodNames,
            copyPeriodNames,

            // Icons
            mdiContentCopy,
            mdiClose,
        };
    },
});
</script>
