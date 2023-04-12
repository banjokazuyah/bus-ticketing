<template>
    <b-navbar toggleable="lg" :type="navLinkColor">
        <b-navbar-brand to="/">
            NMBBS
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item to="/" exact exact-active-class="active">
                    Home
                </b-nav-item>
                <b-nav-item to="/admin" active-class="active">
                    Admin
                </b-nav-item>
                <b-nav-item to="/contact" active-class="active">
                    Contact Us
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
        <b-button v-if="isAuthenticated" @click="handleAdminLogout()">
            Logout
        </b-button>
    </b-navbar>
</template>

<script>
export default {

    computed: {
        isAuthenticated() {
            return this.$store.getters.getIsAuthenticated;
        },

        navLinkColor() {
            return this.$route.path.startsWith("/admin") || this.$route.path.startsWith("/contact") ? "light" : "dark";
        },
    },
    methods: {
        handleAdminLogout() {
            return this.$store.dispatch("logoutAdminUser").then(() => {
                return this.$router.push("/login");
            }).catch(() => {
                return this.$router.push("/login");
            });
        },
    },
};
</script>

<style lang="scss" scoped>

</style>