import axios from "axios";
import { useAuthStore } from "./store/auth";

export const API_BASE_URL = "http://localhost:5121";

let navigateHandler = null;

export const setNavigate = (navigate) => {
  navigateHandler = navigate;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable sending/receiving cookies
});

// Request interceptor: Add AccessToken from store to Authorization header
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: Handle 401 + automatic refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalConfig = error.config;

    // If 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // Call refresh endpoint - it will use the refreshToken HttpOnly cookie automatically
        const res = await api.post("/account/refresh-token");
        const { token: newToken } = res.data;

        // Update token in store (in memory)
        useAuthStore.getState().setToken(newToken);

        // Retry original request with new token
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        return api(originalConfig);
      } catch (refreshErr) {
        console.log("Token refresh failed:", refreshErr);

        // If refresh fails, log out
        const auth = useAuthStore.getState();
        auth.logout();

        if (navigateHandler) {
        navigateHandler("/login");
        } else {
         window.location.href = "/login";
       }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
