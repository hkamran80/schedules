import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue";
import Schedule from "../views/Schedule.vue";
import ReleaseNotes from "../views/ReleaseNotes.vue";
import HelpCenter from "../views/HelpCenter.vue";
import HelpCenterTopic from "../views/HelpCenterTopic.vue";

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
        path: "/changelog",
        name: "ReleaseNotes",
        component: ReleaseNotes,
    },
    {
        path: "/help",
        name: "HelpCenter",
        component: HelpCenter,
    },
    {
        path: "/help/:id",
        name: "HelpCenterTopic",
        component: HelpCenterTopic,
    },
    // TODO: Add 404 page (use `Head` component from `@vueuse/head`)
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
