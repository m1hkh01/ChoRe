import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "@/assets/Auth.css";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            username: name,
            fullName: fullName,
            email: email,
            phonenumber: phone,
            address: address,
            passwordhash: password
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
                <div className="text-center mb-4">
                    <h3 className="auth-title">Đăng ký tài khoản</h3>
                    <p className="auth-subtitle">
                        Tạo tài khoản để bắt đầu mua bán
                    </p>
                </div>

                <form onSubmit={handleRegister}>
                    {/* Thông tin tài khoản */}
                    <div className="mb-4">
                        <h6 className="mb-3" style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                            THÔNG TIN TÀI KHOẢN
                        </h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Tên tài khoản</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="mb-4">
                        <h6 className="mb-3" style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>
                            THÔNG TIN CÁ NHÂN
                        </h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
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
                </form>
            </div>
        </div>
    );
}

export default Register;