import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import api from "../api";

// ─── Config ───────────────────────────────────────────────────────────────────

const AVATAR_BASE = "https://api.chore123.cloud/uploads/";
const avatarUrl = (path) => `${AVATAR_BASE}${path}`;

const NAV_ITEMS = [
  { path: "/censor/post-censor", label: "Duyệt bài viết", icon: faClipboardCheck },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cl-root {
    --sidebar-w: 240px;
    --topbar-h:  60px;

    --sb-bg:      var(--primary-color);
    --sb-bg-dark: var(--primary-color-hover);
    --sb-hover:   rgba(255,255,255,0.08);
    --sb-active:  rgba(255,255,255,0.14);
    --sb-border:  rgba(255,255,255,0.10);
    --sb-text:    rgba(255,255,255,0.75);
    --sb-text-hi: var(--primary-color-text);
    --sb-accent:  var(--success);

    --bg-page:  whitesmoke;
    --bg-card:  #ffffff;
    --border:   #e2e8f0;

    --text-primary:   #0f172a;
    --text-secondary: #64748b;

    --radius-sm:  6px;
    --radius-md:  10px;

    --shadow-md:      0 4px 16px rgba(0,0,0,0.10);
    --shadow-sidebar: 4px 0 24px rgba(0,0,0,0.15);

    --font: 'Inter', 'Segoe UI', sans-serif;
    --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Shell ── */
  .cl-root {
    display: flex;
    min-height: 100dvh;
    background: var(--bg-page);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    color: var(--text-primary);
  }

  /* ═══════════════════════════════
     SIDEBAR
  ═══════════════════════════════ */
  .cl-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: var(--sidebar-w);
    background: var(--sb-bg);
    box-shadow: var(--shadow-sidebar);
    display: flex; flex-direction: column;
    z-index: 300;
    transition: transform var(--transition);
    overflow: hidden;
    will-change: transform;
  }

  /* Brand */
  .cl-brand {
    display: flex; align-items: center; gap: 10px;
    height: var(--topbar-h);
    padding: 0 20px;
    border-bottom: 1px solid var(--sb-border);
    text-decoration: none; flex-shrink: 0;
    transition: background var(--transition);
  }
  .cl-brand:hover { background: var(--sb-hover); }
  .cl-brand img {height: 120px; width: auto; display: block; margin:0 auto;}
  .cl-brand-badge {
    padding: 3px 8px; border-radius: var(--radius-sm);
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.20);
    color: #fff;
    font-size: 10px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
  }

  /* User card */
  .cl-user {
    display: flex; align-items: center; gap: 11px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--sb-border);
    flex-shrink: 0;
  }
  .cl-avatar {
    flex-shrink: 0; border-radius: 50%;
    object-fit: cover; display: block;
    border: 2px solid rgba(255,255,255,0.30);
  }
  .cl-avatar-fallback {
    flex-shrink: 0; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 2px solid rgba(255,255,255,0.20);
    color: #fff; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .cl-user-name { font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cl-user-role {
    display: inline-flex; align-items: center;
    margin-top: 3px;
    font-size: 10px; font-weight: 600; letter-spacing: .05em;
    color: whitesmoke;
    background: rgba(28,197,90,0.55);
    border: 1px solid rgba(34,197,94,0.22);
    padding: 1px 7px; border-radius: 999px;
  }

  /* Nav */
  .cl-nav { flex: 1; overflow-y: auto; padding: 10px 0; }
  .cl-nav::-webkit-scrollbar { width: 3px; }
  .cl-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  .cl-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px;
    text-decoration: none; font-size: 13px; font-weight: 500;
    color: var(--sb-text);
    position: relative;
    transition: color var(--transition), background var(--transition);
  }
  .cl-nav-link-icon { width: 16px; text-align: center; font-size: 14px; flex-shrink: 0; }
  .cl-nav-link:hover { color: #fff; background: var(--sb-hover); }
  .cl-nav-link--active {
    color: #fff; background: var(--sb-active); font-weight: 600;
  }
  .cl-nav-link--active::after {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 2px 2px 0;
    background: var(--sb-accent);
  }

  /* Footer */
  .cl-sidebar-foot {
    flex-shrink: 0; padding: 12px;
    border-top: 1px solid var(--sb-border);
  }
  .cl-logout-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 9px 14px; border-radius: var(--radius-md);
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.07);
    color: var(--sb-text); font-size: 13px; font-weight: 600;
    font-family: var(--font); cursor: pointer;
    transition: all var(--transition);
  }
  .cl-logout-btn:hover {
    background: rgba(223,15,15,0.12);
    border-color: rgba(223,15,15,0.28);
    color: #fca5a5;
  }

  /* ═══════════════════════════════
     TOPBAR (mobile)
  ═══════════════════════════════ */
  .cl-topbar {
    display: none;
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--topbar-h);
    background: var(--sb-bg);
    box-shadow: var(--shadow-md);
    z-index: 299;
    align-items: center; justify-content: space-between;
    padding: 0 14px;
  }
  .cl-topbar-menu-btn {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--radius-sm); color: #fff; font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all var(--transition); flex-shrink: 0;
  }
  .cl-topbar-menu-btn:hover { background: rgba(255,255,255,0.18); }
  .cl-topbar-logo img { height: 120px; width: auto; display: block; margin:0 auto;}
  .cl-topbar-user {
    display: flex; align-items: center; gap: 7px;
    padding: 4px 10px 4px 4px;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 999px;
  }
  .cl-topbar-name {
    font-size: 13px; font-weight: 600; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px;
  }

  /* ═══════════════════════════════
     BACKDROP
  ═══════════════════════════════ */
  .cl-backdrop {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.50);
    backdrop-filter: blur(2px);
    z-index: 298;
    animation: clFadeIn 0.18s ease;
  }
  @keyframes clFadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ═══════════════════════════════
     MAIN
  ═══════════════════════════════ */
  .cl-main { flex: 1; margin-left: var(--sidebar-w); min-width: 0; display: flex; flex-direction: column; }
  .cl-content { flex: 1; padding: 28px 32px; }

  /* ═══════════════════════════════
     RESPONSIVE
  ═══════════════════════════════ */
  @media (max-width: 900px) {
    .cl-sidebar       { transform: translateX(-100%); }
    .cl-sidebar--open { transform: translateX(0); }
    .cl-backdrop { display: block; }
    .cl-topbar   { display: flex; }
    .cl-main     { margin-left: 0; padding-top: var(--topbar-h); }
    .cl-content  { padding: 20px 18px; }
  }
  @media (max-width: 480px) {
    .cl-content { padding: 16px 14px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase() || "C";

// ─── Components ───────────────────────────────────────────────────────────────

function Avatar({ src, name, size = 34 }) {
  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <img
        src={avatarUrl(src)}
        alt={name}
        width={size}
        height={size}
        className="cl-avatar"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className="cl-avatar-fallback"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── CensorLayout ─────────────────────────────────────────────────────────────

export default function CensorLayout() {
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();
  const { pathname }     = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try { await api.post("/account/revoke-token"); } catch { /* noop */ }
    logout();
    navigate("/");
  };

  const closeSidebar  = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const firstName = user.fullName?.split(" ").pop() ?? "";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cl-root">

        {/* ── Mobile topbar ── */}
        <header className="cl-topbar" aria-label="Censor topbar">
          <button className="cl-topbar-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>

          <Link to="/" className="cl-topbar-logo">
            <img src="/logovientrang.png" alt="ChoRe" />
          </Link>

          <div className="cl-topbar-user">
            <Avatar src={user.avatar} name={user.fullName} size={28} />
            <span className="cl-topbar-name">{firstName}</span>
          </div>
        </header>

        {/* ── Backdrop ── */}
        {sidebarOpen && (
          <div className="cl-backdrop" onClick={closeSidebar} aria-hidden="true" />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`cl-sidebar${sidebarOpen ? " cl-sidebar--open" : ""}`}
          aria-label="Censor sidebar"
        >
          {/* Brand */}
          <Link to="/" className="cl-brand">
            <img src="/logovientrang.png" alt="ChoRe" />
            {/* <span className="cl-brand-badge">Censor</span> */}
          </Link>

          {/* User */}
          <div className="cl-user">
            <Avatar src={user.avatar} name={user.fullName} size={36} />
            <div style={{ minWidth: 0 }}>
              <div className="cl-user-name">{user.fullName}</div>
              <div className="cl-user-role">Kiểm duyệt</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="cl-nav" aria-label="Censor navigation">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`cl-nav-link${active ? " cl-nav-link--active" : ""}`}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={item.icon} className="cl-nav-link-icon" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="cl-sidebar-foot">
            <button className="cl-logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="cl-main">
          <div className="cl-content">
            <Outlet />
          </div>
        </main>

      </div>
    </>
  );
}