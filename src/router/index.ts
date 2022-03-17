import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue";
import Schedule from "../views/Schedule.vue";

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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
