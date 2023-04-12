<script>
export default {
    asyncData({ redirect }) {
        redirect("/admin/list/location");
    },

    head() {
        return {
            title: "Admin Dashboard -  NMBBS",
        };
    },
};
</script>