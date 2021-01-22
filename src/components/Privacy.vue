<template>
    <v-card class="mx-auto">
        <v-card-title class="mb-1">
            <v-row align="center">
                <v-col class="text-wrap--break">
                    Privacy Notice
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-btn icon color="primary" @click="close_dialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle>
            This is a work-in-progress
        </v-card-subtitle>
        <v-card-text>
            <p>
                Schedules uses the open-source anonymous analytics platform
                <a href="https://umami.is" target="_blank">Umami</a> for
                tracking page views.
            </p>
            <p>
                <strong>
                    What is Umami?
                </strong>
            </p>
            <div class="hk-blockquote">
                <p>
                    Umami is a simple, easy to use, self-hosted web analytics
                    solution. The goal is to provide you with a friendlier,
                    privacy-focused alternative to Google Analytics and a free,
                    open-sourced alternative to paid solutions. Umami collects
                    only the metrics you care about and everything fits on a
                    single page.
                </p>
                <p>
                    <i>
                        Source:
                        <a href="https://umami.is/docs/about" target="_blank">
                            Umami
                        </a>
                    </i>
                </p>
            </div>
            <p>
                <strong>
                    What are Umami's features?
                </strong>
                Umami has many features, including simple analytics, a focus on
                privacy, and ownership of data collected. A full list of
                features is available on the
                <a href="https://umami.is/docs/features" target="_blank">
                    Umami website
                </a>
            </p>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "Privacy",
    methods: {
        close_dialog: function() {
            this.$emit("close");
        }
    }
};
</script>

<style scoped>
.hk-blockquote {
    border-left: 5px solid lightgray;
    padding-left: 15px;
}
</style>
