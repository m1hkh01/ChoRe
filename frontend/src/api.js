import axios from "axios";
import { useAuthStore } from "./store/auth";

export const API_BASE_URL = "https://api.chore123.cloud";
// export const API_BASE_URL = "http://localhost:5121";

let navigateHandler = null;
export const setNavigate = (navigate) => {
  navigateHandler = navigate;
};
// API chính
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// API riêng cho refresh (QUAN TRỌNG)
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ───────── REQUEST ─────────
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

// ───────── REFRESH CONTROL ─────────
let isRefreshing = false;
let failedQueue = [];   // thay vì subscribers = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
// ───────── RESPONSE INTERCEPTOR ─────────
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/account/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const res = await refreshApi.post("/account/refresh-token");
        const newToken = res.data.token;

        useAuthStore.getState().setToken(newToken);
        processQueue(null, newToken);   // thành công → resolve tất cả queue
        return api(originalRequest);    // retry request hiện tại
      } catch (err) {
        processQueue(err, null);        // thất bại → reject tất cả queue
        useAuthStore.getState().logout();
        if (navigateHandler) navigateHandler("/login");
        else window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Đang refresh → cho vào queue
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
);
export default api;