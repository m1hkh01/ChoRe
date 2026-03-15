import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import OtpInput from "./OtpInput";
import { Toast } from "../utils/toast";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .fp-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    padding: 24px 16px;
  }

  .fp-card {
    width: 100%;
    max-width: 500px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 36px 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  /* ── Logo ── */
  .fp-logo {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .fp-logo img {
    height: 50px;
    width: auto;
    object-fit: contain;
  }

  /* ── Steps indicator ── */
  .fp-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 28px;
  }

  .fp-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .fp-step-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    transition: all 0.2s;
  }

  .fp-step.done .fp-step-dot {
    background: #22c55e;
    border-color: #22c55e;
    color: #fff;
  }

  .fp-step.active .fp-step-dot {
    background: #fff;
    border-color: #22c55e;
    color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
  }

  .fp-step-label {
    font-size: 15px;
    font-weight: 600;
    color: #94a3b8;
    white-space: nowrap;
  }

  .fp-step.done .fp-step-label,
  .fp-step.active .fp-step-label { color: #16a34a; }

  .fp-step-line {
    width: 40px;
    height: 2px;
    background: #e2e8f0;
    margin: 0 4px;
    margin-bottom: 18px;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .fp-step-line.done { background: #22c55e; }

  /* ── Heading ── */
  .fp-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 0 0 4px;
  }

  .fp-sub {
    font-size: 15px;
    color: #94a3b8;
    text-align: center;
    margin: 0 0 24px;
    line-height: 1.5;
  }

  /* ── Fields ── */
  .fp-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 16px;
  }

  .fp-label {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }

  .fp-input {
    padding: 10px 14px;
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

  .fp-input:focus {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
  }

  .fp-input::placeholder { color: #cbd5e1; }

  /* ── Hint ── */
  .fp-hint {
    font-size: 11px;
    color: #94a3b8;
    margin: -10px 0 14px;
  }

  /* ── Button ── */
  .fp-btn {
    width: 100%;
    padding: 12px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.12s;
    margin-top: 4px;
  }

  .fp-btn:hover   { background: #16a34a; }
  .fp-btn:active  { transform: scale(0.98); }
  .fp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Resend ── */
  .fp-resend {
    text-align: center;
    margin-top: 14px;
    font-size: 15px;
    color: #94a3b8;
  }

  .fp-resend button {
    background: none;
    border: none;
    color: #22c55e;
    font-weight: 600;
    cursor: pointer;
    font-size: 15px;
    padding: 0;
  }
  .fp-resend button:hover { color: #16a34a; text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .fp-card      { padding: 28px 20px; border-radius: 14px; }
    .fp-step-line { width: 24px; }
    .fp-title     { font-size: 16px; }
  }
`;

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Email"     },
  { label: "Xác minh" },
  { label: "Mật khẩu" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step,            setStep]            = useState(1);
  const [loading,         setLoading]         = useState(false);
  const [email,           setEmail]           = useState("");
  const [otpValue,        setOtpValue]        = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Handlers ───────────────────────────────────────────────────────────────

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/send-otp", { email });
      setStep(2);
    } catch (err) {
      Toast.fire({ icon: "error", title: err.response?.data?.error ?? "Gửi OTP thất bại" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    try {
      await api.post("/verify-otp", { email, otpCode: otp });
      setOtpValue(otp);
      setStep(3);
    } catch (err) {
      Toast.fire({ icon: "error", title: err.response?.data?.error ?? "Mã OTP không hợp lệ" });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      Toast.fire({ icon: "error", title: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.fire({ icon: "error", title: "Mật khẩu xác nhận không khớp" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/reset-password", { email, otpCode: otpValue, newPassword });
      Toast.fire({ icon: "success", title: "Đặt lại mật khẩu thành công" });
      navigate("/login");
    } catch (err) {
      Toast.fire({ icon: "error", title: err.response?.data?.error ?? "Đặt lại mật khẩu thất bại" });
    } finally {
      setLoading(false);
    }
  };

  // ── Step indicator ─────────────────────────────────────────────────────────

  const StepBar = () => (
    <div className="fp-steps">
      {STEPS.map((s, i) => {
        const num    = i + 1;
        const done   = step > num;
        const active = step === num;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div className={`fp-step ${done ? "done" : active ? "active" : ""}`}>
              <div className="fp-step-dot">{done ? "✓" : num}</div>
              <span className="fp-step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`fp-step-line ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Content per step ───────────────────────────────────────────────────────

  const titles = [
    { title: "Quên mật khẩu",    sub: "Nhập email để nhận mã xác minh" },
    { title: "Nhập mã OTP",      sub: `Mã 6 chữ số đã gửi đến ${email}` },
    { title: "Đặt lại mật khẩu", sub: "Tạo mật khẩu mới cho tài khoản" },
  ];

  const { title, sub } = titles[step - 1];

  return (
    <>
      <style>{CSS}</style>
      <div className="fp-wrap">
        <div className="fp-card">

          <div className="fp-logo">
            <img src="/logoChoRe.png" alt="Chợ Rẻ" />
          </div>

          <StepBar />

          <h1 className="fp-title">{title}</h1>
          <p className="fp-sub">{sub}</p>

          {/* Step 1 — Email */}
          {step === 1 && (
            <form onSubmit={sendOtp} noValidate>
              <div className="fp-field">
                <label className="fp-label">Email</label>
                <input
                  type="email"
                  className="fp-input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </button>
            </form>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <>
              <OtpInput length={6} onComplete={verifyOtp} />
              <div className="fp-resend">
                Không nhận được mã?{" "}
                <button onClick={sendOtp} disabled={loading}>Gửi lại</button>
              </div>
            </>
          )}

          {/* Step 3 — New password */}
          {step === 3 && (
            <form onSubmit={resetPassword} noValidate>
              <div className="fp-field">
                <label className="fp-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="fp-input"
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="fp-field">
                <label className="fp-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  className="fp-input"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          )}

        </div>
      </div>
    </>
  );
}