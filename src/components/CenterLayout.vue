<template>
    <v-row align="center" justify="center">
        <v-spacer />
        <v-col cols="12" md="6">
            <slot />
        </v-col>
        <v-spacer />
    </v-row>
</template>

<script>
export default {
    name: "CenterLayout"
};
</script>
