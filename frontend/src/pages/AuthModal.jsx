import { useState } from "react";
import "@/assets/AuthModal.css";

function AuthModal({ isOpen, onClose, initialTab = "login" }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({ userName: "", email: "", password: "", confirmPassword: "" });

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // TODO: Thêm logic đăng nhập
        console.log("Login:", loginData);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // TODO: Thêm logic đăng ký
        console.log("Register:", registerData);
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-close" onClick={onClose}>
                    ×
                </div>

                <div className="auth-modal-tabs">
                    <button
                        className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
                        onClick={() => setActiveTab("register")}
                    >
                        Đăng ký
                    </button>
                </div>

                {activeTab === "login" ? (
                    <form onSubmit={handleLoginSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email/Số điện thoại</label>
                            <input
                                type="text"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                placeholder="Nhập email hoặc số điện thoại"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn">
                            Đăng nhập
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Tên tài khoản</label>
                            <input
                                type="text"
                                name="userName"
                                value={registerData.userName}
                                onChange={handleRegisterChange}
                                placeholder="Nhập tên tài khoản"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                placeholder="Nhập email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                                placeholder="Xác nhận mật khẩu"
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn">
                            Đăng ký
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AuthModal;
