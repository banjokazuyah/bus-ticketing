
export const state = () => ({
    userInfo: {},
    authToken: null,
    locationList: null,
    loginInfo: {},
    adminProfile: {},
    isAuthenticated: false,
});

export const getters = ({
    getUserInfo: state => state.userInfo,

    getAuthToken: state => state.authToken,

    getLocationList: state => state.locationList,

    getLoginInfo: state => state.loginInfo,

    getIsAuthenticated: state => state.isAuthenticated,

});

export const mutations = ({
    setUserInfo(state, value) {
        state.userInfo = value;
    },

    setAuthToken(state, value) {
        state.authToken = value;
    },

    setLocationList(state, value) {
        state.locationList = value;
    },

    setAdminProfile(state, value) {
        state.adminProfile = value;
    },

    setIsAuthenticated(state, value) {
        state.isAuthenticated = value;
    },

    setAuthCookies(state, value) {
        this.$cookies.set("nmbbs", value, { secure: true, sameSite: "none" });
    },
});

export const actions = ({
    // Admin actions
    loginAdminUser({ commit }, payload) {
        return this.$axios.post("/api/admin/login", payload).then(async(response) => {
            await commit("setAuthToken", response.data.token);
            commit("setAuthCookies", JSON.stringify(response.data.token));
        });
    },

    logoutAdminUser({ commit }) {
        return this.$axios.post("/api/admin/logoutAll").then((response) => {
            this.$cookies.removeAll();
            commit("setIsAuthenticated", false);
            commit("setAuthToken", null);
            return response.data;
        });
    },

    getAdminUserProfile({ commit }) {
        return this.$axios.get("/api/admin/me").then((response) => {
            commit("setIsAuthenticated", true);
            return response.data;
        });
    },

    // Location actions
    createNewLocation(_, payload) {
        return this.$axios.post("/api/admin/locations", payload).then((response) => {
            return response.data;
        });
    },

    updateLocation(_, { id, payload }) {
        return this.$axios.patch(`/api/admin/locations/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    getLocationList({ commit }) {
        return this.$axios.get("/api/admin/locations").then((response) => {
            commit("setLocationList", response.data.data);
            return response.data;
        });
    },

    deleteLocation(_, id) {
        return this.$axios.delete(`/api/admin/locations/${id}`).then((response) => {
            return response.data;
        });
    },

    // Trip Actions
    createRoute(_, payload) {
        return this.$axios.post("/api/admin/trips/create", payload).then((response) => {
            return response.data;
        });
    },

    updateRoute(_, { id, payload }) {
        return this.$axios.patch(`/api/admin/trips/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    fetchSingleRoute(_, payload) {
        return this.$axios.post("/api/admin/trips/getTrip", payload).then((response) => {
            return response.data;
        });
    },

    fetchRouteList() {
        return this.$axios.get("/api/admin/trips/getAllTrips").then((response) => {
            return response.data;
        });
    },

    // Ticket actions

    createTicket(_, payload) {
        return this.$axios.post("/api/admin/tickets/create", payload).then((response) => {
            return response.data;
        });
    },

    updateTicket(_, { id, payload }) {
        return this.$axios.patch(`/api/admin/tickets/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    fetchTicketList() {
        return this.$axios.get("/api/admin/tickets/getAlltickets").then((response) => {
            return response.data;
        });
    },

    nuxtServerInit({ commit, dispatch }, { req, redirect, route }) {
        const path = route.path;

        // Path init functions
        const adminServerInit = async() => {
            const authTokenCookie = this.$cookies.get("nmbbs");
            if (!authTokenCookie) {
                return;
            }

            await commit("setAuthToken", authTokenCookie);
            await dispatch("getAdminUserProfile").catch(() => {
                redirect("/login");
            });
        };

        // Map the server init function to the appropriate path.
        const initMap = {
            "/admin": adminServerInit,
        };

        // Match the current path we're on to the path specified in the path map.
        // If a match is found, run it.
        // If no match is found, just check if there are auth cookies and set it.
        const paths = Object.keys(initMap);
        const matchedPath = paths.find(p => path.startsWith(p));
        const serverInit = initMap[matchedPath];
        if (serverInit) {
            return serverInit();
        }
    },

});