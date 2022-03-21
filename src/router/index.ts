import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue";
import Schedule from "../views/Schedule.vue";
import HelpCenter from "../views/HelpCenter.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/schedule/:id",
        name: "Schedule",
        component: Schedule,
    },
    {
        path: "/help",
        name: "HelpCenter",
        component: HelpCenter,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
