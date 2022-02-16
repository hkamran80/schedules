<template>
    <v-card>
        <v-card-title class="text-wrap--break">
            Edit Period Names

            <v-spacer />

            <v-btn
                icon
                color="primary"
                title="Undo period name changes"
                aria-label="Undo period name changes"
                @click="restoreNames"
                v-if="!sameNames"
            >
                <v-icon v-text="mdiRestore" />
            </v-btn>
            <v-btn
                icon
                color="primary"
                title="Clear period names"
                aria-label="Clear period names"
                @click="clearNames"
            >
                <v-icon v-text="mdiDeleteForeverOutline" />
            </v-btn>
            <v-btn
                icon
                color="primary"
                title="Save period names"
                aria-label="Save period names"
                @click="saveNames"
                :disabled="sameNames"
            >
                <v-icon v-text="mdiCheck" />
            </v-btn>
            <v-btn
                icon
                color="primary"
                title="Close dialog"
                aria-label="Close dialog"
                @click="closeDialog"
                :disabled="!sameNames"
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
import {
    computed,
    defineComponent,
    ref,
    SetupContext,
} from "@vue/composition-api";
import {
    mdiRestore,
    mdiDeleteForeverOutline,
    mdiCheck,
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
        const periodNames = ref(Object.assign({}, props.currentPeriodNames));

        const closeDialog = () => emit("close");
        const saveNames = () => {
            savePeriodNames(props.scheduleId, periodNames.value);
            emit("update", periodNames.value);
            toast.success("Saved period names!");
            closeDialog();
        };

        const restoreNames = () => {
            periodNames.value = Object.assign({}, props.currentPeriodNames);
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

        const sameNames = computed(() => {
            const periodNameValues = Object.values(periodNames.value);
            return (
                Object.values(props.currentPeriodNames)
                    .map((name, index) => [name, periodNameValues[index]])
                    .map(([original, user]) => original === user)
                    .filter((result) => result === false).length === 0
            );
        });

        return {
            periodNames,

            sameNames,
            closeDialog,
            saveNames,
            restoreNames,
            clearNames,

            // Icons
            mdiRestore,
            mdiDeleteForeverOutline,
            mdiCheck,
            mdiClose,
        };
    },
});
</script>
