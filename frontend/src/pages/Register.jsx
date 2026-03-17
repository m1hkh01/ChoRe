import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import OtpInput from "./OtpInput";
import { Toast } from "../utils/toast";
import provinceData from "@/data/sauSapNhap/province.json";
import wardData     from "@/data/sauSapNhap/ward.json";

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

  /* ── Grid ── */
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
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  .rg-label span {
    color: #ef4444;
    margin-left: 2px;
  }

  /* ── Input ── */
  .rg-input {
    padding: 9px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    font-size: 14px;
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
  .rg-input.err {
    border-color: #ef4444;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }
  .rg-input.ok {
    border-color: #22c55e;
    background: #fff;
  }

  /* ── Error message ── */
  .rg-err {
    font-size: 11px;
    color: #ef4444;
    font-weight: 500;
    min-height: 16px;
  }

  /* ── Address selects ── */
  .rg-address-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rg-select-wrap {
    display: flex;
    align-items: center;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    background: #f8fafc;
    padding: 0 12px;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .rg-select-wrap:focus-within {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
  }
  .rg-select-wrap.err { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }

  .rg-select {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #0f172a;
    padding: 9px 0;
    cursor: pointer;
    appearance: auto;
  }

  /* ── Password strength ── */
  .rg-strength {
    display: flex;
    gap: 4px;
    margin-top: 4px;
  }
  .rg-strength-bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: #e2e8f0;
    transition: background 0.2s;
  }
  .rg-strength-bar.weak   { background: #ef4444; }
  .rg-strength-bar.medium { background: #f59e0b; }
  .rg-strength-bar.strong { background: #22c55e; }

  .rg-strength-label {
    font-size: 11px;
    margin-top: 3px;
    font-weight: 500;
  }
  .rg-strength-label.weak   { color: #ef4444; }
  .rg-strength-label.medium { color: #f59e0b; }
  .rg-strength-label.strong { color: #22c55e; }

  /* ── Footer ── */
  .rg-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    gap: 12px;
  }

  .rg-link {
    font-size: 14px;
    font-weight: 500;
    color: #22c55e;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s;
  }
  .rg-link:hover { color: #16a34a; text-decoration: underline; }

  .rg-btn {
    padding: 10px 28px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .rg-btn:hover    { background: #16a34a; }
  .rg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 520px) {
    .rg-card  { padding: 28px 18px; border-radius: 14px; }
    .rg-grid  { grid-template-columns: 1fr; }
    .rg-full  { grid-column: auto; }
    .rg-title { font-size: 20px; }
    .rg-btn   { flex: 1; padding: 10px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const provinces = Object.entries(provinceData)
  .map(([code, d]) => ({ code, name: d.name }))
  .sort((a, b) => a.name.localeCompare(b.name, "vi"));

function pwStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6)                        score++;
  if (pw.length >= 10)                       score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  return score; // 0–3
}

// ─── Validate rules ───────────────────────────────────────────────────────────

const RULES = {
  username:     v => !v ? "Bắt buộc" : v.length < 4 ? "Tối thiểu 4 ký tự" : /\s/.test(v) ? "Không chứa khoảng trắng" : /[^a-zA-Z0-9_]/.test(v) ? "Chỉ chữ, số, dấu _" : "",
  fullName:     v => !v ? "Bắt buộc" : v.trim().length < 2 ? "Nhập họ tên đầy đủ" : "",
  email:        v => !v ? "Bắt buộc" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email không hợp lệ" : "",
  phonenumber:  v => !v ? "Bắt buộc" : !/^(0|\+84)[0-9]{8,10}$/.test(v.replace(/\s/g, "")) ? "Số điện thoại không hợp lệ" : "",
  province:     v => !v ? "Vui lòng chọn tỉnh / thành phố" : "",
  passwordhash: v => !v ? "Bắt buộc" : v.length < 6 ? "Tối thiểu 6 ký tự" : "",
};

// ─── Field component (phải ở ngoài Register để tránh remount khi re-render) ──

function Field({ id, label, required, touched, error, children }) {
  return (
    <div className="rg-field">
      <label className="rg-label" htmlFor={id}>
        {label}{required && <span>*</span>}
      </label>
      {children}
      <span className="rg-err">{touched && error ? error : ""}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    username:     "",
    fullName:     "",
    email:        "",
    phonenumber:  "",
    passwordhash: "",
  });

  // Address state riêng
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode,     setWardCode]     = useState("");

  // Touched — chỉ show lỗi sau khi user đã chạm vào field
  const [touched, setTouched] = useState({});

  const set    = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const touch  = (key) => ()  => setTouched(t => ({ ...t, [key]: true }));
  const touchAll = ()  => setTouched({ username: true, fullName: true, email: true, phonenumber: true, province: true, passwordhash: true });

  // Wards theo tỉnh đang chọn
  const wards = useMemo(() =>
    !provinceCode ? [] :
    Object.entries(wardData)
      .filter(([, w]) => w.parent_code === provinceCode)
      .map(([code, w]) => ({ code, name: w.name_with_type ?? w.name }))
      .sort((a, b) => a.name.localeCompare(b.name, "vi")),
    [provinceCode]
  );

  // Địa chỉ cuối cùng ghép lại
  const addressLabel = useMemo(() => {
    const prov = provinceData[provinceCode]?.name ?? "";
    const ward = wardCode ? (wardData[wardCode]?.name_with_type ?? wardData[wardCode]?.name ?? "") : "";
    return [ward, prov].filter(Boolean).join(", ");
  }, [provinceCode, wardCode]);

  // Errors
  const errors = {
    username:     RULES.username(form.username),
    fullName:     RULES.fullName(form.fullName),
    email:        RULES.email(form.email),
    phonenumber:  RULES.phonenumber(form.phonenumber),
    province:     RULES.province(provinceCode),
    passwordhash: RULES.passwordhash(form.passwordhash),
  };

  const isFormValid = Object.values(errors).every(e => !e);

  const strength = pwStrength(form.passwordhash);
  const strengthLabel = ["", "Yếu", "Trung bình", "Mạnh"][strength];
  const strengthCls   = ["", "weak", "medium", "strong"][strength];

  // ── Send OTP ────────────────────────────────────────────────────────────

  const handleSendOtp = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isFormValid) return;

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

  // ── Register after OTP ──────────────────────────────────────────────────

  const handleRegister = async (otp) => {
    setLoading(true);
    try {
      const res = await api.post("/register", {
        ...form,
        address: addressLabel,
        otpCode: otp,
      });
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

                  {/* Username */}
                  <Field id="username" label="Tên tài khoản" required touched={touched.username} error={errors.username}>
                    <input
                      id="username"
                      className={`rg-input ${touched.username ? (errors.username ? "err" : "ok") : ""}`}
                      type="text"
                      placeholder="Chỉ chữ, số, dấu _"
                      value={form.username}
                      onChange={set("username")}
                      onBlur={touch("username")}
                    />
                  </Field>

                  {/* Họ tên */}
                  <Field id="fullName" label="Họ và tên" required touched={touched.fullName} error={errors.fullName}>
                    <input
                      id="fullName"
                      className={`rg-input ${touched.fullName ? (errors.fullName ? "err" : "ok") : ""}`}
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={form.fullName}
                      onChange={set("fullName")}
                      onBlur={touch("fullName")}
                    />
                  </Field>

                  {/* Email */}
                  <Field id="email" label="Email" required touched={touched.email} error={errors.email} className="rg-full">
                    <input
                      id="email"
                      className={`rg-input ${touched.email ? (errors.email ? "err" : "ok") : ""}`}
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={set("email")}
                      onBlur={touch("email")}
                      autoComplete="email"
                    />
                  </Field>

                  {/* Số điện thoại */}
                  <Field id="phonenumber" label="Số điện thoại" required touched={touched.phonenumber} error={errors.phonenumber}>
                    <input
                      id="phonenumber"
                      className={`rg-input ${touched.phonenumber ? (errors.phonenumber ? "err" : "ok") : ""}`}
                      type="tel"
                      placeholder="0xxx xxx xxx"
                      value={form.phonenumber}
                      onChange={set("phonenumber")}
                      onBlur={touch("phonenumber")}
                    />
                  </Field>

                  {/* Địa chỉ */}
                  <Field id="province" label="Địa chỉ" required touched={touched.province} error={errors.province}>
                    <div className="rg-address-group">
                      <div className={`rg-select-wrap ${touched.province ? (errors.province ? "err" : "") : ""}`}>
                        <select
                          className="rg-select"
                          value={provinceCode}
                          onChange={e => { setProvinceCode(e.target.value); setWardCode(""); }}
                          onBlur={touch("province")}
                        >
                          <option value="">Tỉnh / Thành phố *</option>
                          {provinces.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      {provinceCode && (
                        <div className="rg-select-wrap">
                          <select
                            className="rg-select"
                            value={wardCode}
                            onChange={e => setWardCode(e.target.value)}
                          >
                            <option value="">Phường / Xã (tùy chọn)</option>
                            {wards.map(w => (
                              <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </Field>

                  {/* Mật khẩu */}
                  <Field id="passwordhash" label="Mật khẩu" required touched={touched.passwordhash} error={errors.passwordhash}>
                    <input
                      id="passwordhash"
                      className={`rg-input ${touched.passwordhash ? (errors.passwordhash ? "err" : "ok") : ""}`}
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={form.passwordhash}
                      onChange={set("passwordhash")}
                      onBlur={touch("passwordhash")}
                      autoComplete="new-password"
                    />
                    {/* Password strength */}
                    {form.passwordhash && (
                      <>
                        <div className="rg-strength">
                          {[1,2,3].map(i => (
                            <div key={i} className={`rg-strength-bar ${i <= strength ? strengthCls : ""}`} />
                          ))}
                        </div>
                        <span className={`rg-strength-label ${strengthCls}`}>{strengthLabel}</span>
                      </>
                    )}
                  </Field>

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