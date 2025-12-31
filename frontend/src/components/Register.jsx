import { useState} from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

async function HandleRegister(prevState, formData) {
    try {
        const res = await api.post("/register", formData);
        alert(res.data.message);
        return {success: true, message: "Đăng ký thành công"};
    }
    catch (err) {
        alert("Có lỗi xảy ra");
        console.log("Error Register: ", err);
    }
 }

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;

        const data = {
            username: form.name.value,
            fullName: form.fullname.value,
            email: form.email.value,
            phonenumber: form.phone.value,
            address: form.address.value,
            passwordhash: form.password.value
        };

        try {
            const res = await api.post("/register", data);
            alert(res.data.message);
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.error || "Đăng ký thất bại");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="login-container">
            <form className="login-form" id="register" onSubmit={handleRegister}>
                <div className="header">
                    <h2>Register</h2>
                </div>
                <div className="mt-3">
                    <label htmlFor="name" className="form-label">Tên tài khoản:</label>
                    <input type="text" id="name"  className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="fullname" className="form-label">Họ và tên:</label>
                    <input type="text" id="fullname" className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id="email" className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <input type="text" id="phone" className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <textarea id="address"  className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" id="password" className="form-control" required />
                </div>
                <div className="mt-3 text-end">
                    <Link to="/login" className="text-decoration-none">Đã có tài khoản? Đăng nhập ngay</Link>
                </div>
                <div className="w-100 d-flex justify-content-end mt-3">
                    <button type="submit" id="submit-button" className="btn btn-success">
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Register;