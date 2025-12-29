import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-container">
            <form className="login-form" id="register">
                <div className="header">
                    <h2>Register</h2>
                </div>
                <div className="mt-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} className="form-control" required />
                </div>
                <div className="mt-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="password" className="form-control" required />
                </div>
                <div className="mt-3 text-end">
                    <Link to="/login" className="text-decoration-none">Đã có tài khoản? Đăng nhập ngay</Link>
                </div>
                <div className="w-100 d-flex justify-content-end mt-3">
                    <button type="submit" id="submit-button" className="btn btn-success">
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Register;