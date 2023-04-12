export const handleGetLocationList = () => {
    this.$store.dispatch("getLocationList").then((response) => {
        return response.data;
    }).catch((error) => {
        this.$bvToast.toast(error?.response?.data, {
            title: "Error",
            variant: "danger",
            delay: 300,
        });
    });
};