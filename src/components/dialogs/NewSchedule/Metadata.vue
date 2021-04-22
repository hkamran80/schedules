<template>
    <v-card class="mx-auto">
        <v-card-title class="mb-1">
            <v-row align="center">
                <v-col class="text-wrap--break">
                    Metadata
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn icon color="primary" @click="closeDialog">
                        <v-icon v-text="mdiClose" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <h3 class="pb-1">
                ID
            </h3>
            <p>
                The schedule ID is a unique identifier that allows Schedules to
                navigate to a specific schedule. It follows a format of
                <code>
                    (State/Region/Province)-(District/Other Group)-(Three-letter
                    schedule code)</code
                >. For example, <code> ca-auhsd-dls</code>.
            </p>

            <h3 class="pb-1">
                Name
            </h3>
            <p>
                The name field is what your schedule's name is. For example,
                AUHSD Distance Learning Schedule.
            </p>

            <h3 class="pb-1">
                Short Name
            </h3>
            <p>
                The short name is the one that is used for notifications. For
                example, AUHSD Distance.
            </p>

            <h3 class="pb-1">
                Color
            </h3>
            <p>
                The color is used for the homepage's list of schedules
            </p>
        </v-card-text>
    </v-card>
</template>

<script>
import { mdiClose } from "@mdi/js";

export default {
    name: "Metadata",
    data: function() {
        return {
            mdiClose: mdiClose
        };
    },
    methods: {
        closeDialog: function() {
            this.$emit("close");
        }
    }
};
</script>
