import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock, faLockOpen, faTrash, faSpinner,
  faUsers, faXmark, faTriangleExclamation,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import api, { API_BASE_URL } from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .um {
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
    --shadow-md:    0 4px 20px rgba(0,0,0,0.10);
    --transition:   0.16s ease;
    --font:         'Inter', 'Segoe UI', sans-serif;
  }

  .um { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 0; }

  /* ── Card ── */
  .um-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;
  }

  /* ── Header ── */
  .um-header {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    gap: 12px; padding: 16px 22px; border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
  }
  .um-header-left { display: flex; align-items: center; gap: 9px; }
  .um-header-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .um-title       { font-size: 14px; font-weight: 700; color: var(--text); }
  .um-count {
    padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }

  /* ── Search ── */
  .um-search-wrap { position: relative; flex-shrink: 0; }
  .um-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: var(--text-xs); font-size: 13px; pointer-events: none;
  }
  .um-search {
    padding: 7px 12px 7px 32px; border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 13px; font-family: var(--font);
    background: var(--bg); color: var(--text); outline: none; width: 220px;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .um-search:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.11); background: #fff;
  }

  /* ── Table ── */
  .um-table-wrap { overflow-x: auto; }
  table.um-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .um-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .um-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .um-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .um-table tbody tr { transition: background var(--transition); }
  .um-table tbody tr:hover { background: var(--bg-hover); }
  .um-table tbody tr:last-child td { border-bottom: none; }

  /* User cell */
  .um-user-cell { display: flex; align-items: center; gap: 10px; }
  .um-avatar {
    width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
    border: 2px solid var(--border);
  }
  .um-avatar-fallback {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #4ade80);
    color: #fff; font-size: 13px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid rgba(4,153,71,0.2);
  }
  .um-fullname { font-weight: 600; font-size: 13.5px; color: var(--text); }
  .um-userid   { font-size: 11.5px; color: var(--text-xs); margin-top: 1px; }

  /* Role badge */
  .um-role {
    display: inline-flex; padding: 3px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
  }
  .um-role-admin  { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
  .um-role-censor { background: #faf5ff; border: 1px solid #e9d5ff; color: #7c3aed; }
  .um-role-user   { background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub); }

  /* Status badge */
  .um-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600;
  }
  .um-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .um-status-active   { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
  .um-status-active .um-status-dot   { background: #22c55e; }
  .um-status-locked   { background: #fff5f5; border: 1px solid #fecaca; color: #dc2626; }
  .um-status-locked .um-status-dot   { background: #ef4444; }

  /* Actions */
  .um-actions { display: flex; gap: 6px; }
  .um-btn-icon {
    width: 31px; height: 31px; border-radius: var(--radius-sm);
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid transparent; font-size: 12px; cursor: pointer;
    transition: all var(--transition);
  }
  .um-btn-lock   { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .um-btn-lock:hover   { background: #fef3c7; }
  .um-btn-unlock { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
  .um-btn-unlock:hover { background: #dcfce7; }
  .um-btn-del    { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .um-btn-del:hover    { background: #fee2e2; }

  /* ── Mobile cards (≤ 640px) ── */
  @media (max-width: 640px) {
    .um-table-wrap { display: none; }
    .um-mobile-list { display: flex; flex-direction: column; }
    .um-search { width: 100%; }
    .um-search-wrap { width: 100%; }
    .um-header { flex-direction: column; align-items: stretch; }
  }
  @media (min-width: 641px) { .um-mobile-list { display: none; } }

  .um-mobile-row {
    display: flex; align-items: center; gap: 12px; padding: 13px 16px;
    border-bottom: 1px solid #f3f4f6; transition: background var(--transition);
  }
  .um-mobile-row:last-child { border-bottom: none; }
  .um-mobile-row:hover { background: var(--bg-hover); }
  .um-mobile-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .um-mobile-top  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .um-mobile-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .um-mobile-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .um-mobile-phone { font-size: 12px; color: var(--text-xs); }
  .um-mobile-actions { display: flex; gap: 6px; flex-shrink: 0; }

  /* ── Error banner ── */
  .um-error {
    display: flex; align-items: center; gap: 8px; padding: 10px 16px;
    background: #fff5f5; border: 1px solid #fecaca; border-radius: var(--radius-sm);
    font-size: 13px; color: #dc2626; margin-bottom: 16px;
  }

  /* ── Empty / Loading ── */
  .um-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 52px 24px; gap: 10px; color: var(--text-sub);
  }
  .um-state-icon { font-size: 32px; opacity: 0.28; }
  .um-state-text { font-size: 13.5px; font-weight: 500; }
  .um-spinner { animation: umSpin 0.8s linear infinite; }
  @keyframes umSpin { to { transform: rotate(360deg); } }

  /* ═══════════════════════════════
     LOCK MODAL
  ═══════════════════════════════ */
  .um-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45); backdrop-filter: blur(3px);
    z-index: 1800; display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: umFade 0.15s ease;
  }
  @keyframes umFade { from { opacity: 0; } to { opacity: 1; } }

  .um-modal {
    background: #fff; border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.20);
    width: 100%; max-width: 420px; overflow: hidden;
    animation: umSlide 0.2s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes umSlide {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .um-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border);
  }
  .um-modal-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 700; color: var(--text);
  }
  .um-modal-title-icon { color: #b45309; }
  .um-modal-close {
    width: 30px; height: 30px; border-radius: var(--radius-sm);
    background: #f3f4f6; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-sub); font-size: 13px; transition: background var(--transition);
  }
  .um-modal-close:hover { background: #e5e7eb; }

  .um-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

  .um-modal-user {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--bg-sub); border: 1px solid var(--border); border-radius: var(--radius-sm);
  }
  .um-modal-user-name  { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .um-modal-user-id    { font-size: 11.5px; color: var(--text-xs); }

  .um-modal-label {
    font-size: 11.5px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-sub); margin-bottom: 6px; display: block;
  }
  .um-modal-label span { color: #dc2626; margin-left: 2px; }
  .um-modal-textarea {
    width: 100%; padding: 9px 12px; border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 13px; font-family: var(--font);
    color: var(--text); background: var(--bg-sub); outline: none; resize: vertical; min-height: 90px;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .um-modal-textarea:focus {
    border-color: #b45309; box-shadow: 0 0 0 3px rgba(180,83,9,0.10); background: #fff;
  }

  .um-modal-footer {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 14px 20px; border-top: 1px solid var(--border); background: var(--bg-sub);
  }
  .um-modal-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; border: 1px solid transparent; transition: all var(--transition);
  }
  .um-modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .um-modal-btn-cancel {
    background: #f3f4f6; border-color: var(--border); color: var(--text-sub);
  }
  .um-modal-btn-cancel:hover:not(:disabled) { background: #e5e7eb; }
  .um-modal-btn-lock {
    background: #b45309; border-color: #b45309; color: #fff;
  }
  .um-modal-btn-lock:hover:not(:disabled) { background: #92400e; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join("").toUpperCase() || "?";

function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      <img
        className="um-avatar"
        src={`${API_BASE_URL}/uploads/${src}`}
        alt={name}
        width={size} height={size}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className="um-avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.37 }}>
      {getInitials(name)}
    </div>
  );
}

function RoleBadge({ role }) {
  const cls = role?.toLowerCase() === "admin" ? "um-role-admin"
    : role?.toLowerCase() === "censor" ? "um-role-censor"
      : "um-role-user";
  return <span className={`um-role ${cls}`}>{role}</span>;
}

function StatusBadge({ locked }) {
  return locked
    ? <span className="um-status um-status-locked"><span className="um-status-dot" />Đã khoá</span>
    : <span className="um-status um-status-active"><span className="um-status-dot" />Hoạt động</span>;
}

// ─── LockModal ────────────────────────────────────────────────────────────────

function LockModal({ user, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    try { await onConfirm(reason); }
    finally { setLoading(false); }
  };

  return (
    <div className="um-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="um-modal" role="dialog" aria-modal="true">
        <div className="um-modal-header">
          <div className="um-modal-title">
            <FontAwesomeIcon icon={faTriangleExclamation} className="um-modal-title-icon" />
            Khoá tài khoản
          </div>
          <button className="um-modal-close" onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>

        <div className="um-modal-body">
          <div className="um-modal-user">
            <Avatar src={user.avatar} name={user.fullName} size={34} />
            <div>
              <div className="um-modal-user-name">{user.fullName}</div>
              <div className="um-modal-user-id">ID: {user.userId}</div>
            </div>
          </div>

          <div>
            <label className="um-modal-label">Lý do khoá <span>*</span></label>
            <textarea
              className="um-modal-textarea"
              placeholder="Nhập lý do khoá tài khoản…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="um-modal-footer">
          <button className="um-modal-btn um-modal-btn-cancel" onClick={onClose} disabled={loading}>
            Huỷ
          </button>
          <button
            className="um-modal-btn um-modal-btn-lock"
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
          >
            {loading
              ? <FontAwesomeIcon icon={faSpinner} className="um-spinner" />
              : <FontAwesomeIcon icon={faLock} />
            }
            Khoá tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UserManager ──────────────────────────────────────────────────────────────

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lockUser, setLockUser] = useState(null);  // user to lock

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
      setFiltered(res.data);
    } catch {
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearch = (q) => {
    const lower = q.toLowerCase();
    setFiltered(users.filter(
      (u) => u.fullName?.toLowerCase().includes(lower) || u.phoneNumber?.includes(lower)
    ));
  };

  // ── Lock / Unlock ─────────────────────────────────────────────────────────

  const handleLockToggle = async (user) => {
    if (user.isLocked) {
      try {
        await api.patch(`/api/admin/users/${user.userId}/unlock`);
        await loadUsers();
      } catch {
        alert("Không thể mở khoá tài khoản");
      }
    } else {
      setLockUser(user);
    }
  };

  const handleLockConfirm = async (reason) => {
    await api.patch(`/api/admin/users/${lockUser.userId}/lock`, { lockReason: reason });
    setLockUser(null);
    await loadUsers();
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá người dùng này?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      await loadUsers();
    } catch {
      alert("Xoá người dùng thất bại");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const ActionButtons = ({ user }) => (
    <div className="um-actions">
      <button
        className="um-btn-icon um-btn-del"
        title="Xoá người dùng"
        onClick={() => handleDelete(user.userId)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      {/* Ẩn nút khóa nếu là Admin */}
      {user.roleName?.toLowerCase() !== "admin" && (
        <button
          className={`um-btn-icon ${user.isLocked ? "um-btn-unlock" : "um-btn-lock"}`}
          title={user.isLocked ? "Mở khoá" : "Khoá tài khoản"}
          onClick={() => handleLockToggle(user)}
        >
          <FontAwesomeIcon icon={user.isLocked ? faLockOpen : faLock} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {error && (
        <div className="um-error">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {error}
        </div>
      )}

      <div className="um">
        <div className="um-card">

          {/* Header */}
          <div className="um-header">
            <div className="um-header-left">
              <div className="um-header-dot" />
              <span className="um-title">Quản lý người dùng</span>
              {!loading && <span className="um-count">{filtered.length} người dùng</span>}
            </div>

            <div className="um-search-wrap">
              <FontAwesomeIcon icon={faSearch} className="um-search-icon" />
              <input
                className="um-search"
                type="text"
                placeholder="Tìm tên hoặc số điện thoại…"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="um-state">
              <FontAwesomeIcon icon={faSpinner} className="um-state-icon um-spinner" />
              <span className="um-state-text">Đang tải…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="um-state">
              <FontAwesomeIcon icon={faUsers} className="um-state-icon" />
              <span className="um-state-text">Không có người dùng nào</span>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="um-table-wrap">
                <table className="um-table">
                  <thead>
                    <tr>
                      <th>Người dùng</th>
                      <th>Vai trò</th>
                      <th>Số điện thoại</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.userId}>
                        <td>
                          <div className="um-user-cell">
                            <Avatar src={u.avatar} name={u.fullName} />
                            <div>
                              <div className="um-fullname">{u.fullName}</div>
                              <div className="um-userid">#{u.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td><RoleBadge role={u.roleName} /></td>
                        <td style={{ color: "var(--text-sub)", fontSize: 13 }}>{u.phoneNumber || "—"}</td>
                        <td><StatusBadge locked={u.isLocked} /></td>
                        <td><ActionButtons user={u} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="um-mobile-list">
                {filtered.map((u) => (
                  <div key={u.userId} className="um-mobile-row">
                    <Avatar src={u.avatar} name={u.fullName} size={40} />
                    <div className="um-mobile-info">
                      <div className="um-mobile-top">
                        <span className="um-mobile-name">{u.fullName}</span>
                        <RoleBadge role={u.roleName} />
                      </div>
                      <div className="um-mobile-meta">
                        <StatusBadge locked={u.isLocked} />
                        {u.phoneNumber && <span className="um-mobile-phone">{u.phoneNumber}</span>}
                      </div>
                    </div>
                    <div className="um-mobile-actions">
                      <ActionButtons user={u} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lock modal */}
      {lockUser && (
        <LockModal
          user={lockUser}
          onConfirm={handleLockConfirm}
          onClose={() => setLockUser(null)}
        />
      )}
    </>
  );
}