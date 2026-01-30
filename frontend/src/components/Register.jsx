import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "@/assets/Auth.css";
import OtpInput from "./OtpInput";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await api.post("/send-otp", { email: email });
            setOtpSent(true);
        } catch (err) {
            alert(err.response?.data?.error || "Gửi OTP thất bại");
        }
    };

    const handleRegister = async (otp) => {
        // setLoading(true);

        const data = {
            username: name,
            fullName: fullName,
            email: email,
            phonenumber: phone,
            address: address,
            passwordhash: password,
            otpCode: otp
        };

        try {
            const res = await api.post("/register", data);
            alert(res.data.message);
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.error || "Đăng ký thất bại");
            console.log("Register error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ maxWidth: "900px" }}>
                {!otpSent ? (
                    <>
                        <div className="text-center mb-4">
                            <h3 className="auth-title">Đăng ký tài khoản</h3>
                            <p className="auth-subtitle">
                                Tạo tài khoản để bắt đầu mua bán
                            </p>
                        </div>
                        <form onSubmit={handleSendOtp}>
                            <div className="mb-3">
                                <label className="form-label">Tên tài khoản</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Dòng link bên phải */}
                            <div className="d-flex justify-content-end mb-3">
                                <Link to="/login" className="auth-link">
                                    Đã có tài khoản?
                                </Link>
                            </div>

                            {/* Nút đăng ký ở giữa */}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="submit"
                                    className="register-btn w-50"
                                    style={{ border: "none" }}
                                    disabled={loading}
                                >
                                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                                </button>
                            </div>
                        </form >
                    </>
                ) : (
                    <OtpInput length={6} onComplete={(otp) => handleRegister(otp)}></OtpInput>
                )
                }

            </div >
        </div >
    );
}

export default Register;