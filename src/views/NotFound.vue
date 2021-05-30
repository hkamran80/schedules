<template>
    <utds-center-layout>
        <utds-header title="Page Not Found" :subtitle="$route.query.path" />

        <article>
            <p>
                The page you were trying to access does not exist. Click
                <router-link to="/" title="Home" aria-label="Home"
                    >here</router-link
                >
                to go to the homepage.
            </p>
        </article>
    </utds-center-layout>
</template>

<script>
import { UtdsCenterLayout, UtdsHeader } from "utds-component-library";

export default {
    name: "NotFound",
    components: { UtdsCenterLayout, UtdsHeader }
};
</script>
