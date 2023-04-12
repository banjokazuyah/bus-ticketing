
export default function({ $axios, redirect, store }) {
    $axios.setBaseURL(process.env.BASE_URL);
    $axios.onRequest((config) => {
        const token = store.getters.getAuthToken;
        $axios.setHeader("Cache-Control", "no-cache");
        if (token) {
            $axios.setHeader("bta-auth", token);
        }
    });

    $axios.onError((error) => {
        const code = parseInt(error.response && error.response.status);
        if (code === 401) {
            redirect("/login");
        }
    });
}