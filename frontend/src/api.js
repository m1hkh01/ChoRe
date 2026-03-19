import axios from "axios";
import { useAuthStore } from "./store/auth";

export const API_BASE_URL = "https://api.chore123.cloud";
// export const API_BASE_URL = "http://localhost:5121";

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

  if (!config.headers) {
    config.headers = {};
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

// Response interceptor: Handle 401 + automatic refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalConfig = error.config;

    if (originalConfig.url.includes("/account/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await api.post("/account/refresh-token");
          const newToken = res.data.token;

          useAuthStore.getState().setToken(newToken);

          isRefreshing = false;
          onRefreshed(newToken);

        } catch (err) {
          isRefreshing = false;

          const auth = useAuthStore.getState();
          auth.logout();

          if (navigateHandler) {
            navigateHandler("/login");
          } else {
            window.location.href = "/login";
          }

          return Promise.reject(err);
        }
      }

      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          resolve(
            api({
              ...originalConfig,
              headers: {
                ...originalConfig.headers,
                Authorization: `Bearer ${token}`
              }
            })
          );
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
