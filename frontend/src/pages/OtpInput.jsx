import { useEffect, useRef, useState } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .otp-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  /* ── Inputs row ── */
  .otp-inputs {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .otp-box {
    width: 48px;
    height: 54px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    outline: none;
    caret-color: #22c55e;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }

  .otp-box:focus {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }

  .otp-box.filled {
    border-color: #22c55e;
    background: #f0fdf4;
    color: #16a34a;
  }

  /* ── Timer ── */
  .otp-timer {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #94a3b8;
  }

  .otp-timer-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: otpPulse 1s infinite;
  }

  .otp-timer.expired .otp-timer-dot { background: #ef4444; animation: none; }
  .otp-timer.expired                 { color: #ef4444; }

  @keyframes otpPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .otp-timer-count {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: inherit;
  }

  /* ── Resend ── */
  .otp-resend {
    font-size: 15px;
    color: #94a3b8;
    text-align: center;
  }

  .otp-resend-btn {
    background: none;
    border: none;
    color: #22c55e;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    transition: color 0.15s;
  }

  .otp-resend-btn:hover    { color: #16a34a; }
  .otp-resend-btn:disabled { color: #94a3b8; cursor: not-allowed; text-decoration: none; }

  /* ── Responsive ── */
  @media (max-width: 380px) {
    .otp-box    { width: 40px; height: 46px; font-size: 18px; border-radius: 8px; }
    .otp-inputs { gap: 7px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const EXPIRE_SEC = 120;

export default function OtpInput({ length = 6, onComplete, onResend }) {
  const [otp,     setOtp]     = useState(Array(length).fill(""));
  const [seconds, setSeconds] = useState(EXPIRE_SEC);
  const inputsRef = useRef([]);

  // ── Countdown ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const resetTimer = () => setSeconds(EXPIRE_SEC);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Input handlers ──────────────────────────────────────────────────────────

  const update = (newOtp) => {
    setOtp(newOtp);
    if (newOtp.every(v => v !== "")) onComplete?.(newOtp.join(""));
  };

  const handleChange = (e, i) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = [...otp];
    next[i] = digit;
    update(next);
    if (i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key !== "Backspace") return;
    if (otp[i]) {
      const next = [...otp]; next[i] = ""; setOtp(next);
    } else if (i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    const next = Array(length).fill("");
    digits.split("").forEach((d, i) => { next[i] = d; });
    update(next);
    inputsRef.current[Math.min(digits.length, length) - 1]?.focus();
  };

  const handleResend = () => {
    setOtp(Array(length).fill(""));
    resetTimer();
    inputsRef.current[0]?.focus();
    onResend?.();
  };

  const expired = seconds === 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="otp-wrap">

        {/* Input boxes */}
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((val, i) => (
            <input
              key={i}
              ref={el => inputsRef.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => handleChange(e, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className={`otp-box ${val ? "filled" : ""}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Timer */}
        <div className={`otp-timer ${expired ? "expired" : ""}`}>
          <span className="otp-timer-dot" />
          {expired
            ? "Mã OTP đã hết hạn"
            : <><span>Mã hết hạn sau</span> <span className="otp-timer-count">{fmt(seconds)}</span></>
          }
        </div>
      </div>
    </>
  );
}