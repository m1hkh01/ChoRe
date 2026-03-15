import { Link, Outlet, useLocation } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────

const MENU = [
  { label: "Giới thiệu",              path: "/about" },
  { label: "Liên hệ",                 path: "/contact" },
  { label: "Trung tâm trợ giúp",      path: "/helpcenter" },
  { label: "Phương thức thanh toán",   path: "/payment" },
  { label: "Điều khoản sử dụng",       path: "/terms" },
  { label: "Chính sách bảo mật",       path: "/privacy" },
  { label: "Giải quyết tranh chấp",    path: "/ds" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .hl {
    background: #f1f5f9;
    min-height: 100vh;
    padding: 36px 20px 60px;
  }

  .hl-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  /* ── Sidebar ── */
  .hl-sidebar {
    width: 220px;
    flex-shrink: 0;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px 16px;
    position: sticky;
    top: 80px;
  }

  .hl-sidebar-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
    margin: 0 0 14px 4px;
  }

  .hl-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hl-link {
    display: block;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    text-decoration: none;
    transition: background 0.12s, color 0.12s;
    border-left: 3px solid transparent;
  }

  .hl-link:hover { background: #f8fafc; color: #0f172a; }

  .hl-link.on {
    background: #f0fdf4;
    color: #16a34a;
    font-weight: 600;
    border-left-color: #22c55e;
  }

  /* ── Content ── */
  .hl-content {
    flex: 1;
    min-width: 0;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 28px 32px;
  }

  /* ── Mobile nav (top bar) ── */
  .hl-mobile-nav {
    display: none;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 2px;
    scrollbar-width: none;
    margin-bottom: 16px;
  }
  .hl-mobile-nav::-webkit-scrollbar { display: none; }

  .hl-mobile-link {
    flex-shrink: 0;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.15s;
  }
  .hl-mobile-link:hover { border-color: #22c55e; color: #16a34a; }
  .hl-mobile-link.on    { background: #22c55e; border-color: #22c55e; color: #fff; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hl          { padding: 20px 12px 48px; }
    .hl-sidebar  { display: none; }
    .hl-mobile-nav { display: flex; }
    .hl-content  { padding: 20px 16px; border-radius: 12px; }
    .hl-inner    { flex-direction: column; gap: 0; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HelpLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <style>{CSS}</style>
      <div className="hl">

        {/* Mobile: horizontal scroll chips */}
        <div className="hl-mobile-nav">
          {MENU.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`hl-mobile-link ${pathname === item.path ? "on" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hl-inner">

          {/* Sidebar — desktop only */}
          <aside className="hl-sidebar">
            <p className="hl-sidebar-title">Quy định chung</p>
            <nav className="hl-nav">
              {MENU.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hl-link ${pathname === item.path ? "on" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="hl-content">
            <Outlet />
          </main>

        </div>
      </div>
    </>
  );
}