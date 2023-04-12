<template>
    <b-container fluid="lg">
        <b-jumbotron header-level="5" class="my-5" header="Contact Us" lead="Please feel free to contact us using the email address below:">
            <p><strong>Email:</strong> <a href="mailto:test@gmail.com">test@gmail.com</a></p>
        </b-jumbotron>
    </b-container>
</template>

<script>
export default {
    layout: "admin",

    head() {
        return {
            title: "Contact Us -  NMBBS",
        };
    },
};
</script>

<style lang="scss" scoped>

</style>