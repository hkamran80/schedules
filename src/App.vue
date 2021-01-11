<template>
    <v-app id="app">
        <v-main>
            <v-container fluid>
                <navigation-bar :schedules="schedules" />
                <router-view :schedules="schedules" />

                <v-snackbar bottom right :value="updateExists" :timeout="-1">
                    An update is available for Schedules!

                    <template v-slot:action="{ attrs }">
                        <v-btn
                            text
                            color="primary"
                            @click="refreshApp"
                            v-bind="attrs"
                        >
                            Update
                        </v-btn>
                    </template>
                </v-snackbar>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import update from "./mixins/update";
import schedules from "@/schedules.json";

export default {
    name: "App",
    data: () => ({
        debug: false,
        schedules: schedules
    }),
    components: {
        NavigationBar
    },
    mixins: [update]
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    padding: 15px 45px;
}

a {
    text-decoration: none;
}
</style>
