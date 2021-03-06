<template>
    <v-card class="mx-auto">
        <v-card-title class="mb-1">
            <v-row align="center">
                <v-col class="text-wrap--break">
                    What's New in Schedules
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn
                        icon
                        color="primary"
                        href="https://github.com/hkamran80/schedules"
                        target="_blank"
                    >
                        <v-icon>mdi-github</v-icon>
                    </v-btn>
                    <v-btn icon color="primary" @click="close_dialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle>
            Current Version: <span v-text="$app_version" />
        </v-card-subtitle>
        <v-card-text>
            <v-expansion-panels accordion>
                <v-expansion-panel
                    v-for="(items, version) in whatsnew"
                    :key="version"
                >
                    <v-expansion-panel-header>
                        {{ version }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <span
                            v-for="wn_item of items"
                            :key="wn_item"
                            class="whatsnew-item"
                            v-text="wn_item"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
import whatsnew from "@/whatsnew.json";

export default {
    name: "WhatsNew",
    data: function() {
        return { whatsnew: whatsnew };
    },
    methods: {
        close_dialog: function() {
            this.$emit("close");
        }
    }
};
</script>

<style scoped>
.whatsnew-item {
    display: block;
    margin-bottom: 5px;
}
</style>
