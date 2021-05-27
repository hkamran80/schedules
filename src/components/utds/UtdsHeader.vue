<template>
    <header class="pb-7">
        <h2 v-text="title" v-if="!$slots.icons" />

        <h3 v-text="subtitle" v-if="!$slots.icons && !subtitleTooltip" />
        <v-tooltip bottom v-else-if="!$slots.icons && subtitleTooltip">
            <template v-slot:activator="{ on, attrs }">
                <h3 v-text="subtitle" v-bind="attrs" v-on="on" />
            </template>
            <span v-text="subtitleTooltip" />
        </v-tooltip>

        <v-row dense no-gutters align="center" v-if="$slots.icons">
            <v-col>
                <h2 v-text="title" />
                <h3 v-text="subtitle" v-if="!subtitleTooltip" />
                <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on, attrs }">
                        <h3 v-text="subtitle" v-bind="attrs" v-on="on" />
                    </template>
                    <span v-text="subtitleTooltip" />
                </v-tooltip>
            </v-col>
            <v-col cols="3" class="text-right header-icons">
                <slot name="icons" />
            </v-col>
        </v-row>
    </header>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "UtdsHeader",
    props: {
        title: {
            type: String,
            required: true
        },
        subtitle: String,
        subtitleTooltip: String
    },
    created() {
        if (this.$vuetify.breakpoint.mobile) {
            document.documentElement.style.setProperty(
                "--header-icons-margin-left",
                "0px"
            );
        }
    }
});
</script>

<style>
:root {
    --header-icons-margin-left: 8px;
}
</style>

<style scoped>
div.header-icons * {
    margin-left: var(--header-icons-margin-left);
}
</style>
