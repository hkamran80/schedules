<template>
    <div class="home">
        <h3>
            Welcome to Schedules! Click on a schedule below to get started!
        </h3>
        <div id="schedules">
            <router-link
                v-for="(schedule, schedule_id) in schedules"
                :key="schedule_id"
                :to="'/schedule/' + schedule_id"
                :title="schedule.name"
            >
                <v-card
                    class="mx-auto schedule-card"
                    :color="schedule.color"
                    dark
                    max-width="600"
                    outlined
                >
                    <v-card-title>
                        <v-icon medium left v-text="schedule.icon"></v-icon>
                        <span
                            class="title font-weight-light"
                            v-text="schedule.name"
                        ></span>
                    </v-card-title>
                </v-card>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
a {
    text-decoration: none;
}
div.v-card.schedule-card {
    padding: 0 5px;
    margin: 10px 0;
    text-align: center;
}
div.v-card.schedule-card i.v-icon {
    margin-right: 15px;
}
</style>

<script>
export default {
    name: "Home",
    props: {
        schedules: Object
    }
};
</script>
