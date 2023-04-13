<template>
    <div class="mt-3">
        <h3>{{ totalRows }} {{ totalRows > 1 ? "records" : "record" }}</h3>
        <b-table ref="ticket" :items="ticketList" :fields="fields" :busy="isLoading" class="mt-4 small-font" striped hover
            outlined :per-page="perPage" :current-page="currentPage" sort-icon-left>

            <template #cell(route)="route">
                <p>{{ route.item.pickup }} - {{ route.item.destination }}</p>
            </template>
            <template #cell(cust_email)="custemail">
                <p><strong>{{ custemail.value }}</strong></p>
            </template>
            <template #cell(cust_name)="cust_name">
                <p>{{ cust_name.value }}</p>
            </template>
            <template #cell(total_amount)="price">
                <p>{{ price.value | format_amount }}</p>
            </template>
            <template #cell(date)="date">
                <p>{{ $moment(date.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
            </template>
            <template #cell(stars)="review">
                <b-form-rating id="rating-inline" v-model="review.value" variant="warning" inline readonly />
            </template>
            <template #cell(status)="active">
                <p>{{ active.value ? "Paid" : "Pending" }}</p>
            </template>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="info" @click="handleSelectedTicket(row.item)">
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
        <b-pagination v-if="totalRows > perPage" v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
            first-text="First" prev-text="Prev" next-text="Next" last-text="Last" size="lg" align="center" />

        <b-modal v-model="showUpdateTicketModal" hide-footer title="Update Ticket">
            <b-form @submit.prevent="handleUpdateTicket(selectedTicket)">
                <b-form-group label="Route:" label-cols="4" label-cols-lg="3" label-for="route">
                    <b-form-input id="route" :value="`${selectedTicket.pickup} to ${selectedTicket.destination}`"
                        disabled />
                </b-form-group>
                <b-form-group label="Name:" label-cols="4" label-cols-lg="3" label-for="name">
                    <b-form-input id="name" :value="selectedTicket.custName" disabled />
                </b-form-group>
                <b-form-group label="Email:" label-cols="4" label-cols-lg="3" label-for="email">
                    <b-form-input id="email" :value="selectedTicket.custEmail" disabled />
                </b-form-group>
                <b-form-group label="Seats:" label-cols="4" label-cols-lg="3" label-for="seats">
                    <b-form-input id="seats" :value="selectedTicket.seats" disabled />
                </b-form-group>
                <b-form-group label="Total Amount:" label-cols="4" label-cols-lg="3" label-for="amount">
                    <h3>{{ selectedTicket.total_amount | format_amount }}</h3>
                </b-form-group>
                <b-form-group label="Status:" label-cols="4" label-cols-lg="3" label-for="status">
                    <b-form-select id="status" v-model="selectedTicket.active">
                        <b-form-select-option value="true">
                            Confirm
                        </b-form-select-option>
                        <b-form-select-option value="false">
                            Pending
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <div class="mt-5 d-flex justify-content-end">
                    <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary" disabled>
                        <span class="mr-2">Saving...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Update Ticket
                    </b-button>
                    <b-button type="button" @click="showUpdateTicketModal = !showUpdateTicketModal">
                        Cancel
                    </b-button>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            ticketList: [],
            fields: [
                { key: "ticket_id", label: "Ticket ID", sortable: true },
                { key: "cust_name", label: "Name", sortable: true },
                { key: "cust_email", label: "Email", sortable: true },
                { key: "route", label: "Route", sortable: true },
                { key: "seats", label: "Seats", sortable: true },
                { key: "date", label: "Date Booked", sortable: true },
                { key: "total_amount", label: "Total Amount", sortable: true },
                { key: "stars", label: "Review" },
                { key: "status", label: "Status", sortable: true },
                "Actions",
            ],
            newTicket: {
                pickup: "",
                destination: null,
                distance: null,
                time: null,
                price: null,
                custEmail: null,
            },
            selectedTicket: {
                ticketId: null,
                custEmail: null,
                status: null,
                custName: null,
            },
            addModalVisible: false,
            showUpdateTicketModal: false,
            isLoading: false,
            perPage: 8,
            currentPage: 1,
            sortBy: null,
            sortDesc: false,
        };
    },

    fetch() {
        this.handelFetchTicketList();
    },

    fetchOnServer: false,

    computed: {
        totalRows() {
            return this.ticketList?.length;
        },
    },

    methods: {

        handelFetchTicketList() {
            this.isLoading = true;
            return this.$store.dispatch("fetchTicketList").then((response) => {
                this.isLoading = false;
                this.ticketList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleSelectedTicket(data) {
            this.selectedTicket.pickup = data.pickup;
            this.selectedTicket.destination = data.destination;
            this.selectedTicket.custEmail = data.cust_email;
            this.selectedTicket.seats = data.seats;
            this.selectedTicket.total_amount = data.total_amount;
            this.selectedTicket.active = data.status;
            this.selectedTicket.id = data.ticket_id;
            this.selectedTicket.custName = data.cust_name;
            this.showUpdateTicketModal = true;
        },

        handleUpdateTicket(data) {
            const id = data.id;
            const payload = {
                status: this.selectedTicket.active,
            };
            this.isLoading = true;
            return this.$store.dispatch("updateTicket", { id, payload }).then((response) => {
                this.$bvToast.toast("Updated Successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showUpdateTicketModal = false;
                this.isLoading = false;
                this.handelFetchTicketList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },
    },
};
</script>

<style>
.small-font td,
.small-font th {
    font-size: 14px;
    /* set the font size to 12px */
}
</style>