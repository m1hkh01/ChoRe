import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import OtpInput from "./OtpInput";
import { Toast } from "../utils/toast";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .rg-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    padding: 24px 16px;
  }

  .rg-card {
    width: 100%;
    max-width: 700px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 36px 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  /* ── Logo ── */
  .rg-logo {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .rg-logo img {
    height: 50px;
    width: auto;
    object-fit: contain;
  }

  /* ── Heading ── */
  .rg-title {
    font-size: 25px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 0 0 4px;
  }

  .rg-sub {
    font-size: 15px;
    color: #94a3b8;
    text-align: center;
    margin: 0 0 26px;
  }

  /* ── Grid for 2-col fields ── */
  .rg-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 16px;
  }

  .rg-full { grid-column: 1 / -1; }

  /* ── Field ── */
  .rg-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .rg-label {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }

  .rg-input {
    padding: 9px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    font-size: 16px;
    color: #0f172a;
    outline: none;
    background: #f8fafc;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }

  .rg-input:focus {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
  }

  .rg-input::placeholder { color: #cbd5e1; }

  /* ── Bottom row ── */
  .rg-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    gap: 12px;
  }

  .rg-link {
    font-size: 15px;
    font-weight: 500;
    color: #22c55e;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s;
  }

  .rg-link:hover { color: #16a34a; text-decoration: underline; }

  /* ── Submit button ── */
  .rg-btn {
    padding: 10px 28px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.12s;
    white-space: nowrap;
  }

  .rg-btn:hover   { background: #16a34a; }
  .rg-btn:active  { transform: scale(0.98); }
  .rg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Responsive ── */
  @media (max-width: 520px) {
    .rg-card  { padding: 28px 18px; border-radius: 14px; }
    .rg-grid  { grid-template-columns: 1fr; }
    .rg-full  { grid-column: auto; }
    .rg-title { font-size: 20px; }
    .rg-btn   { flex: 1; padding: 10px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [otpSent,  setOtpSent]  = useState(false);

  const [form, setForm] = useState({
    username:     "",
    fullName:     "",
    email:        "",
    phonenumber:  "",
    address:      "",
    passwordhash: "",
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  // ── Send OTP ─────────────────────────────────────────────────────────────

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/send-otp", { email: form.email });
      setOtpSent(true);
    } catch (err) {
      Toast.fire({ icon: "error", title: err.response?.data?.error ?? "Gửi OTP thất bại" });
    } finally {
      setLoading(false);
    }
  };

  // ── Register after OTP ────────────────────────────────────────────────────

  const handleRegister = async (otp) => {
    setLoading(true);
    try {
      const res = await api.post("/register", { ...form, otpCode: otp });
      Toast.fire({ icon: "success", title: res.data.message ?? "Đăng ký thành công!" });
      navigate("/login");
    } catch (err) {
      Toast.fire({ icon: "error", title: err.response?.data?.error ?? "Đăng ký thất bại" });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div className="rg-wrap">
        <div className="rg-card">

          <div className="rg-logo">
            <img src="/logoChoRe.png" alt="Chợ Rẻ" />
          </div>

          {!otpSent ? (
            <>
              <h1 className="rg-title">Đăng ký tài khoản</h1>
              <p className="rg-sub">Tạo tài khoản để bắt đầu mua bán</p>

              <form onSubmit={handleSendOtp} noValidate>
                <div className="rg-grid">

                  <div className="rg-field">
                    <label className="rg-label">Tên tài khoản</label>
                    <input className="rg-input" type="text" placeholder="username"
                      value={form.username} onChange={set("username")} required />
                  </div>

                  <div className="rg-field">
                    <label className="rg-label">Họ và tên</label>
                    <input className="rg-input" type="text" placeholder="Nguyễn Văn A"
                      value={form.fullName} onChange={set("fullName")} required />
                  </div>

                  <div className="rg-field rg-full">
                    <label className="rg-label">Email</label>
                    <input className="rg-input" type="email" placeholder="you@email.com"
                      value={form.email} onChange={set("email")} required autoComplete="email" />
                  </div>

                  <div className="rg-field">
                    <label className="rg-label">Số điện thoại</label>
                    <input className="rg-input" type="tel" placeholder="0xxx xxx xxx"
                      value={form.phonenumber} onChange={set("phonenumber")} />
                  </div>

                  <div className="rg-field">
                    <label className="rg-label">Địa chỉ</label>
                    <input className="rg-input" type="text" placeholder="Tỉnh / Thành phố"
                      value={form.address} onChange={set("address")} />
                  </div>

                  <div className="rg-field rg-full">
                    <label className="rg-label">Mật khẩu</label>
                    <input className="rg-input" type="password" placeholder="Tối thiểu 6 ký tự"
                      value={form.passwordhash} onChange={set("passwordhash")}
                      required autoComplete="new-password" />
                  </div>

                </div>

                <div className="rg-footer">
                  <Link to="/login" className="rg-link">Đã có tài khoản?</Link>
                  <button type="submit" className="rg-btn" disabled={loading}>
                    {loading ? "Đang gửi..." : "Tiếp theo"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="rg-title">Xác minh email</h1>
              <p className="rg-sub">Mã 6 chữ số đã gửi đến <b>{form.email}</b></p>
              <OtpInput
                length={6}
                onComplete={handleRegister}
                onResend={() => api.post("/send-otp", { email: form.email })}
              />
            </>
          )}

        </div>
      </div>
    </>
  );
}