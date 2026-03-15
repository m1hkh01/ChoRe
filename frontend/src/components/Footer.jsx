import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUPPORT_LINKS = [
  { to: "/about",      label: "Giới thiệu" },
  { to: "/contact",    label: "Liên hệ" },
  { to: "/helpcenter", label: "Trung tâm trợ giúp" },
  { to: "/payment",    label: "Phương thức thanh toán" },
];

const POLICY_LINKS = [
  { to: "/terms",   label: "Điều khoản sử dụng" },
  { to: "/privacy", label: "Chính sách bảo mật" },
  { to: "/ds",      label: "Giải quyết tranh chấp" },
];

const CONTACT_ITEMS = [
  { icon: "fas fa-map-marker-alt", text: "Phường Tân Triều, Tỉnh Đồng Nai, Việt Nam" },
  { icon: "fas fa-phone",          text: "0836 044 008" },
  { icon: "fas fa-envelope",       text: "ng.minhkhoi2912@gmail.com" },
  { icon: "fas fa-clock",          text: "8:00 – 22:00 (Hàng ngày)" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .ft {
    background: #0f172a;
    color: #f8fafc;
    margin-top: 60px;
    font-size: 14px;
    line-height: 1.6;
  }
  .ft-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 56px 24px 28px;
  }
  .ft-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
    gap: 40px;
    margin-bottom: 48px;
  }
  .ft-col {
    display: flex;
    flex-direction: column;
  }
  .ft-logo {
    width: 200px;
    height: auto;
    object-fit: contain;
    margin: 16px;
    opacity: 0.9;
  }
  .ft-desc {
    color: #94a3b8;
    font-size: 13px;
    line-height: 1.7;
    margin: 0;
    max-width: 280px;
  }
  .ft-title {
    font-size: 13px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0 0 18px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .ft-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ft-link {
    color: #94a3b8;
    text-decoration: none;
    font-size: 13px;
    display: inline-block;
    transition: color 0.18s, padding-left 0.18s;
  }
  .ft-link:hover {
    color: #22c55e;
    padding-left: 4px;
  }
  .ft-contact {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ft-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #94a3b8;
    font-size: 13px;
  }
  .ft-contact-item i {
    margin-top: 3px;
    min-width: 14px;
    font-size: 13px;
    color: #22c55e;
    flex-shrink: 0;
  }
  .ft-bottom {
    border-top: 1px solid #1e293b;
    padding-top: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ft-bottom p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  @media (max-width: 900px) {
    .ft-grid {
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    .ft-col--brand {
      grid-column: 1 / -1;
    }
    .ft-desc {
      max-width: 100%;
    }
  }

  @media (max-width: 520px) {
    .ft-inner {
      padding: 40px 16px 24px;
    }
    .ft-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .ft-col--brand {
      grid-column: auto;
    }
    .ft-logo {
      width: 110px;
    }
    .ft-bottom {
      text-align: left;
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <>
      <style>{CSS}</style>

      <footer className="ft">
        <div className="ft-inner">
          <div className="ft-grid">

            {/* Brand */}
            <div className="ft-col ft-col--brand">
              <img src="/logovientrang.png" alt="Chợ Rẻ" className="ft-logo" />
              <p className="ft-desc">
                Nền tảng mua bán đồ điện tử cũ trực tuyến, kết nối người mua và người bán
                một cách nhanh chóng, an toàn và tiện lợi.
              </p>
            </div>

            {/* Support */}
            <div className="ft-col">
              <h3 className="ft-title">Hỗ trợ khách hàng</h3>
              <ul className="ft-list">
                {SUPPORT_LINKS.map(item => (
                  <li key={item.to}>
                    <Link to={item.to} className="ft-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policy */}
            <div className="ft-col">
              <h3 className="ft-title">Chính sách</h3>
              <ul className="ft-list">
                {POLICY_LINKS.map(item => (
                  <li key={item.to}>
                    <Link to={item.to} className="ft-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="ft-col">
              <h3 className="ft-title">Liên hệ</h3>
              <ul className="ft-contact">
                {CONTACT_ITEMS.map((item, i) => (
                  <li key={i} className="ft-contact-item">
                    <i className={item.icon} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom */}
          <div className="ft-bottom">
            <p>© {new Date().getFullYear()} Chợ Rẻ. All rights reserved.</p>
            <p>Academic project – Graduation Thesis, FPT Polytechnic.</p>
          </div>
        </div>
      </footer>
    </>
  );
}