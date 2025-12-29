import { useState } from "react"
import { Link } from "react-router-dom";

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-container">
            <form action="">
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" />
                </div>
                <div className="mt-3">
                    <label htmlFor="psw" className="form-label">Password:</label>
                    <input type="password" id="psw" value={password} onChange={(e)=> setPassword(e.target.value)} className="form-control" />
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