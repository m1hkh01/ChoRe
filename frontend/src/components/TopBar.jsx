// ─── TopBar.jsx ───────────────────────────────────────────────────────────────
// Dòng giới thiệu + thông tin liên hệ chạy phía trên Header.
// Tự động ẩn khi người dùng scroll xuống >= 60px.

import { useEffect, useState } from "react";
import "@/assets/TopBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
const MARQUEE_TEXT =
    "Chào mừng đến với ChoRe – Website mua bán đồ điện tử cũ uy tín #1 Việt Nam! " +
    "Hàng nghìn sản phẩm mới mỗi ngày · Giao dịch an toàn · Hỗ trợ 24/7 · An toàn và tiện lợi!";

export default function TopBar() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setVisible(y < 60);
            lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className={`topbar${visible ? "" : " topbar--hidden"}`}>
            {/* Marquee giới thiệu */}
            <div className="topbar-marquee-wrap" aria-hidden="true">
                <div className="topbar-marquee">
                    <span>{MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{MARQUEE_TEXT}</span>
                </div>
            </div>

            {/* Thông tin liên hệ – desktop only */}
            <div className="topbar-contact">
                <span className="topbar-sep">|</span>
                <a href="tel:19001234" className="topbar-contact-item">
                    <FontAwesomeIcon icon={faPhoneVolume} />
                    <span style={{marginLeft: 10}}>0836 044 008</span>
                </a>
                {/* <a href="mailto:support@chore123.cloud" className="topbar-contact-item">
          Hỗ trợ: ng.minhkhoi2912@gmail.com
        </a> */}
                {/* <span className="topbar-sep">|</span> */}
                {/* <a
          href="https://facebook.com/chore123"
          target="_blank"
          rel="noopener noreferrer"
          className="topbar-contact-item"
        >
          fb/ChoRe123
        </a> */}
            </div>
        </div>
    );
}