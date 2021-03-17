<template>
    <center-layout>
        <header class="pb-4">
            <h2>
                New Schedule (alpha)
            </h2>
        </header>

        <h3 class="pb-3">
            <v-row dense no-gutters align="center">
                <v-col>
                    Information
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn
                        icon
                        color="primary"
                        @click="dialogs.metadata = true"
                    >
                        <v-icon>
                            mdi-help-circle-outline
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </h3>

        <v-text-field
            v-model="metadata.id"
            label="ID"
            hint="Example: ca-auhsd-dls (AUHSD Distance Learning Schedule) or ca-auhsd-hss (AUHSD High School Standard Schedule)"
            outlined
        />
        <v-text-field
            v-model="metadata.name"
            label="Name"
            hint="Your schedule's name"
            outlined
        />
        <v-text-field
            v-model="metadata.short_name"
            label="Short Name"
            hint="Your schedule's short name, used in notifications"
            outlined
        />
        <v-text-field
            v-model="metadata.color"
            label="Color"
            hint="Your schedule's color, used on the homepage"
            outlined
        />

        <v-divider />

        <h3 class="py-3">
            <v-row dense no-gutters align="center">
                <v-col>
                    Schedule
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn
                        icon
                        color="primary"
                        @click="dialogs.schedule = true"
                    >
                        <v-icon>
                            mdi-help-circle-outline
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </h3>

        <schedule-row />
        <schedule-row />

        <v-dialog v-model="dialogs.metadata" width="750" scrollable>
            <Metadata @close="close_dialog" />
        </v-dialog>
        <v-dialog v-model="dialogs.schedule" width="750" scrollable>
            <Schedule @close="close_dialog" />
        </v-dialog>
    </center-layout>
</template>

<script>
import CenterLayout from "@/components/CenterLayout.vue";
import Metadata from "@/components/dialogs/NewSchedule/Metadata.vue";
import Schedule from "@/components/dialogs/NewSchedule/Schedule.vue";
import ScheduleRow from "@/components/dialogs/NewSchedule/ScheduleRow.vue";

export default {
    name: "NewSchedule",
    components: { CenterLayout, Metadata, Schedule, ScheduleRow },
    data: function() {
        return {
            metadata: {
                id: "",
                name: "",
                short_name: "",
                color: ""
            },
            schedule: [],
            dialogs: {
                metadata: false,
                schedule: false
            }
        };
    }
};
</script>
