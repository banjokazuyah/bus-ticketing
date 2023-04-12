<template>
    <b-container fluid>
        <b-row align-v="center">
            <b-col md="5" sm="12" xs="12">
                <h2>The modern way to commute across cities</h2>
                <br>
                <p>NMBBS is a Nigerian technology powered company, providing seamless mobility services to commuters across Africa</p>
            </b-col>
            <b-col md="7" sm="12" xs="12">
                <div class="search-container mt-4">
                    <BusTicketing :locations="locationList" />
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            locationList: this.$store.getters.getLocationList || [],

        };
    },

    head() {
        return {
            title: "Home -  NMBBS",
        };
    },

    created() {
        this.handleGetLocationList();
    },

    methods: {
        handleGetLocationList() {
            this.$store.dispatch("getLocationList").then((response) => {
                this.locationList = response.data;
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },
    },
};
</script>

<style scoped>

.search-container {
    padding: 20px;
    box-shadow: 4px 6px 32px -2px rgba(0, 0, 0, 0.78);
    -webkit-box-shadow: 4px 6px 32px -2px rgba(0, 0, 0, 0.78);
    -moz-box-shadow: 4px 6px 32px -2px rgba(0, 0, 0, 0.78);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 20px;
}
</style>