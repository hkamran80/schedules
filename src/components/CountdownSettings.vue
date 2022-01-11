<template>
    <v-card class="mx-auto">
        <v-card-title class="text-wrap--break">
            Settings

            <v-spacer />

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
            <div class="my-3">
                <v-switch
                    v-model="twentyFourHourStatus"
                    label="Twenty-four Hour Time"
                    inset
                    hide-details
                    readonly
                    @click="setTFHStatus"
                />
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { mdiClose } from "@mdi/js";
import { loadDatetime } from "@/composables/dateTime";

export default defineComponent({
    setup(_, { emit }) {
        const closeDialog = () => emit("close");
        const { twentyFourHourStatus, setTFHStatus } = loadDatetime();

        return { twentyFourHourStatus, setTFHStatus, closeDialog, mdiClose };
    },
});
</script>
