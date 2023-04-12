<template>
    <div>
        <b-row class="align-items-center mx-3 my-3" align-h="between">
            <b-col md="6" sm="12">
                <b-form autocomplete="false" @submit.prevent="handleFetchSingleRoute()" @input="resetValues">
                    <b-form-group label="Pickup:" label-for="pickup">
                        <b-form-select id="pickup" v-model="pickup" :options="computedPickupLocations">
                            <template #first>
                                <b-form-select-option value="" disabled>
                                    -- Please select a pickup location
                                    --
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Destination:" label-for="destination">
                        <b-form-select
                            id="destination"
                            v-model="destination"
                            :options="computedDestinationLocations"
                            :disabled="!pickup"
                        >
                            <template #first>
                                <b-form-select-option value="" disabled>
                                    -- Please select your destination
                                    --
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Seats:" label-for="seats">
                        <b-form-select v-model="ticketCount" :options="seatCount" />
                    </b-form-group>
                    <div v-if="isLoading">
                        <b-button
                            variant="primary"
                            class="d-flex align-items-center justify-content-center"
                            size="lg"
                            disabled
                        >
                            <span class="mr-2">Loading...</span>
                            <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                        </b-button>
                    </div>
                    <div v-else>
                        <b-button type="submit" variant="primary" size="lg" :disabled="searchDisabled">
                            Search
                        </b-button>
                    </div>
                </b-form>
            </b-col>
            <b-col v-if="routeDetails" md="6" sm="12">
                <b-card bg-variant="dark" class="mt-4">
                    <b-card-title>Trip Details</b-card-title>
                    <b-card-text>{{ pickup }} to {{ destination }}</b-card-text>
                    <b-card-text>Distance: {{ routeDetails.distance | format_number }} miles</b-card-text>
                    <b-card-text>Trip Time: {{ routeDetails.time | format_number }} minutes</b-card-text>
                    <b-card-text>Price: {{ routeDetails.price | format_amount }}</b-card-text>
                    <b-card-text>Seats: {{ ticketCount }}</b-card-text>
                    <b-card-text>Total Amount: <h3><b>{{ totalAmount | format_amount }}</b></h3></b-card-text>
                    <div class="text-center mt-4">
                        <b-button variant="primary" size="lg" @click="showBookTicketModal = !showBookTicketModal">
                            Book
                            Ticket
                        </b-button>
                    </div>
                </b-card>
            </b-col>
        </b-row>
        <b-modal v-model="showBookTicketModal" hide-footer title="Add Route">
            <b-form @submit.prevent="handleCreateTicket()">
                <b-form-group label="Pickup" label-for="pickup">
                    <b-form-select id="pickup" v-model="pickup" :options="computedPickupLocations" required disabled />
                </b-form-group>
                <b-form-group label="Destination" label-for="destination">
                    <b-form-select
                        id="destination"
                        v-model="destination"
                        :options="computedDestinationLocations"
                        required
                        disabled
                    />
                </b-form-group>
                <b-form-group label="First name" label-for="firstname">
                    <b-form-input
                        id="firstname"
                        v-model="ticketInfo.firstName"
                        required
                        placeholder="Kindly enter your first name"
                        pattern="[a-zA-ZÀ-ÿ- ]+"
                    />
                </b-form-group>
                <b-form-group label="Last name" label-for="lastname">
                    <b-form-input
                        id="lastname"
                        v-model="ticketInfo.lastName"
                        required
                        placeholder="Kindly enter your last name"
                        pattern="[a-zA-ZÀ-ÿ- ]+"
                    />
                </b-form-group>
                <b-form-group label="Customer Email" label-for="custemail">
                    <b-form-input
                        id="custemail"
                        v-model="ticketInfo.custEmail"
                        type="email"
                        required
                        placeholder="Kindly provide your email address"
                    />
                </b-form-group>
                <b-form-group>
                    <b-card-text>Total Amount: <h3><b>{{ totalAmount | format_amount }}</b></h3></b-card-text>
                </b-form-group>
                <b-form-group>
                    <b-form-rating id="rating-inline" v-model="ticketInfo.review" variant="warning" inline />
                </b-form-group>
                <b-form-group>
                    <b-button v-if="isLoading" type="submit" variant="primary" class="mr-3" disabled>
                        <span class="mr-2">Booking Ticket...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Book Ticket
                    </b-button>
                    <b-button type="button" @click="showBookTicketModal = !showBookTicketModal">
                        Cancel
                    </b-button>
                </b-form-group>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    props: {
        locations: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            pickup: "",
            destination: "",
            ticketCount: 1,
            routeDetails: null,
            ticketInfo: {
                custEmail: null,
                review: 0,
                firstName: null,
                lastName: null,
            },
            showBookTicketModal: false,
            isLoading: false,
        };
    },

    computed: {
        searchDisabled() {
            return this.pickup === "" || this.destination === "";
        },

        seatCount() {
            return Array.from({ length: 13 }, (_, index) => index + 1);
        },

        computedPickupLocations() {
            return this.locations.map((data) => {
                return {
                    value: data.location, text: data.location,
                };
            });
        },

        computedDestinationLocations() {
            return this.locations.map((data) => {
                return {
                    value: data.location, text: data.location, disabled: this.pickup === data.location,
                };
            });
        },

        totalAmount() {
            return this.routeDetails?.price * this.ticketCount;
        },

    },

    methods: {

        handleFetchSingleRoute() {
            const payload = {
                pickup: this.pickup,
                destination: this.destination,
            };
            this.isLoading = true;
            return this.$store.dispatch("fetchSingleRoute", payload).then((response) => {
                this.routeDetails = response.data;
                this.isLoading = false;
            }).catch((error) => {
                if (error?.response?.status === 404) {
                    this.$bvToast.toast("There are no available trips on this route, Try again later.", {
                        title: "Error",
                        variant: "danger",
                        delay: 300,
                    });
                } else {
                    this.$bvToast.toast(error?.response?.data?.message, {
                        title: "Error",
                        variant: "danger",
                        delay: 300,
                    });
                }

                this.isLoading = false;
            });
        },

        handleCreateTicket() {
            const payload = {
                cust_email: this.ticketInfo.custEmail,
                pickup: this.pickup,
                destination: this.destination,
                total_amount: this.totalAmount,
                seats: this.ticketCount,
                stars: this.ticketInfo.review,
                cust_name: `${this.ticketInfo.firstName.trim()} ${this.ticketInfo.lastName.trim()}`
            };
            this.isLoading = true;
            this.$store.dispatch("createTicket", payload).then((response) => {
                this.$bvToast.toast("Ticket created successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showBookTicketModal = false;
                this.isLoading = false;
                this.resetValues();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        resetValues() {
            this.routeDetails = null;
            this.ticketInfo.custEmail = null;
            this.ticketInfo.review = 0;
        },
    },
};
</script>

<style scoped></style>