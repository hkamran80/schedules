import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/schedule/new",
        name: "NewSchedule",
        component: () =>
            import(
                /* webpackChunkName: "newschedule" */ "@/views/NewSchedule.vue"
            )
    },
    {
        path: "/schedule/:id",
        name: "Schedule",
        component: () =>
            import(/* webpackChunkName: "schedule" */ "@/views/Schedule.vue")
    },
    {
        path: "/notfound",
        name: "NotFound",
        component: () =>
            import(/* webpackChunkName: "notfound" */ "@/views/NotFound.vue")
    },
    {
        path: "*",
        redirect: from => ({
            name: "NotFound",
            query: { path: window.location.origin + from.path }
        })
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
