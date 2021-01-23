<template>
    <v-card class="mx-auto" :outlined="outlined">
        <v-card-title>
            <span class="font-weight-light" v-text="title" />
            <v-spacer />
            <v-btn icon @click="hidden = !hidden">
                <v-icon v-if="hidden">
                    mdi-chevron-down
                </v-icon>
                <v-icon v-else>
                    mdi-chevron-up
                </v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text v-show="!hidden">
            <slot />
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "ExpandableCard",
    props: {
        title: {
            type: String,
            required: true
        },
        outlined: {
            type: Boolean,
            default: true
        }
    },
    data: function() {
        return { hidden: true };
    }
};
</script>
