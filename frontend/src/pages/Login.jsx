import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import { useAuthStore } from "@/store/auth";
import { Toast } from "../utils/toast";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .lg-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    padding: 24px 16px;
  }

  .lg-card {
    width: 100%;
    max-width: 500px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 36px 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  /* ── Logo & heading ── */
  .lg-logo {
    display: flex;
    justify-content: center;
    margin: 20px;
  }

  .lg-logo img {
    height: 50px;
    width: auto;
    object-fit: contain;
  }

  .lg-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 0 0 4px;
  }

  .lg-sub {
    font-size: 15px;
    color: #94a3b8;
    text-align: center;
    margin: 0 0 28px;
  }

  /* ── Form fields ── */
  .lg-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 16px;
  }

  .lg-label {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }

  .lg-input {
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    font-size: 16px;
    color: #0f172a;
    outline: none;
    background: #f8fafc;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .lg-input:focus {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
  }

  .lg-input::placeholder { color: #cbd5e1; }

  /* ── Links row ── */
  .lg-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .lg-link {
    font-size: 14px;
    font-weight: 500;
    color: #22c55e;
    text-decoration: none;
    transition: color 0.15s;
  }

  .lg-link:hover { color: #16a34a; text-decoration: underline; }

  /* ── Submit button ── */
  .lg-btn {
    width: 100%;
    padding: 12px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.12s;
  }

  .lg-btn:hover  { background: #16a34a; }
  .lg-btn:active { transform: scale(0.98); }
  .lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .lg-card    { padding: 28px 20px; border-radius: 14px; }
    .lg-title   { font-size: 20px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Login() {
  const { login }    = useAuthStore();
  const navigate     = useNavigate();
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [loading,    setLoading]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data } = await api.post("/login", {
            Email:        email,
            PasswordHash: password,
        });
        Toast.fire({ icon: "success", title: "Đăng nhập thành công" });
        login(data.userDto, data.token);
        navigate("/");
    } catch (err) {
        const errorMsg = err.response?.data?.error ?? "Đăng nhập thất bại";
        const isLocked = err.response?.data?.isLocked;

        if (isLocked) {
            // Hiện modal/toast đặc biệt cho tài khoản bị khóa
            Toast.fire({
                icon:              "error",
                title:             "Tài khoản bị khóa",
                text:              errorMsg,
                confirmButtonText: "Đã hiểu",
                // Nếu dùng SweetAlert2 thì có thể thêm:
                showConfirmButton:  true,
                timer:              3000, // không tự đóng
            });
        } else {
            Toast.fire({ icon: "error", title: errorMsg });
        }
    } finally {
        setLoading(false);
    }
};
  return (
    <>
      <style>{CSS}</style>
      <div className="lg-wrap">
        <div className="lg-card">

          <div className="lg-logo">
            <img src="/logoChoRe.png" alt="Chợ Rẻ" />
          </div>

          <h1 className="lg-title">Đăng nhập</h1>
          <p className="lg-sub">Chào mừng bạn quay lại Chợ Rẻ</p>

          <form onSubmit={handleSubmit} noValidate>

            <div className="lg-field">
              <label className="lg-label">Email</label>
              <input
                type="email"
                className="lg-input"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="lg-field">
              <label className="lg-label">Mật khẩu</label>
              <input
                type="password"
                className="lg-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="lg-links">
              <Link to="/register"       className="lg-link">Chưa có tài khoản?</Link>
              <Link to="/forgot-password" className="lg-link">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}