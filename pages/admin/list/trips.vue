<template>
    <div class="mt-3">
        <b-button variant="primary" @click="showAddRouteModal = !showAddRouteModal">
            Add Route
        </b-button>
        <b-table
            ref="trips"
            :items="routeList"
            :fields="fields"
            :busy="isLoading"
            class="mt-4 small-font"
            striped
            hover
            outlined
            sort-icon-left
        >
            <template #cell(distance)="distance">
                <!-- `distance.value` is the value after formatted by the Formatter -->
                <p>{{ distance.value | format_number }}</p>
            </template>
            <template #cell(time)="time">
                <!-- `distance.value` is the value after formatted by the Formatter -->
                <p>{{ time.value | format_number }}</p>
            </template>
            <template #cell(price)="price">
                <!-- `distance.value` is the value after formatted by the Formatter -->
                <p>{{ price.value | format_amount }}</p>
            </template>
            <template #cell(active)="active">
                <!-- `distance.value` is the value after formatted by the Formatter -->
                <p>{{ active.value ? "Active" : "Inactive" }}</p>
            </template>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="primary" @click="handleSelectedRoute(row.item)">
                        <b-icon icon="pencil"></b-icon>
                    </b-button>
                </div>
            </template>
            <template #table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>

        <b-modal v-model="showAddRouteModal" hide-footer title="Add Route">
            <b-form @submit.prevent="handleCreateRoute()">
                <b-form-group label="Pickup" label-for="pickup">
                    <b-form-select id="pickup" v-model="newRoute.pickup" :options="computedPickupLocations" required>
                        <template #first>
                            <b-form-select-option value="" disabled>
                                -- Please select a pickup location
                                --
                            </b-form-select-option>
                        </template>
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                    <b-form-select
                        id="destination"
                        v-model="newRoute.destination"
                        :options="computedDestinationLocations"
                        :disabled="!newRoute.pickup"
                        required
                    >
                        <template #first>
                            <b-form-select-option value="" disabled>
                                -- Please select your destination
                                --
                            </b-form-select-option>
                        </template>
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Distance" label-for="distance">
                    <b-form-input
                        id="distance"
                        v-model="newRoute.distance"
                        type="number"
                        min="0"
                        required
                        placeholder="Kindly input distance in miles"
                    />
                </b-form-group>
                <b-form-group label="Time" label-for="time">
                    <b-form-input
                        id="time"
                        v-model="newRoute.time"
                        type="number"
                        required
                        placeholder="Please enter time in minutes"
                    />
                </b-form-group>
                <b-form-group label="Price" label-for="price">
                    <b-form-input id="price" v-model="newRoute.price" type="number" min="0" required />
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Creating Route...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Add Route
                </b-button>
                <b-button type="button" @click="showAddRouteModal = !showAddRouteModal">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="showUpdateRouteModal" hide-footer title="Edit Route">
            <b-form @submit.prevent="updateLocation(selectedRoute)">
                <b-form-group label="Pickup" label-for="pickup">
                    <b-form-select id="pickup" v-model="selectedRoute.pickup" :options="computedPickupLocations" disabled />
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                    <b-form-select
                        id="destination"
                        v-model="selectedRoute.destination"
                        :options="computedDestinationLocations"
                        disabled
                    />
                </b-form-group>
                <b-form-group label="Distance" label-for="distance">
                    <b-form-input
                        id="distance"
                        v-model="selectedRoute.distance"
                        type="number"
                        min="0"
                        required
                        placeholder="Kindly input distance in miles"
                    />
                </b-form-group>
                <b-form-group label="Time" label-for="time">
                    <b-form-input
                        id="time"
                        v-model="selectedRoute.time"
                        type="number"
                        required
                        placeholder="Please enter time in minutes"
                    />
                </b-form-group>
                <b-form-group label="Price" label-for="price">
                    <b-form-input id="price" v-model="selectedRoute.price" type="number" min="0" required />
                </b-form-group>
                <b-form-group label="Status" label-for="status">
                    <b-form-select id="status" v-model="selectedRoute.active">
                        <b-form-select-option value="true">
                            Active
                        </b-form-select-option>
                        <b-form-select-option value="false">
                            Inactive
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Save Route
                </b-button>
                <b-button type="button" @click="showUpdateRouteModal = !showUpdateRouteModal">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            routeList: [],
            locationList: [],
            fields: [
                { key: "pickup", label: "Pickup", sortable: true },
                { key: "destination", label: "Destination", sortable: true },
                { key: "distance", label: "Distance", sortable: true },
                { key: "time", label: "Trip Duration (mins)", sortable: true },
                { key: "price", label: "Price (Naira)", sortable: true },
                { key: "active", label: "Status", sortable: true },
                "Actions",
            ],
            newRoute: {
                pickup: null,
                destination: null,
                distance: null,
                time: null,
                price: null,
            },
            selectedRoute: {
                pickup: null,
                destination: null,
                distance: null,
                time: null,
                price: null,
                active: null,
            },
            showAddRouteModal: false,
            showUpdateRouteModal: false,
            isLoading: false,
        };
    },

    fetch() {
        this.handleFetchRouteList();
        return this.handleGetLocationList();
    },

    fetchOnServer: false,

    computed: {
        computedPickupLocations() {
            return this.locationList.map((data) => {
                return {
                    value: data.location, text: data.location,
                };
            });
        },

        computedDestinationLocations() {
            return this.locationList.map((data) => {
                return {
                    value: data.location, text: data.location, disabled: this.newRoute.pickup === data.location,
                };
            });
        },
    },

    methods: {
        handleFetchRouteList() {
            this.isLoading = true;
            return this.$store.dispatch("fetchRouteList").then((response) => {
                this.isLoading = false;
                this.routeList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleCreateRoute() {
            const payload = {
                pickup: this.newRoute.pickup,
                destination: this.newRoute.destination,
                distance: this.newRoute.distance,
                time: this.newRoute.time,
                price: this.newRoute.price,
            };
            this.isLoading = true;
            return this.$store.dispatch("createRoute", payload).then(() => {
                this.$bvToast.toast("Route added successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showAddRouteModal = false;
                this.isLoading = false;
                this.resetTripValues();
                this.handleFetchRouteList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        handleSelectedRoute(data) {
            this.selectedRoute.pickup = data.pickup;
            this.selectedRoute.destination = data.destination;
            this.selectedRoute.distance = data.distance;
            this.selectedRoute.time = data.time;
            this.selectedRoute.price = data.price;
            this.selectedRoute.active = data.active;
            this.selectedRoute.id = data._id;
            this.showUpdateRouteModal = true;
        },

        updateLocation(data) {
            const id = data.id;
            const payload = {
                distance: this.selectedRoute.distance,
                time: this.selectedRoute.time,
                price: this.selectedRoute.price,
                active: this.selectedRoute.active,
            };
            this.isLoading = true;
            return this.$store.dispatch("updateRoute", { id, payload }).then((response) => {
                this.$bvToast.toast("Route updated successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showUpdateRouteModal = false;
                this.isLoading = false;
                this.handleFetchRouteList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        deleteLocation(data) {
            this.$bvModal.msgBoxConfirm(`Please confirm that you want to delete ${data.location}.`, {
                title: "Delete Location",
                size: "md",
                buttonSize: "md",
                okVariant: "danger",
                okTitle: "YES",
                cancelTitle: "NO",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
            }).then((value) => {
                if (value) {
                    this.$store.dispatch("deleteLocation", data.id).then(() => {
                        this.$bvToast.toast("Location deleted successfully", {
                            title: "Success",
                            variant: "success",
                            delay: 300,
                        });
                        this.handleFetchRouteList();
                    });
                }
            }).catch((err) => {
                this.$bvToast.toast(err?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

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

        resetTripValues() {
            this.newRoute = {
                pickup: null,
                destination: null,
                distance: null,
                time: null,
                price: null,
            };
        },
    },
};
</script>

<style lang="scss" scoped></style>