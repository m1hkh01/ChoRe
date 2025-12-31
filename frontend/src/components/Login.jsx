import { useState } from "react"
import { Link } from "react-router-dom";
import api from "../api";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

export function Login() {
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const HandleLogin = async (e) => {
        e.preventDefault();
        console.log("Login");
        try {
            const res = await api.post("/login", { Email: email, PasswordHash: password });
            // console.log("Đăng nhập thành công: ", res.data);
            alert(res.data.message);
            login(res.data.userDto, res.data.token);
            navigate("/");
        }
        catch (err) {
            if (err.response && err.response.status === 400) {
                alert(err.response.data.error);
            }
            console.log("Lỗi login: ", err);
        }

    }
    return (
        <div className="login-container">
            <form onSubmit={HandleLogin}>
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" required/>
                </div>
                <div className="mt-3">
                    <label htmlFor="psw" className="form-label">Password:</label>
                    <input type="password" id="psw" value={password} onChange={(e)=> setPassword(e.target.value)} className="form-control" required/>
                </div>
                <div className="mt-3 text-end">
                    <Link to="/register" className="text-decoration-none">Chưa có tài khoản? Đăng ký ngay</Link>
                </div>
                <div className="mt-3 d-flex justify-content-end">
                    <button type="submit" className="btn btn-success">Login</button>
                </div>
            </form>
        </div>
    )
}