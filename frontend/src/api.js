import axios from "axios";
import { useAuthStore } from "./store/auth";
import { useNavigate } from "react-router-dom";

export const API_BASE_URL = "http://localhost:5121";

const api = axios.create({
    baseURL: API_BASE_URL 
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
            const navigate = useNavigate();
            const auth = useAuthStore();
            auth.logout();
            navigate("/login");
        }
        // if (error.response?.status === 429) {
        //     AlertError("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.");
        // }
        return Promise.reject(error)
    }
)

export default api;