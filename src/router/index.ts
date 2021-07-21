import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: () =>
            import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    },
    {
        path: "/schedule/countdown",
        name: "ScheduleCountdown",
        component: () =>
            import(
                /* webpackChunkName: "schedulecountdown" */ "@/views/ScheduleCountdown.vue"
            ),
    },
    {
        path: "/schedule/:id",
        name: "Schedule",
        component: () =>
            import(/* webpackChunkName: "schedule" */ "@/views/Schedule.vue"),
    },
    {
        path: "*",
        redirect: (from) => ({
            name: "Home",
            query: { notFound: from.path },
        }),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
