import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner, faInbox, faSearch,
  faBoxOpen, faCalendar, faFileLines,
  faCheckCircle, faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .usm {
    --accent:       var(--primary-color);
    --accent-hover: var(--primary-color-hover);
    --border:       #e5e7eb;
    --bg:           #ffffff;
    --bg-sub:       #f9fafb;
    --bg-hover:     #fafafa;
    --text:         #111827;
    --text-sub:     #6b7280;
    --text-xs:      #9ca3af;
    --radius:       10px;
    --radius-sm:    6px;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --transition:   0.16s ease;
    --font:         'Inter', 'Segoe UI', sans-serif;
  }

  .usm { font-family: var(--font); color: var(--text); }

  /* ── Card ── */
  .usm-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;
  }

  /* ── Header ── */
  .usm-header {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    gap: 12px; padding: 16px 22px; border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
  }
  .usm-header-left  { display: flex; align-items: center; gap: 9px; }
  .usm-header-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .usm-title        { font-size: 14px; font-weight: 700; color: var(--text); }
  .usm-count {
    padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }

  /* ── Search ── */
  .usm-search-wrap  { position: relative; }
  .usm-search-icon  {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: var(--text-xs); font-size: 13px; pointer-events: none;
  }
  .usm-search {
    padding: 7px 12px 7px 32px; border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 13px; font-family: var(--font);
    background: var(--bg); color: var(--text); outline: none; width: 220px;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .usm-search:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.11); background: #fff;
  }

  /* ── Table ── */
  .usm-table-wrap { overflow-x: auto; }
  table.usm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .usm-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .usm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .usm-table td { padding: 13px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .usm-table tbody tr { transition: background var(--transition); }
  .usm-table tbody tr:hover { background: var(--bg-hover); }
  .usm-table tbody tr:last-child td { border-bottom: none; }

  /* User cell */
  .usm-user-cell  { display: flex; align-items: center; gap: 10px; }
  .usm-user-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #4ade80);
    color: #fff; font-size: 13px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid rgba(4,153,71,0.18);
  }
  .usm-user-name  { font-weight: 600; font-size: 13.5px; color: var(--text); }
  .usm-user-email { font-size: 11.5px; color: var(--text-xs); margin-top: 1px; }

  /* Plan cell */
  .usm-plan-name  { font-weight: 600; font-size: 13.5px; }
  .usm-plan-price { font-size: 12px; color: var(--accent); font-weight: 600; margin-top: 2px; }

  /* Date cell */
  .usm-date-start { font-size: 13px; color: var(--text); }
  .usm-date-arrow { font-size: 11px; color: var(--text-xs); margin: 2px 0; }
  .usm-date-end   { font-size: 13px; color: var(--text-sub); }

  /* Posts remaining */
  .usm-posts { display: flex; flex-direction: column; gap: 4px; }
  .usm-post-item {
    display: flex; align-items: center; gap: 6px; font-size: 12.5px;
  }
  .usm-post-label { color: var(--text-sub); }
  .usm-post-val   { font-weight: 700; color: var(--text); }
  .usm-post-bar-wrap {
    flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; min-width: 40px;
  }
  .usm-post-bar { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
  .usm-post-bar-plan { background: var(--accent); }
  .usm-post-bar-free { background: #93c5fd; }

  /* Status badge */
  .usm-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
  }
  .usm-status-active  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
  .usm-status-expired { background: #fff5f5; border: 1px solid #fecaca; color: #dc2626; }

  /* ── Mobile cards (≤ 680px) ── */
  @media (max-width: 680px) {
    .usm-table-wrap { display: none; }
    .usm-mobile-list { display: flex; flex-direction: column; }
    .usm-search { width: 100%; }
    .usm-search-wrap { width: 100%; }
    .usm-header { flex-direction: column; align-items: stretch; }
  }
  @media (min-width: 681px) { .usm-mobile-list { display: none; } }

  .usm-mobile-row {
    padding: 14px 16px; border-bottom: 1px solid #f3f4f6;
    display: flex; flex-direction: column; gap: 10px;
    transition: background var(--transition);
  }
  .usm-mobile-row:last-child { border-bottom: none; }
  .usm-mobile-row:hover { background: var(--bg-hover); }

  .usm-mobile-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .usm-mobile-user { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .usm-mobile-name { font-size: 13.5px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .usm-mobile-email { font-size: 12px; color: var(--text-xs); }

  .usm-mobile-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .usm-mobile-section { display: flex; flex-direction: column; gap: 3px; }
  .usm-mobile-section-label {
    font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
    color: var(--text-xs); display: flex; align-items: center; gap: 5px;
  }
  .usm-mobile-section-val { font-size: 13px; font-weight: 600; color: var(--text); }
  .usm-mobile-section-sub { font-size: 12px; color: var(--text-sub); }

  /* ── Empty / Loading ── */
  .usm-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 52px 24px; gap: 10px; color: var(--text-sub);
  }
  .usm-state-icon { font-size: 32px; opacity: 0.28; }
  .usm-state-text { font-size: 13.5px; font-weight: 500; }
  .usm-spinner { animation: usmSpin 0.8s linear infinite; }
  @keyframes usmSpin { to { transform: rotate(360deg); } }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join("").toUpperCase() || "?";

const fmtDate = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("vi-VN");
};

const fmtPrice = (n) =>
  Number(n).toLocaleString("vi-VN") + " đ";

/** Clamp a bar width 0–100% */
const barWidth = (val, max = 10) =>
  `${Math.min(100, Math.round((val / Math.max(max, 1)) * 100))}%`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function UserAvatar({ name }) {
  return (
    <div className="usm-user-avatar" title={name}>
      {getInitials(name)}
    </div>
  );
}

function StatusBadge({ active }) {
  return active
    ? <span className="usm-status usm-status-active"><FontAwesomeIcon icon={faCheckCircle} />Còn hiệu lực</span>
    : <span className="usm-status usm-status-expired"><FontAwesomeIcon icon={faTimesCircle} />Hết hạn</span>;
}

function PostsBars({ subPost, freePost, maxSub = 50, maxFree = 10 }) {
  return (
    <div className="usm-posts">
      <div className="usm-post-item">
        <span className="usm-post-label">Gói</span>
        <span className="usm-post-val">{subPost}</span>
        <div className="usm-post-bar-wrap">
          <div className="usm-post-bar usm-post-bar-plan" style={{ width: barWidth(subPost, maxSub) }} />
        </div>
      </div>
      <div className="usm-post-item">
        <span className="usm-post-label">Free</span>
        <span className="usm-post-val">{freePost}</span>
        <div className="usm-post-bar-wrap">
          <div className="usm-post-bar usm-post-bar-free" style={{ width: barWidth(freePost, maxFree) }} />
        </div>
      </div>
    </div>
  );
}

// ─── UserSubscriptionManager ──────────────────────────────────────────────────

export default function UserSubscriptionManager() {
  const [subs,     setSubs]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/user-subscriptions");
      setSubs(res.data);
      setFiltered(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearch = (q) => {
    const lower = q.toLowerCase();
    setFiltered(subs.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(lower) ||
        s.email?.toLowerCase().includes(lower) ||
        s.subPlanName?.toLowerCase().includes(lower)
    ));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="usm">
        <div className="usm-card">

          {/* Header */}
          <div className="usm-header">
            <div className="usm-header-left">
              <div className="usm-header-dot" />
              <span className="usm-title">Gói dịch vụ người dùng</span>
              {!loading && <span className="usm-count">{filtered.length} gói</span>}
            </div>

            <div className="usm-search-wrap">
              <FontAwesomeIcon icon={faSearch} className="usm-search-icon" />
              <input
                className="usm-search"
                type="text"
                placeholder="Tìm tên, email, gói dịch vụ…"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="usm-state">
              <FontAwesomeIcon icon={faSpinner} className="usm-state-icon usm-spinner" />
              <span className="usm-state-text">Đang tải…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="usm-state">
              <FontAwesomeIcon icon={faInbox} className="usm-state-icon" />
              <span className="usm-state-text">Không có dữ liệu</span>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="usm-table-wrap">
                <table className="usm-table">
                  <thead>
                    <tr>
                      <th>Người dùng</th>
                      <th>Gói dịch vụ</th>
                      <th>Thời hạn</th>
                      <th>Lượt đăng còn lại</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.userSubId}>
                        <td>
                          <div className="usm-user-cell">
                            <UserAvatar name={s.fullName} />
                            <div>
                              <div className="usm-user-name">{s.fullName}</div>
                              <div className="usm-user-email">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="usm-plan-name">{s.subPlanName}</div>
                          <div className="usm-plan-price">{fmtPrice(s.subPlanPrice)}</div>
                        </td>
                        <td>
                          <div className="usm-date-start">{fmtDate(s.startDate)}</div>
                          <div className="usm-date-arrow">→ {fmtDate(s.endDate)}</div>
                        </td>
                        <td>
                          <PostsBars
                            subPost={s.remainingSubPost}
                            freePost={s.remainingFreePost}
                          />
                        </td>
                        <td><StatusBadge active={s.isActive} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="usm-mobile-list">
                {filtered.map((s) => (
                  <div key={s.userSubId} className="usm-mobile-row">
                    {/* Top: user + status */}
                    <div className="usm-mobile-top">
                      <div className="usm-mobile-user">
                        <UserAvatar name={s.fullName} />
                        <div style={{ minWidth: 0 }}>
                          <div className="usm-mobile-name">{s.fullName}</div>
                          <div className="usm-mobile-email">{s.email}</div>
                        </div>
                      </div>
                      <StatusBadge active={s.isActive} />
                    </div>

                    {/* Details grid */}
                    <div className="usm-mobile-grid">
                      <div className="usm-mobile-section">
                        <div className="usm-mobile-section-label">
                          <FontAwesomeIcon icon={faBoxOpen} />
                          Gói dịch vụ
                        </div>
                        <div className="usm-mobile-section-val">{s.subPlanName}</div>
                        <div className="usm-mobile-section-sub">{fmtPrice(s.subPlanPrice)}</div>
                      </div>

                      <div className="usm-mobile-section">
                        <div className="usm-mobile-section-label">
                          <FontAwesomeIcon icon={faCalendar} />
                          Thời hạn
                        </div>
                        <div className="usm-mobile-section-val">{fmtDate(s.startDate)}</div>
                        <div className="usm-mobile-section-sub">→ {fmtDate(s.endDate)}</div>
                      </div>

                      <div className="usm-mobile-section" style={{ gridColumn: "1 / -1" }}>
                        <div className="usm-mobile-section-label">
                          <FontAwesomeIcon icon={faFileLines} />
                          Lượt đăng còn lại
                        </div>
                        <PostsBars
                          subPost={s.remainingSubPost}
                          freePost={s.remainingFreePost}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}