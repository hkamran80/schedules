<template>
    <v-row align="center" dense>
        <v-col cols="2">
            <v-select :items="days" label="Day" outlined />
        </v-col>
        <v-col cols="4">
            <v-text-field v-model="period" label="Period Name" outlined />
        </v-col>

        <v-spacer />

        <v-col cols="3">
            <v-dialog
                ref="starttime_dialog"
                v-model="dialogs.start_time"
                :return-value.sync="times.start"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="times.start"
                        label="Start Time"
                        readonly
                        outlined
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-time-picker
                    v-model="times.start"
                    ampm-in-title
                    format="ampm"
                    :max="times.end"
                >
                    <v-btn
                        text
                        color="primary"
                        @click="dialogs.start_time = false"
                    >
                        Cancel
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.starttime_dialog.save(times.start)"
                    >
                        Save
                    </v-btn>
                </v-time-picker>
            </v-dialog>
        </v-col>
        <v-col cols="3">
            <v-dialog
                ref="endtime_dialog"
                v-model="dialogs.end_time"
                :return-value.sync="times.end"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="times.end"
                        label="End Time"
                        readonly
                        outlined
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-time-picker
                    v-model="times.end"
                    ampm-in-title
                    format="ampm"
                    :min="times.start"
                >
                    <v-btn
                        text
                        color="primary"
                        @click="dialgos.end_time = false"
                    >
                        Cancel
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.endtime_dialog.save(times.end)"
                    >
                        Save
                    </v-btn>
                </v-time-picker>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "ScheduleRow",
    data: function() {
        return {
            period: "",
            times: {
                start: "",
                end: ""
            },
            days: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            dialogs: {
                start_time: false,
                end_time: false
            }
        };
    },
    methods: {
        test: function() {
            console.debug(this.return_schedule_info());
        },
        return_schedule_info: function() {
            return {
                name: this.period,
                times: this.times
            };
        }
    }
};
</script>
