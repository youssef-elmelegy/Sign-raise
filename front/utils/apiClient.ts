// utils/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
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
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // FIX: Check if error.response exists before accessing its properties
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await apiClient.post("/auth/refresh-token", {
            refreshToken,
          });

          if (response.data.accessToken) {
            sessionStorage.setItem("accessToken", response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        sessionStorage.clear();
        window.location.href = "/log_in";
        return Promise.reject(refreshError);
      }
    }

    // Create a more informative error message
    let errorMessage = "Network error or request failed";
    if (error.response) {
      // Server responded with an error status
      errorMessage =
        error.response.data?.error || `Error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response received from server";
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out";
      }
    } else {
      // Something else happened while setting up the request
      errorMessage = error.message;
    }

    error.displayMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
