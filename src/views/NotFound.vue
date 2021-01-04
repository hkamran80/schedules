<template>
    <center-layout>
        <header class="pb-4">
            <h2 class="pb-1">Page Not Found</h2>
            <h3 class="text-wrap--break" v-text="$route.query.path" />
        </header>
        <article>
            <p>
                The page you were trying to access does not exist. Click
                <router-link to="/" title="Home" aria-label="Home"
                    >here</router-link
                >
                to go to the homepage.
            </p>
        </article>
    </center-layout>
</template>

<script>
import CenterLayout from "@/components/CenterLayout";

export default {
    name: "NotFound",
    components: { CenterLayout }
};
</script>
