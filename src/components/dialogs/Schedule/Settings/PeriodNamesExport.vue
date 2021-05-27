<template>
    <v-card class="mx-auto">
        <v-card-title>
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
                id="periodNamesString"
                v-model="periodNamesString"
                rows="8"
                readonly
                outlined
                label="Period Names String"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import { mdiContentCopy, mdiClose } from "@mdi/js";

export default {
    props: { periodNamesString: { type: String, required: true } },
    data() {
        return { mdiContentCopy: mdiContentCopy, mdiClose: mdiClose };
    },
    methods: {
        copyPeriodNames() {
            let exportedPeriodNamesElement = document.getElementById(
                "periodNamesString"
            );
            exportedPeriodNamesElement.select();
            document.execCommand("copy");

            this.$emit("afterCopy");
        },
        closeDialog() {
            this.$emit("close");
        }
    }
};
</script>
