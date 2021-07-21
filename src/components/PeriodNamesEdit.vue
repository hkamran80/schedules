<template>
    <v-card class="mx-auto">
        <v-card-title>
            <v-row align="center">
                <v-col class="text-wrap--break">
                    Edit Period Names
                </v-col>
                <v-col cols="4" class="text-right">
                    <v-btn icon color="primary" @click="savePeriodNames">
                        <v-icon v-text="mdiContentSaveOutline" />
                    </v-btn>
                    <v-btn icon color="primary" @click="closeDialog">
                        <v-icon v-text="mdiClose" />
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <v-progress-linear
                color="primary lighten-1"
                background-color="primary lighten-4"
                indeterminate
                v-if="Object.keys(this.periodNames).length === 0"
            />

            <div v-if="Object.keys(this.periodNames).length !== 0">
                <v-text-field
                    v-for="(value, pn) of periodNames"
                    :key="pn"
                    :label="pn"
                    v-model="periodNames[pn]"
                    outlined
                />
            </div>
        </v-card-text>
    </v-card>
</template>
