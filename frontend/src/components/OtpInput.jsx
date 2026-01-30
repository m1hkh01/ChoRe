import { useEffect, useRef, useState } from "react";

export default function OtpInput({ length = 6, onComplete }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const [expired, setExpired] = useState(120); //hết hạn sau 120s
    const inputsRef = useRef([]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setExpired((prev) => {
                if (prev <= 0) {
                    clearInterval(countdown);
                    return 0;
                }
                else {
                    return prev - 1;
                }
            });
        }, 1000);
        return () => clearInterval(countdown);
    }, []);
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value[value.length - 1];
        setOtp(newOtp);

        if (index < length - 1) {
            inputsRef.current[index + 1].focus();
        }

        if (newOtp.every(v => v !== "")) {
            onComplete?.(newOtp.join(""));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!paste) return;

        const newOtp = [...otp];
        paste.split("").slice(0, length).forEach((char, i) => {
            newOtp[i] = char;
        });

        setOtp(newOtp);
        inputsRef.current[Math.min(paste.length, length) - 1]?.focus();

        if (newOtp.every(v => v !== "")) {
            onComplete?.(newOtp.join(""));
        }
    };

    return (
        <div className="OtpContainer">
            <h2>Nhập mã OTP</h2>
            <span>Mã OTP đã được gửi đến email của bạn. Vui nhập mã OTP để xác nhận email</span>
            <div className="OtpInputs" onPaste={handlePaste}>
                {otp.map((value, index) => (
                    <input
                        key={index}
                        ref={el => inputsRef.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={e => handleChange(e, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        className="OtpInput"
                    />
                ))}
            </div>
            {
                expired > 0 ? (
                    <span className="expired-otp-at">{expired > 0 ? `Mã OTP hết hạn sau ${expired} giây` : "Mã OTP đã hết hạn"}</span>
                ) : (
                    <span className="resend-otp" onClick={() => window.location.reload()}>Gửi lại mã OTP</span>
                )
            }
        </div>
    );
};