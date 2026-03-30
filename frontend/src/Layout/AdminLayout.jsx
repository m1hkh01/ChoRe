import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines, faUsers, faBox,
  faSignOutAlt, faChevronDown,
  faBars, faTimes, faGauge,
} from "@fortawesome/free-solid-svg-icons";
import api from "../api";

// ─── Config ───────────────────────────────────────────────────────────────────

const AVATAR_BASE = "https://api.chore123.cloud/uploads/";
const avatarUrl = (path) => `${AVATAR_BASE}${path}`;

const NAV_SECTIONS = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: faGauge,
    items: [
      { path: "/admin/dashboard", label: "Dashboard" },
    ],
  },
  {
    id: "content",
    label: "Nội dung",
    icon: faFileLines,
    items: [
      { path: "/admin/post-manager", label: "Quản lý bài viết" },
      { path: "/admin/category-manager", label: "Phân loại" },
      { path: "/admin/specification-manager", label: "Cấu hình phân loại" },
      { path: "/admin/brand-manager", label: "Quản lý hãng" },
      { path: "/admin/brand-category-manager", label: "Phân loại hãng" },
    ],
  },
  {
    id: "users",
    label: "Người dùng",
    icon: faUsers,
    items: [
      { path: "/admin/user-manager", label: "Quản lý tài khoản" },
      { path: "/admin/user-subscriptions", label: "Gói dịch vụ" },
    ],
  },
  {
    id: "services",
    label: "Dịch vụ",
    icon: faBox,
    items: [
      { path: "/admin/sub-manager", label: "Gói dịch vụ" },
      { path: "/admin/transaction-manager", label: "Giao dịch trung gian" },
    ],
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Layout-scoped tokens (extend index.css vars, never override them) ── */
  .al-root {
    --sidebar-w:  260px;
    --topbar-h:   60px;

    /* Derive sidebar bg from --primary-color (index.css) */
    --sb-bg:      var(--primary-color);
    /* Darker tint for depth — mix manually since we can't use color-mix in all targets */
    --sb-bg-dark: var(--primary-color-hover);

    --sb-hover:   rgba(255,255,255,0.08);
    --sb-active:  rgba(255,255,255,0.14);
    --sb-border:  rgba(255,255,255,0.10);
    --sb-text:    rgba(255,255,255,0.75);
    --sb-text-hi: var(--primary-color-text);

    /* Accent uses --success (index.css) for active/highlight dots */
    --sb-accent:  var(--success);

    /* Surface */
    --bg-page:    whitesmoke; /* matches body in index.css */
    --bg-card:    #ffffff;
    --border:     #e2e8f0;

    /* Text */
    --text-primary:   #0f172a;
    --text-secondary: #64748b;

    --radius-sm:  6px;
    --radius-md:  10px;

    --shadow-md:      0 4px 16px rgba(0,0,0,0.10);
    --shadow-sidebar: 4px 0 24px rgba(0,0,0,0.15);

    --font: 'Inter', 'Segoe UI', sans-serif; /* matches index.css * selector */
    --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Layout shell ── */
  .al-root {
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
  .al-sidebar {
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
  .al-brand {
    display: flex; align-items: center; gap: 10px;
    height: var(--topbar-h);
    padding: 0 20px;
    border-bottom: 1px solid var(--sb-border);
    text-decoration: none; flex-shrink: 0;
    transition: background var(--transition);
  }
  .al-brand:hover { background: var(--sb-hover); }
  .al-brand img { height: 120px; width: auto; display: block; margin:0 auto;}
  .al-brand-badge {
    padding: 3px 8px; border-radius: var(--radius-sm);
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.20);
    color: #fff;
    font-size: 15px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
  }

  /* User card */
  .al-user {
    display: flex; align-items: center; gap: 11px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--sb-border);
    flex-shrink: 0;
  }
  .al-avatar {
    flex-shrink: 0; border-radius: 50%;
    object-fit: cover; display: block;
    border: 2px solid rgba(255,255,255,0.30);
  }
  .al-avatar-fallback {
    flex-shrink: 0; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 2px solid rgba(255,255,255,0.20);
    color: #fff; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .al-user-name  { font-size: 15px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .al-user-role  {
    display: inline-flex; align-items: center;
    margin-top: 3px;
    font-size: 10px; font-weight: 600; letter-spacing: .05em;
    color: whitesmoke;
    background: rgba(28, 197, 90, 0.55);
    border: 1px solid rgba(34,197,94,0.22);
    padding: 1px 7px; border-radius: 999px;
  }

  /* Nav scroll area */
  .al-nav { flex: 1; overflow-y: auto; padding: 10px 0; }
  .al-nav::-webkit-scrollbar { width: 3px; }
  .al-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  /* Section toggle */
  .al-section { }
  .al-section-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 9px 16px;
    background: transparent; border: none;
    cursor: pointer; font-family: var(--font);
    color: var(--sb-text); font-size: 14px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase;
    transition: color var(--transition), background var(--transition);
    gap: 8px;
  }
  .al-section-btn:hover { color: var(--sb-text-hi); background: var(--sb-hover); }
  .al-section-btn--open { color: var(--sb-text-hi); }
  .al-section-left { display: flex; align-items: center; gap: 9px; }
  .al-section-icon { width: 16px; text-align: center; font-size: 15px; }
  .al-chevron {
    font-size: 14px; opacity: 0.6;
    transition: transform 0.22s ease, opacity var(--transition);
  }
  .al-section-btn--open .al-chevron { transform: rotate(180deg); opacity: 1; }

  /* Submenu */
  .al-sub {
    overflow: hidden;
    animation: subSlide 0.18s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes subSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .al-sub-link {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 16px 8px 42px;
    text-decoration: none; font-size: 15px; font-weight: 500;
    color: var(--sb-text);
    position: relative;
    transition: color var(--transition), background var(--transition);
    border-radius: 0;
  }
  .al-sub-link::before {
    content: '';
    position: absolute; left: 28px;
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(255,255,255,0.20);
    transition: background var(--transition), transform var(--transition);
  }
  .al-sub-link:hover {
    color: #fff; background: var(--sb-hover);
  }
  .al-sub-link:hover::before { background: var(--sb-accent); transform: scale(1.4); }
  .al-sub-link--active {
    color: #fff; background: var(--sb-active);
    font-weight: 600;
  }
  .al-sub-link--active::before { background: var(--sb-accent); }

  /* Active left-bar indicator */
  .al-sub-link--active::after {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 2px 2px 0;
    background: var(--sb-accent);
  }

  /* Sidebar footer */
  .al-sidebar-foot {
    flex-shrink: 0; padding: 12px;
    border-top: 1px solid var(--sb-border);
  }
  .al-logout-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 9px 14px; border-radius: var(--radius-md);
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.07);
    color: var(--sb-text); font-size: 15px; font-weight: 600;
    font-family: var(--font); cursor: pointer;
    transition: all var(--transition);
  }
  .al-logout-btn:hover {
    background: rgba(223,15,15,0.12);
    border-color: rgba(223,15,15,0.28);
    color: #fca5a5;
  }

  /* ═══════════════════════════════
     TOPBAR (mobile)
  ═══════════════════════════════ */
  .al-topbar {
    display: none;
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--topbar-h);
    background: var(--sb-bg);
    box-shadow: var(--shadow-md);
    z-index: 299;
    align-items: center; justify-content: space-between;
    padding: 0 14px;
  }
  .al-topbar-menu-btn {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--radius-sm); color: #fff; font-size: 20px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all var(--transition); flex-shrink: 0;
  }
  .al-topbar-menu-btn:hover { background: rgba(255,255,255,0.18); }
  .al-topbar-logo img { height: 120px; width: auto; display: block; margin:0 auto;}
  .al-topbar-user {
    display: flex; align-items: center; gap: 7px;
    padding: 4px 10px 4px 4px;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 999px;
  }
  .al-topbar-name {
    font-size: 15px; font-weight: 600; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px;
  }

  /* ═══════════════════════════════
     BACKDROP
  ═══════════════════════════════ */
  .al-backdrop {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.50);
    backdrop-filter: blur(2px);
    z-index: 298;
    animation: fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ═══════════════════════════════
     MAIN
  ═══════════════════════════════ */
  .al-main {
    flex: 1;
    margin-left: var(--sidebar-w);
    min-width: 0;
    display: flex; flex-direction: column;
  }
  .al-content {
    flex: 1;
    padding: 28px 32px;
  }

  /* ═══════════════════════════════
     RESPONSIVE
  ═══════════════════════════════ */
  @media (max-width: 900px) {
    .al-sidebar {
      transform: translateX(-100%);
    }
    .al-sidebar--open {
      transform: translateX(0);
    }
    .al-backdrop { display: block; }
    .al-topbar   { display: flex; }
    .al-main     { margin-left: 0; padding-top: var(--topbar-h); }
    .al-content  { padding: 20px 18px; }
  }

  @media (max-width: 480px) {
    .al-content { padding: 16px 14px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase() || "A";

// ─── Components ───────────────────────────────────────────────────────────────

function Avatar({ src, name, size = 34, className, fallbackClass }) {
  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <img
        src={avatarUrl(src)}
        alt={name}
        width={size}
        height={size}
        className={`al-avatar ${className ?? ""}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}  // ← thêm dòng này
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className={`al-avatar-fallback ${fallbackClass ?? ""}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {getInitials(name)}
    </div>
  );
}

function NavSection({ section, isOpen, onToggle, pathname, onLinkClick }) {
  return (
    <div className="al-section">
      <button
        className={`al-section-btn${isOpen ? " al-section-btn--open" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="al-section-left">
          <FontAwesomeIcon icon={section.icon} className="al-section-icon" />
          {section.label}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="al-chevron" />
      </button>

      {isOpen && (
        <div className="al-sub" role="menu">
          {section.items.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                role="menuitem"
                className={`al-sub-link${active ? " al-sub-link--active" : ""}`}
                onClick={onLinkClick}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-expand section containing the active route
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    NAV_SECTIONS.forEach((s) => {
      if (s.items.some((item) => pathname.startsWith(item.path))) init[s.id] = true;
    });
    return init;
  });

  // Close sidebar on navigation
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const toggleSection = useCallback(
    (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] })),
    []
  );

  const handleLogout = async () => {
    try { await api.post("/account/revoke-token"); } catch { /* noop */ }
    logout();
    navigate("/");
  };

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const firstName = user.fullName?.split(" ").pop() ?? "";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="al-root">

        {/* ── Mobile topbar ── */}
        <header className="al-topbar" aria-label="Admin topbar">
          <button className="al-topbar-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>

          <Link to="/" className="al-topbar-logo">
            <img src="/logovientrang.png" alt="ChoRe" />
          </Link>

          <div className="al-topbar-user">
            <Avatar src={user.avatar} name={user.fullName} size={28} />
            <span className="al-topbar-name">{firstName}</span>
          </div>
        </header>

        {/* ── Backdrop ── */}
        {sidebarOpen && (
          <div className="al-backdrop" onClick={closeSidebar} aria-hidden="true" />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`al-sidebar${sidebarOpen ? " al-sidebar--open" : ""}`}
          aria-label="Admin sidebar"
        >
          {/* Brand */}
          <Link to="/" className="al-brand">
            <img src="/logovientrang.png" alt="ChoRe" />
            {/* <span className="al-brand-badge">Admin</span> */}
          </Link>

          {/* User */}
          <div className="al-user">
            <Avatar src={user.avatar} name={user.fullName} size={36} />
            <div style={{ minWidth: 0 }}>
              <div className="al-user-name">{user.fullName}</div>
              <div className="al-user-role">Quản trị viên</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="al-nav" aria-label="Admin navigation">
            {NAV_SECTIONS.map((section) => (
              <NavSection
                key={section.id}
                section={section}
                isOpen={!!expanded[section.id]}
                onToggle={() => toggleSection(section.id)}
                pathname={pathname}
                onLinkClick={closeSidebar}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="al-sidebar-foot">
            <button className="al-logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="al-main">
          <div className="al-content">
            <Outlet />
          </div>
        </main>

      </div>
    </>
  );
}