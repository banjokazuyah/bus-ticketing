<template>
    <b-container fluid class="mt-3" w-75>
        <h2><b-icon icon="gear-fill" aria-hidden="true" /> Admin Dashboard</h2>
        <b-nav tabs justified>
            <b-nav-item to="/admin/list/location" exact exact-active-class="active">
                Locations
            </b-nav-item>
            <b-nav-item to="/admin/list/trips" exact exact-active-class="active">
                Trips
            </b-nav-item>
            <b-nav-item to="/admin/list/tickets" exact exact-active-class="active">
                Tickets
            </b-nav-item>
        </b-nav>
        <NuxtChild />
    </b-container>
</template>

<script>
export default {
    layout: "admin",
    asyncData({ redirect, store }) {
        // Check if the user is authenticated
        if (!store.getters.getAuthToken) {
            // Redirect to the login page
            redirect("/login");
        }
    },
};
</script>

<style lang="scss" scoped></style>