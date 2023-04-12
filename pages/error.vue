<template>
    <b-alert variant="danger" show dismissible @dismissed="goHome">
        An error occurred
        <template #dismiss-title>
            <b-button size="sm" variant="outline-secondary">
                Go Home
            </b-button>
        </template>
    </b-alert>
</template>

<script>
export default {
    methods: {
        goHome() {
            this.$router.push("/");
        },
    },

    head() {
        return {
            title: "Error -  NMBBS",
        };
    },

};
</script>

<style lang="scss" scoped>

</style>