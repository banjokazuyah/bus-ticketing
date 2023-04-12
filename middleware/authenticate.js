export default function({ store, redirect }) {
    // Check if the user is authenticated
    if (!store.getters.getAuthToken) {
        // Redirect to the login page
        redirect("/login");
    }
}