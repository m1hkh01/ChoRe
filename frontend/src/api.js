import axios from "axios";
import { useAuthStore } from "./store/auth";

export const API_BASE_URL = "http://localhost:5121";

let navigateHandler = null;

export const setNavigate = (navigate) => {
  navigateHandler = navigate;
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore.getState();
      auth.logout();

      if (navigateHandler) {
        navigateHandler("/login"); // ✅
      } else {
        window.location.href = "/login"; // fallback
      }
    }

    return Promise.reject(error);
  }
);

export default api;
