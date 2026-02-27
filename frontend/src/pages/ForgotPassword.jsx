import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import OtpInput from "./OtpInput";
import "@/assets/Auth.css";
import { Toast } from "../utils/toast";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1); // 1=email,2=otp,3=new password
    const [loading, setLoading] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const sendOtp = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post("/send-otp", { email });
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.error || "Gửi OTP thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpComplete = async (otp) => {
        try {
            setLoading(true);
            await api.post("/verify-otp", { email, otpCode: otp });
            setOtpValue(otp);
            setStep(3);
        } catch (err) {
            alert(err.response?.data?.error || "Mã OTP không hợp lệ");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            Toast.fire({
                icon: 'error',
                title: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            })
            return;
        }
        if (newPassword !== confirmPassword) {
            Toast.fire({
                icon: 'error',
                title: 'Mật khẩu xác nhận không khớp'
            })
            return;
        }

        try {
            setLoading(true);
            await api.post("/reset-password", { email, otpCode: otpValue, newPassword });
            Toast.fire({
                icon: 'success',
                title: 'Đặt lại mật khẩu thành công'
            });
            navigate('/login');
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: err.response?.data?.error || "Đặt lại mật khẩu thất bại"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h3 className="auth-title">Quên mật khẩu</h3>

                {step === 1 && (
                    <form onSubmit={sendOtp}>
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

                        <button type="submit" className="register-btn w-100" disabled={loading}>
                            {loading ? 'Đang gửi mã...' : 'Gửi mã OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <OtpInput length={6} onComplete={(otp) => handleOtpComplete(otp)} />
                )}

                {step === 3 && (
                    <form onSubmit={handleReset}>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="register-btn w-100" disabled={loading}>
                            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
