<template>
    <center-layout>
        <header class="pb-4">
            <h2>Welcome! Select a schedule to begin!</h2>
        </header>

        <v-card
            v-for="(schedule, id) in schedules"
            :key="id"
            :color="schedule.color"
            :to="`/schedule/${id}`"
            :title="schedule.name"
            :aria-label="schedule.name"
            class="mx-auto schedule-card"
            dark
            outlined
        >
            <v-card-title>
                <v-icon medium left v-text="schedule.icon" />
                <span class="title font-weight-light" v-text="schedule.name" />
            </v-card-title>
        </v-card>
    </center-layout>
</template>

<script>
import CenterLayout from "../components/CenterLayout.vue";
export default {
    name: "Home",
    props: {
        schedules: Object
    },
    components: { CenterLayout }
};
</script>

<style scoped>
.v-card.schedule-card {
    padding: 0 5px;
    margin: 10px 0;
    text-align: center;
    word-break: break-word;
    word-wrap: break-word;
}
.v-card.schedule-card i.v-icon {
    margin-right: 15px;
}
</style>
