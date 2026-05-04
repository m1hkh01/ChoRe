import { useEffect, useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faSpinner, faInbox,
  faEye, faXmark, faChevronLeft, faChevronRight,
  faCheckCircle, faTimesCircle, faHourglassHalf,
  faMoneyBillWave, faUser, faCalendar, faHashtag,
  faChevronDown,
  faMoneyBillTransfer,
  faCircleXmark,
  faTriangleExclamation,
  faMoneyBill,
  faLink,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .et {
    --accent:       var(--primary-color);
    --accent-hover: #1a6438;
    --preview:      var(--preview, #2196f3);
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

  .et { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 16px; }

  /* ── Card ── */
  .et-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;
  }
  .et-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    background: var(--bg-sub); flex-wrap: wrap; justify-content: space-between;
  }
  .et-card-header-left { display: flex; align-items: center; gap: 9px; }
  .et-card-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .et-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .et-count {
    padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }

  /* ══════════════════════════════
     FILTER
  ══════════════════════════════ */
  .et-filter { padding: 16px 20px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }

  .et-filter-field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 160px; }
  .et-filter-label {
    font-size: 11px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-xs);
  }
  .et-filter-input,
  .et-filter-select {
    padding: 8px 12px; border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 13px;
    font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  }
  .et-filter-input:focus,
  .et-filter-select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.10); background: #fff;
  }
  .et-filter-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px;
  }

  .et-filter-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    background: var(--accent); border: 1px solid var(--accent); color: #fff;
    cursor: pointer; transition: all var(--transition); align-self: flex-end;
  }
  .et-filter-btn:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
  .et-filter-reset {
    background: var(--bg-sub); border-color: var(--border); color: var(--text-sub);
  }
  .et-filter-reset:hover { background: #e5e7eb; }

  /* ══════════════════════════════
     TABLE
  ══════════════════════════════ */
  .et-table-wrap { overflow-x: auto; }
  table.et-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .et-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .et-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .et-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .et-table tbody tr { transition: background var(--transition); }
  .et-table tbody tr:hover { background: var(--bg-hover); }
  .et-table tbody tr:last-child td { border-bottom: none; }

  /* Cells */
  .et-txid { font-size: 12px; color: var(--text-xs); font-variant-numeric: tabular-nums; }
  .et-user-cell { display: flex; flex-direction: column; gap: 1px; }
  .et-user-name { font-weight: 600; font-size: 13.5px; }
  .et-user-email { font-size: 11.5px; color: var(--text-xs); }
  .et-amount { font-size: 13.5px; font-weight: 700; color: var(--accent); white-space: nowrap; }
  .et-date { font-size: 12.5px; color: var(--text-sub); white-space: nowrap; }

  /* Status badge */
  .et-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
  }
  .et-status-pending  { background: #fffbeb; border: 1px solid #fde68a; color: #b45309; }
  .et-status-success  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
  .et-status-failed   { background: #fff5f5; border: 1px solid #fecaca; color: #dc2626; }
  .et-status-default  { background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub); }
  .et-status-disputed { background: #fffbeb; border: 1px solid #fde68a; color: #b45309; }
  .et-status-refunded { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }

  /* Preview button */
  .et-btn-preview {
    width: 30px; height: 30px; border-radius: var(--radius-sm);
    background: #eff6ff; border: 1px solid #bfdbfe; color: var(--preview);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; cursor: pointer; transition: all var(--transition);
  }
  .et-btn-preview:hover { background: #dbeafe; }

  /* ══════════════════════════════
     MOBILE CARDS (≤ 640px)
  ══════════════════════════════ */
  @media (max-width: 640px) {
    .et-table-wrap { display: none; }
    .et-mobile-list { display: flex; flex-direction: column; }
    .et-filter { flex-direction: column; }
    .et-filter-field { min-width: unset; width: 100%; }
    .et-filter-btn { width: 100%; justify-content: center; }
  }
  @media (min-width: 641px) { .et-mobile-list { display: none; } }

  .et-mobile-row {
    padding: 13px 16px; border-bottom: 1px solid #f3f4f6;
    display: flex; flex-direction: column; gap: 8px;
    transition: background var(--transition);
  }
  .et-mobile-row:last-child { border-bottom: none; }
  .et-mobile-row:hover { background: var(--bg-hover); }
  .et-mobile-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .et-mobile-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .et-mobile-meta { display: flex; flex-wrap: wrap; gap: 8px; }
  .et-mobile-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--text-sub);
  }
  .et-mobile-meta-item svg { font-size: 10px; color: var(--text-xs); }

  /* ══════════════════════════════
     PAGINATION
  ══════════════════════════════ */
  .et-pagination {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px; padding: 14px 20px;
    border-top: 1px solid var(--border); background: var(--bg-sub);
  }
  .et-page-info { font-size: 12.5px; color: var(--text-sub); }
  .et-page-info strong { color: var(--text); }
  .et-page-btns { display: flex; align-items: center; gap: 4px; }
  .et-page-btn {
    min-width: 32px; height: 32px; padding: 0 8px;
    border-radius: var(--radius-sm); border: 1px solid var(--border);
    background: var(--bg); color: var(--text-sub); font-size: 13px; font-weight: 500;
    font-family: var(--font); cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
  }
  .et-page-btn:hover:not(:disabled) { background: var(--bg-hover); border-color: #d1d5db; }
  .et-page-btn--active { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 700; }
  .et-page-btn--active:hover { background: var(--accent-hover); }
  .et-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .et-page-dots { color: var(--text-xs); font-size: 13px; padding: 0 4px; }

  /* ══════════════════════════════
     EMPTY / LOADING
  ══════════════════════════════ */
  .et-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 52px 24px; gap: 10px; color: var(--text-sub);
  }
  .et-state-icon { font-size: 32px; opacity: 0.28; }
  .et-state-text { font-size: 13.5px; font-weight: 500; }
  .et-spinner { animation: etSpin 0.8s linear infinite; }
  @keyframes etSpin { to { transform: rotate(360deg); } }

  /* ══════════════════════════════
     PREVIEW MODAL
  ══════════════════════════════ */
  .et-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.48); backdrop-filter: blur(3px);
    z-index: 1800; display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: etFade 0.16s ease;
  }
  @keyframes etFade { from { opacity: 0; } to { opacity: 1; } }

  .et-modal {
    background: #fff; border-radius: 14px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.20);
    width: 100%; max-width: 520px;
    max-height: calc(100dvh - 32px);
    display: flex; flex-direction: column; overflow: hidden;
    animation: etSlide 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes etSlide {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .et-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .et-modal-title { font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .et-modal-title-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--preview); }
  .et-modal-close {
    width: 30px; height: 30px; border-radius: var(--radius-sm);
    background: #f3f4f6; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-sub); font-size: 13px; transition: background var(--transition);
  }
  .et-modal-close:hover { background: #e5e7eb; }

  .et-modal-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 6px; }
  .et-modal-body::-webkit-scrollbar { width: 3px; }
  .et-modal-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

  .et-detail-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #f9fafb;
  }
  .et-detail-row:last-child { border-bottom: none; }
  .et-detail-icon { width: 32px; height: 32px; border-radius: var(--radius-sm); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .et-detail-icon-blue   { background: #eff6ff; color: #2563eb; }
  .et-detail-icon-green  { background: #f0fdf4; color: #15803d; }
  .et-detail-icon-yellow { background: #fffbeb; color: #b45309; }
  .et-detail-icon-gray   { background: #f3f4f6; color: #6b7280; }

  .et-detail-content { flex: 1; min-width: 0; }
  .et-detail-label { font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--text-xs); margin-bottom: 3px; }
  .et-detail-value { font-size: 14px; font-weight: 500; color: var(--text); word-break: break-all; }
  .et-detail-value-accent { color: var(--accent); font-weight: 700; }

  .et-modal-footer {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 14px 20px; border-top: 1px solid var(--border);
    background: var(--bg-sub); flex-shrink: 0;
  }
  .et-modal-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; border: 1px solid transparent; transition: all var(--transition);
  }
  .et-modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .et-modal-btn-close   { background: #f3f4f6; border-color: var(--border); color: var(--text-sub); }
  .et-modal-btn-close:hover:not(:disabled) { background: #e5e7eb; }
  .et-modal-btn-success { background: var(--accent); border-color: var(--accent); color: #fff; }
  .et-modal-btn-success:hover:not(:disabled) { background: #16a34a; }
  .et-modal-btn-danger  { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .et-modal-btn-danger:hover:not(:disabled) { background: #fee2e2; }

  /* ══════════════════════════════
     DISPUTE EVIDENCE SECTION
  ══════════════════════════════ */
  .et-dispute-section {
    padding: 12px 0; border-top: 2px solid #f3f4f6; margin-top: 8px;
  }
  .et-dispute-title {
    font-size: 12px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: #b45309; margin-bottom: 10px;
    display: flex; align-items: center; gap: 5px;
  }
  .et-dispute-reason {
    padding: 10px 12px; background: #fffbeb; border-left: 3px solid #fde68a;
    border-radius: 4px; font-size: 13px; color: var(--text); line-height: 1.5;
    margin-bottom: 10px;
  }
  .et-evidence-list { display: flex; flex-direction: column; gap: 8px; }
  .et-evidence-item {
    padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 6px; display: flex; gap: 10px; align-items: flex-start;
  }
  .et-evidence-icon {
    width: 28px; height: 28px; border-radius: 4px; background: #eff6ff;
    color: #2563eb; display: flex; align-items: center; justify-content: center;
    font-size: 12px; flex-shrink: 0;
  }
  .et-evidence-content { flex: 1; min-width: 0; }
  .et-evidence-submitter { font-size: 11px; color: var(--text-xs); margin-bottom: 6px; padding: 4px 0; }
  .et-evidence-submitter-type { font-weight: 600; color: var(--text-sub); }
  .et-evidence-desc { font-size: 12px; color: var(--text); font-weight: 500; margin-bottom: 4px; }
  .et-evidence-link {
    display: inline-flex; align-items: center; gap: 4px; font-size: 11px;
    color: #2563eb; text-decoration: none; word-break: break-all;
  }
  .et-evidence-link:hover { text-decoration: underline; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

const fmtMoney = (n) => Number(n ?? 0).toLocaleString("vi-VN") + " đ";
const fmtDate = (str) => {
  if (!str) return "—";
  const iso = str.endsWith("Z") ? str : str + "Z";
  return new Date(iso).toLocaleDateString("vi-VN");
};

const STATUS_MAP = {
  PENDINGPAYMENT: { label: "Chờ thanh toán", cls: "et-status-pending", icon: faHourglassHalf },
  PAID: { label: "Đã thanh toán", cls: "et-status-success", icon: faMoneyBill },
  COMPLETED: { label: "Hoàn thành", cls: "et-status-success", icon: faCheckCircle },
  CANCELLED: { label: "Thất bại", cls: "et-status-failed", icon: faCircleXmark },
  REFUNDED: { label: "Đã hoàn tiền", cls: "et-status-refunded", icon: faMoneyBillTransfer },
  DISPUTING: { label: "Tranh chấp", cls: "et-status-disputed", icon: faTriangleExclamation },
  REFUNDREQUESTED: { label: "Yêu cầu hoàn tiền", cls: "et-status-default", icon: faHourglassHalf },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toUpperCase()] ?? { label: status, cls: "et-status-default", icon: faHourglassHalf };
  return (
    <span className={`et-status ${s.cls}`}>
      <FontAwesomeIcon icon={s.icon} />
      {s.label}
    </span>
  );
}

// ─── Pagination hook ──────────────────────────────────────────────────────────

function usePagination(total, perPage = ITEMS_PER_PAGE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Reset to page 1 if total changes
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  const paginated = (data) => data.slice((page - 1) * perPage, page * perPage);

  return { page, setPage, totalPages, visiblePages, paginated };
}

// ─── EscrowFilter ─────────────────────────────────────────────────────────────

function EscrowFilter({ filter, onChange, onSearch }) {
  const [local, setLocal] = useState(filter);
  const set = (k, v) => setLocal((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="et-filter">
      <div className="et-filter-field">
        <label className="et-filter-label">Mã giao dịch / người dùng</label>
        <input
          className="et-filter-input"
          placeholder="Tìm kiếm…"
          value={local.keyword ?? ""}
          onChange={(e) => set("keyword", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(local)}
        />
      </div>

      <div className="et-filter-field">
        <label className="et-filter-label">Trạng thái</label>
        <select
          className="et-filter-select"
          value={local.status ?? ""}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="">Tất cả</option>
          {
            STATUS_MAP && Object.entries(STATUS_MAP).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))
          }
        </select>
      </div>

      <div className="et-filter-field">
        <label className="et-filter-label">Từ ngày</label>
        <input
          className="et-filter-input"
          type="date"
          value={local.fromDate ?? ""}
          onChange={(e) => set("fromDate", e.target.value)}
        />
      </div>

      <div className="et-filter-field">
        <label className="et-filter-label">Đến ngày</label>
        <input
          className="et-filter-input"
          type="date"
          value={local.toDate ?? ""}
          onChange={(e) => set("toDate", e.target.value)}
        />
      </div>

      <button className="et-filter-btn" onClick={() => onSearch(local)}>
        <FontAwesomeIcon icon={faSearch} />
        Tìm
      </button>
      <button className="et-filter-btn et-filter-reset" onClick={() => { setLocal({}); onSearch({}); }}>
        <FontAwesomeIcon icon={faXmark} />
        Xoá
      </button>
    </div>
  );
}

// ─── EscrowPreviewModal ───────────────────────────────────────────────────────

function EscrowPreviewModal({ tx, onClose, onReload }) {
  const [acting, setActing] = useState(false);

  const handleAction = async (endpoint) => {
    setActing(true);
    try {
      await api.patch(`/api/admin/transactions/${tx.transactionId}/${endpoint}`);
      onClose();
      onReload();
    } catch (err) {
      alert(err.response?.data ?? "Có lỗi xảy ra");
    } finally {
      setActing(false);
    }
  };
  const isPending = tx.status?.toUpperCase() === "DISPUTING";

  const details = [
    { icon: faHashtag, iconCls: "et-detail-icon-gray", label: "Mã giao dịch", value: tx.transactionId, monospace: true },
    { icon: faUser, iconCls: "et-detail-icon-blue", label: "Người mua", value: tx.buyerName ?? tx.userName ?? "—" },
    { icon: faUser, iconCls: "et-detail-icon-blue", label: "Người bán", value: tx.sellerName ?? "—" },
    { icon: faMoneyBillWave, iconCls: "et-detail-icon-green", label: "Số tiền", value: fmtMoney(tx.amount), accent: true },
    { icon: faCalendar, iconCls: "et-detail-icon-yellow", label: "Thời gian", value: fmtDate(tx.createAt) },
  ];

  return (
    <div className="et-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="et-modal" role="dialog" aria-modal="true">

        <div className="et-modal-header">
          <div className="et-modal-title">
            <div className="et-modal-title-dot" />
            Chi tiết giao dịch
          </div>
          <button className="et-modal-close" onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>

        <div className="et-modal-body">
          {/* Status row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0 12px", borderBottom: "1px solid #f3f4f6", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text-sub)", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".05em" }}>Trạng thái</span>
            <StatusBadge status={tx.status} />
          </div>

          {details.map((d, i) => (
            <div key={i} className="et-detail-row">
              <div className={`et-detail-icon ${d.iconCls}`}>
                <FontAwesomeIcon icon={d.icon} />
              </div>
              <div className="et-detail-content">
                <div className="et-detail-label">{d.label}</div>
                <div className={`et-detail-value${d.accent ? " et-detail-value-accent" : ""}`}
                  style={d.monospace ? { fontFamily: "monospace", fontSize: 13 } : {}}>
                  {d.value}
                </div>
              </div>
            </div>
          ))}

          {tx.description && (
            <div className="et-detail-row">
              <div className="et-detail-icon et-detail-icon-gray">
                <FontAwesomeIcon icon={faFilter} />
              </div>
              <div className="et-detail-content">
                <div className="et-detail-label">Mô tả</div>
                <div className="et-detail-value" style={{ lineHeight: 1.6 }}>{tx.description}</div>
              </div>
            </div>
          )}

          {/* Dispute Evidence Section */}
          {isPending && tx.disEvidence && tx.disEvidence.length > 0 && (
            <div className="et-dispute-section">
              <div className="et-dispute-title">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                Bằng chứng tranh chấp
              </div>

              {tx.disputeReason && (
                <div className="et-dispute-reason">
                  <strong style={{ color: "#b45309" }}>Lý do tranh chấp:</strong> {tx.disputeReason}
                </div>
              )}

              <div className="et-evidence-list">
                {tx.disEvidence.map((dispute, dIdx) =>
                  dispute.evidences && dispute.evidences.length > 0 ? (
                    dispute.evidences.map((evidence, eIdx) => {
                      const submittedByBuyer = dispute.submitByUserId === tx.buyerId;
                      const submitterType = submittedByBuyer ? "Người mua" : "Người bán";
                      return (
                        <div key={`${dIdx}-${eIdx}`} className="et-evidence-item">
                          <div className="et-evidence-icon">
                            <FontAwesomeIcon icon={faFileAlt} />
                          </div>
                          <div className="et-evidence-content">
                            <div className="et-evidence-submitter">
                              Gửi bởi: <span className="et-evidence-submitter-type">{submitterType}</span>
                            </div>
                            {evidence.description && (
                              <div className="et-evidence-desc">{evidence.description}</div>
                            )}
                            {evidence.disEvidenceLink && (
                              <a
                                href={evidence.disEvidenceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="et-evidence-link"
                              >
                                <FontAwesomeIcon icon={faLink} />
                                Xem bằng chứng
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        <div className="et-modal-footer">
          <button className="et-modal-btn et-modal-btn-close" onClick={onClose} disabled={acting}>
            Đóng
          </button>
          {isPending && (
            <>
              <button
                className="et-modal-btn et-modal-btn-danger"
                onClick={() => handleAction("reject")}
                disabled={acting}
              >
                {acting ? <FontAwesomeIcon icon={faSpinner} className="et-spinner" /> : <FontAwesomeIcon icon={faTimesCircle} />}
                Từ chối
              </button>
              <button
                className="et-modal-btn et-modal-btn-success"
                onClick={() => handleAction("approve")}
                disabled={acting}
              >
                {acting ? <FontAwesomeIcon icon={faSpinner} className="et-spinner" /> : <FontAwesomeIcon icon={faCheckCircle} />}
                Duyệt
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EscrowTransactions ───────────────────────────────────────────────────────

export default function EscrowTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const { page, setPage, totalPages, visiblePages, paginated } = usePagination(transactions.length);
  const pageData = paginated(transactions);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const loadData = useCallback(async (f = filter) => {
    setLoading(true);
    try {
      const res = await api.post("/api/admin/transactions/filter", f);
      setTransactions(res.data);
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadData({}); }, []);

  const handleSearch = (f) => { setFilter(f); loadData(f); };

  // ── Render ────────────────────────────────────────────────────────────────

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, transactions.length);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="et">

        {/* ── Filter card ── */}
        <div className="et-card">
          <div className="et-card-header">
            <div className="et-card-header-left">
              <div className="et-card-dot" />
              <span className="et-card-title">Bộ lọc giao dịch</span>
            </div>
          </div>
          <EscrowFilter filter={filter} onChange={setFilter} onSearch={handleSearch} />
        </div>

        {/* ── Table card ── */}
        <div className="et-card">
          <div className="et-card-header">
            <div className="et-card-header-left">
              <div className="et-card-dot" />
              <span className="et-card-title">Giao dịch trung gian</span>
              {!loading && <span className="et-count">{transactions.length} giao dịch</span>}
            </div>
          </div>

          {loading ? (
            <div className="et-state">
              <FontAwesomeIcon icon={faSpinner} className="et-state-icon et-spinner" />
              <span className="et-state-text">Đang tải…</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="et-state">
              <FontAwesomeIcon icon={faInbox} className="et-state-icon" />
              <span className="et-state-text">Không có giao dịch nào</span>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="et-table-wrap">
                <table className="et-table">
                  <thead>
                    <tr>
                      <th>Mã GD</th>
                      <th>Người mua</th>
                      <th>Người bán</th>
                      <th>Số tiền</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((tx) => (
                      <tr key={tx.transactionId}>
                        <td><span className="et-txid">#{tx.transactionId}</span></td>
                        <td>
                          <div className="et-user-cell">
                            <span className="et-user-name">{tx.buyerName ?? tx.userName ?? "—"}</span>
                            {tx.buyerEmail && <span className="et-user-email">{tx.buyerEmail}</span>}
                          </div>
                        </td>
                        <td>
                          <div className="et-user-cell">
                            <span className="et-user-name">{tx.sellerName ?? "—"}</span>
                            {tx.sellerEmail && <span className="et-user-email">{tx.sellerEmail}</span>}
                          </div>
                        </td>
                        <td><span className="et-amount">{fmtMoney(tx.amount)}</span></td>
                        <td><span className="et-date">{fmtDate(tx.createAt)}</span></td>
                        <td><StatusBadge status={tx.status} /></td>
                        <td>
                          <button className="et-btn-preview" title="Xem chi tiết" onClick={() => setSelected(tx)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="et-mobile-list">
                {pageData.map((tx) => (
                  <div key={tx.transactionId} className="et-mobile-row">
                    <div className="et-mobile-top">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{tx.buyerName ?? tx.userName ?? "—"}</div>
                        <div style={{ fontSize: 12, color: "var(--text-xs)" }}>#{tx.transactionId}</div>
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                    <div className="et-mobile-bottom">
                      <div className="et-mobile-meta">
                        <div className="et-mobile-meta-item">
                          <FontAwesomeIcon icon={faMoneyBillWave} />
                          <strong style={{ color: "var(--accent)" }}>{fmtMoney(tx.amount)}</strong>
                        </div>
                        <div className="et-mobile-meta-item">
                          <FontAwesomeIcon icon={faCalendar} />
                          {fmtDate(tx.createdAt)}
                        </div>
                        {tx.sellerName && (
                          <div className="et-mobile-meta-item">
                            <FontAwesomeIcon icon={faUser} />
                            {tx.sellerName}
                          </div>
                        )}
                      </div>
                      <button className="et-btn-preview" onClick={() => setSelected(tx)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="et-pagination">
                  <div className="et-page-info">
                    Hiển thị <strong>{startItem}–{endItem}</strong> / <strong>{transactions.length}</strong>
                  </div>
                  <div className="et-page-btns">
                    <button
                      className="et-page-btn"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    {visiblePages.map((p, i) =>
                      p === "…" ? (
                        <span key={`dots-${i}`} className="et-page-dots">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`et-page-btn${page === p ? " et-page-btn--active" : ""}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      className="et-page-btn"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview modal */}
      {selected && (
        <EscrowPreviewModal
          tx={selected}
          onClose={() => setSelected(null)}
          onReload={() => loadData(filter)}
        />
      )}
    </>
  );
}