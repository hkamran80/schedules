<template>
    <v-card class="mx-auto">
        <v-card-title class="mb-1">
            <v-row align="center">
                <v-col class="text-wrap--break">
                    Schedule
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn icon color="primary" @click="closeDialog">
                        <v-icon v-text="mdiClose" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text> </v-card-text>
    </v-card>
</template>

<script>
import { mdiClose } from "@mdi/js";

export default {
    name: "Schedule",
    data: function() {
        return {
            mdiClose: mdiClose,
        };
    },
    methods: {
        closeDialog: function() {
            this.$emit("close");
        },
    },
};
</script>
