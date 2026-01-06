import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Auth.css";

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
            <div className="auth-card">
                <h3 className="auth-title">Đăng ký</h3>
                <p className="auth-subtitle">
                    Tạo tài khoản để bắt đầu mua bán
                </p>

                <form onSubmit={handleRegister}>
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
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 text-end">
                        <Link to="/login" className="auth-link">
                            Đã có tài khoản?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn auth-btn w-100"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
