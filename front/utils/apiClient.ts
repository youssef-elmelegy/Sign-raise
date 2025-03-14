import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
apiClient.interceptors.response.use(
    (response) => {
        const { data } = response;
        if (data.error) {
            throw new Error(data.error);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response.status === 401 && !originalRequest._retry) {
            // if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = sessionStorage.getItem("refreshToken");
                if (refreshToken) {
                    const response = await apiClient.post("/auth/refresh-token", {
                        refreshToken: refreshToken,
                    });

                    if (response.data.accessToken) {
                        sessionStorage.setItem("accessToken", response.data.accessToken);
                        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                sessionStorage.clear();
                window.location.href = "/join_us";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
