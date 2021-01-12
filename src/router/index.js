import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Schedule from "../views/Schedule.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/schedule/:id",
        name: "Schedule",
        component: Schedule
    },
    {
        path: "/notfound",
        name: "NotFound",
        component: () =>
            import(/* webpackChuckName: "notfound" */ "../views/NotFound.vue")
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
