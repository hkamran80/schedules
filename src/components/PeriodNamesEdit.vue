<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Edit Period Names

            <v-spacer />

            <v-btn icon color="primary" @click="clearNames">
                <v-icon v-text="mdiDeleteForeverOutline" />
            </v-btn>
            <v-btn icon color="primary" @click="saveNames">
                <v-icon v-text="mdiContentSaveOutline" />
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
            <v-progress-linear
                color="primary lighten-1"
                background-color="primary lighten-4"
                indeterminate
                v-if="Object.keys(periodNames).length === 0"
            />

            <div v-if="Object.keys(periodNames).length !== 0">
                <v-text-field
                    v-for="(_, pn) of periodNames"
                    :key="pn"
                    :label="pn"
                    v-model="periodNames[pn]"
                    outlined
                />
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "@vue/composition-api";
import {
    mdiDeleteForeverOutline,
    mdiContentSaveOutline,
    mdiClose,
} from "@mdi/js";
import { useToast } from "vue-toastification/composition";

import { PeriodNames } from "@/structures/periods";
import { savePeriodNames } from "@/constructs/periods";

export default defineComponent({
    props: {
        scheduleId: {
            type: String,
            required: true,
            default: "",
        },
        currentPeriodNames: {
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
        const periodNames = ref(props.currentPeriodNames);

        const closeDialog = () => emit("close");
        const saveNames = () => {
            savePeriodNames(props.scheduleId, periodNames.value);
            emit("update", periodNames.value);
            toast.success("Saved period names!");
            closeDialog();
        };
        const clearNames = () => {
            const clearedPeriodNames = Object.fromEntries(
                Object.entries(periodNames.value).map(([periodName]) => [
                    periodName,
                    "",
                ])
            );
            savePeriodNames(props.scheduleId, clearedPeriodNames);
            emit("update", clearedPeriodNames);
            toast.success("Cleared period names!");
        };

        return {
            periodNames,

            closeDialog,
            saveNames,
            clearNames,

            // Icons
            mdiDeleteForeverOutline,
            mdiContentSaveOutline,
            mdiClose,
        };
    },
});
</script>
