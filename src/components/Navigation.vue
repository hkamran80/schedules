<template>
    <div class="navigation">
        <h1>
            Schedules
        </h1>
        <div id="nav_links">
            <router-link to="/">Home</router-link> |
            <span>
                <router-link to="/schedule/ca-auhsd-hss">
                    Acalanes High School
                </router-link>
                |
            </span>
            <span>
                <router-link to="/schedule/ca-auhsd-dls">
                    AUHSD Distance Learning Schedule
                </router-link>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Navigation",
    props: {
        schedules: Object
    }
};
</script>

<style scoped>
.navigation {
    padding: 30px 0;
}

.navigation a {
    font-weight: bold;
    color: #2c3e50;
}

.navigation a.router-link-exact-active {
    color: #42b983;
}
</style>
