import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import { useAuthStore } from "@/store/auth";
import "@/assets/Auth.css";
import { Toast } from "../utils/toast";

export function Login() {
    const { login } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const HandleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", {
                Email: email,
                PasswordHash: password
            });

            Toast.fire({
                icon: 'success',
                title: 'Đăng nhập thành công'
            });
            login(res.data.userDto, res.data.token);
            navigate("/");
        } catch (err) {
            if (err.response?.status === 400) {
                Toast.fire({
                    icon: 'error',
                    title: err.response?.data?.error || "Đăng nhập thất bại"
                });
            }
            console.log("Lỗi login:", err);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h3 className="auth-title">Đăng nhập</h3>
                <p className="auth-subtitle">
                    Chào mừng bạn quay lại Chợ Rẻ
                </p>

                <form onSubmit={HandleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="mb-3 d-flex justify-content-between">
                        <Link to="/register" className="auth-link">
                            Chưa có tài khoản?
                        </Link>
                        <Link to="/forgot-password" className="auth-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="login-btn w-100" style={{ border: "none" }}>
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
