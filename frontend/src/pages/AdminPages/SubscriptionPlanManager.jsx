import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faPen, faTrash, faLock, faLockOpen,
  faSpinner, faInbox, faXmark, faBoxOpen,
  faClock, faFileLines, faTag,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";
import { Toast } from "../../utils/toast";
import { icon } from "@fortawesome/fontawesome-svg-core";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .spm {
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

  .spm { font-family: var(--font); color: var(--text); }

  /* ── Card ── */
  .spm-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;
  }

  /* ── Header ── */
  .spm-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 16px 22px; border-bottom: 1px solid var(--border);
    background: var(--bg-sub); flex-wrap: wrap;
  }
  .spm-header-left { display: flex; align-items: center; gap: 9px; }
  .spm-header-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .spm-title       { font-size: 14px; font-weight: 700; color: var(--text); }
  .spm-count {
    padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }

  /* Add button */
  .spm-add-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    background: var(--accent); border: 1px solid var(--accent); color: #fff;
    cursor: pointer; transition: all var(--transition);
  }
  .spm-add-btn:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

  /* ── Table ── */
  .spm-table-wrap { overflow-x: auto; }
  table.spm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .spm-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .spm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .spm-table td { padding: 13px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .spm-table tbody tr { transition: background var(--transition); }
  .spm-table tbody tr:hover { background: var(--bg-hover); }
  .spm-table tbody tr:last-child td { border-bottom: none; }

  /* Plan name cell */
  .spm-plan-name  { font-weight: 700; font-size: 14px; color: var(--text); }
  .spm-plan-title { font-size: 12px; color: var(--text-xs); margin-top: 2px; }

  /* Stat pill */
  .spm-stat {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 600; color: var(--text);
  }
  .spm-stat-icon { font-size: 11px; color: var(--text-xs); }

  /* Price */
  .spm-price { font-size: 13.5px; font-weight: 700; color: var(--accent); }

  /* Status badge */
  .spm-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
  }
  .spm-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .spm-status-on  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
  .spm-status-on  .spm-status-dot { background: #22c55e; }
  .spm-status-off { background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub); }
  .spm-status-off .spm-status-dot { background: #9ca3af; }

  /* Actions */
  .spm-actions { display: flex; gap: 6px; }
  .spm-btn-icon {
    width: 31px; height: 31px; border-radius: var(--radius-sm);
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid transparent; font-size: 12px; cursor: pointer;
    transition: all var(--transition);
  }
  .spm-btn-edit   { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .spm-btn-edit:hover   { background: #fef3c7; }
  .spm-btn-toggle-on  { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .spm-btn-toggle-on:hover  { background: #fef3c7; }
  .spm-btn-toggle-off { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
  .spm-btn-toggle-off:hover { background: #dcfce7; }
  .spm-btn-del    { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .spm-btn-del:hover    { background: #fee2e2; }

  /* ── Mobile cards (≤ 640px) ── */
  @media (max-width: 640px) {
    .spm-table-wrap { display: none; }
    .spm-mobile-list { display: flex; flex-direction: column; }
  }
  @media (min-width: 641px) { .spm-mobile-list { display: none; } }

  .spm-mobile-row {
    padding: 14px 16px; border-bottom: 1px solid #f3f4f6;
    display: flex; flex-direction: column; gap: 10px;
    transition: background var(--transition);
  }
  .spm-mobile-row:last-child { border-bottom: none; }
  .spm-mobile-row:hover { background: var(--bg-hover); }
  .spm-mobile-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .spm-mobile-name { font-size: 14px; font-weight: 700; }
  .spm-mobile-sub  { font-size: 12px; color: var(--text-xs); margin-top: 2px; }
  .spm-mobile-stats {
    display: flex; flex-wrap: wrap; gap: 10px;
  }
  .spm-mobile-stat-item {
    display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--text-sub);
  }
  .spm-mobile-stat-item strong { color: var(--text); }
  .spm-mobile-bottom { display: flex; align-items: center; justify-content: space-between; }

  /* ── Empty / Loading ── */
  .spm-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 52px 24px; gap: 10px; color: var(--text-sub);
  }
  .spm-state-icon { font-size: 32px; opacity: 0.28; }
  .spm-state-text { font-size: 13.5px; font-weight: 500; }
  .spm-spinner { animation: spmSpin 0.8s linear infinite; }
  @keyframes spmSpin { to { transform: rotate(360deg); } }

  /* ═══════════════════════════════
     MODAL
  ═══════════════════════════════ */
  .spm-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45); backdrop-filter: blur(3px);
    z-index: 1800; display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: spmFade 0.15s ease;
  }
  @keyframes spmFade { from { opacity: 0; } to { opacity: 1; } }

  .spm-modal {
    background: #fff; border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.20);
    width: 100%; max-width: 480px;
    max-height: calc(100dvh - 32px);
    display: flex; flex-direction: column;
    overflow: hidden;
    animation: spmSlide 0.2s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes spmSlide {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .spm-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .spm-modal-title { font-size: 15px; font-weight: 700; color: var(--text); }
  .spm-modal-close {
    width: 30px; height: 30px; border-radius: var(--radius-sm);
    background: #f3f4f6; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-sub); font-size: 13px; transition: background var(--transition);
  }
  .spm-modal-close:hover { background: #e5e7eb; }

  .spm-modal-body {
    flex: 1; overflow-y: auto; padding: 20px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .spm-modal-body::-webkit-scrollbar { width: 3px; }
  .spm-modal-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

  .spm-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 480px) { .spm-modal-grid { grid-template-columns: 1fr; } }

  .spm-field { display: flex; flex-direction: column; gap: 5px; }
  .spm-label {
    font-size: 11.5px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-sub);
  }
  .spm-label-req { color: #dc2626; margin-left: 2px; }
  .spm-input {
    padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  }
  .spm-input:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.11); background: #fff;
  }
  .spm-textarea {
    resize: vertical; min-height: 72px;
  }

  .spm-modal-footer {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 14px 20px; border-top: 1px solid var(--border);
    background: var(--bg-sub); flex-shrink: 0;
  }
  .spm-modal-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; border: 1px solid transparent; transition: all var(--transition);
  }
  .spm-modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .spm-modal-btn-cancel  { background: #f3f4f6; border-color: var(--border); color: var(--text-sub); }
  .spm-modal-btn-cancel:hover:not(:disabled)  { background: #e5e7eb; }
  .spm-modal-btn-save    { background: var(--accent); border-color: var(--accent); color: #fff; }
  .spm-modal-btn-save:hover:not(:disabled)    { background: #1a6438; border-color: #1f7441; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const FEATURE_TIERS = [
  { value: 0, label: "Bình thường" },
  { value: 1, label: "Vip" },
  { value: 2, label: "Premium" },
  { value: 3, label: "Business" },
  { value: 4, label: "Luxury" },
];

const EMPTY_FORM = {
  subPlanName: "", subPlanTitle: "", subPlanPromo: "",
  subPlanPrice: "", durationDays: "", maxPostPerSub: "", maxFreePost: "",
  featuredPriority: 0, maxFeaturedPosts: "", featuredDurationDays: "",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtPrice = (n) => Number(n).toLocaleString("vi-VN") + " đ";

const fmtTierReturnLabel = (label) => FEATURE_TIERS.find((tier) => tier.label === label)?.label ?? "Bình thường";
const fmtTierReturnValue = (label) => FEATURE_TIERS.find((tier) => tier.label === label)?.value ?? FEATURE_TIERS.find((tier) => tier.value === label)?.value;

// ─── PlanModal ────────────────────────────────────────────────────────────────

function PlanModal({ plan, onSave, onClose }) {
  const [form, setForm] = useState(plan ?? EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try { await onSave(form); }
    catch (err) {
      Toast.fire({
        icon: "error",
        title: err.response?.data ?? "Lỗi không xác định"
      });
    }
    finally {
      if (plan) {
        Toast.fire({
          icon: "success",
          title: "Cập nhật gói dịch vụ thành công"
        });
      }
      else {
        Toast.fire({
          icon: "success",
          title: "Thêm gói dịch vụ thành công"
        });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="spm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="spm-modal" role="dialog" aria-modal="true" onSubmit={handleSave}>

        <div className="spm-modal-header">
          <span className="spm-modal-title">
            {plan ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ mới"}
          </span>
          <button className="spm-modal-close" type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="spm-modal-body">
          {/* Name */}
          <div className="spm-field">
            <label className="spm-label">Tên gói <span className="spm-label-req">*</span></label>
            <input
              className="spm-input"
              placeholder="VD: Gói Cơ Bản, Gói Premium…"
              value={form.subPlanName}
              required
              onChange={(e) => setField("subPlanName", e.target.value)}
            />
          </div>

          {/* Title */}
          <div className="spm-field">
            <label className="spm-label">Mô tả ngắn</label>
            <input
              className="spm-input"
              placeholder="Tagline hiển thị dưới tên gói…"
              value={form.subPlanTitle}
              onChange={(e) => setField("subPlanTitle", e.target.value)}
            />
          </div>

          {/* Promo */}
          <div className="spm-field">
            <label className="spm-label">Nội dung quảng cáo</label>
            <textarea
              className="spm-input spm-textarea"
              placeholder="Mô tả chi tiết quyền lợi gói…"
              value={form.subPlanPromo}
              onChange={(e) => setField("subPlanPromo", e.target.value)}
            />
          </div>

          {/* Numeric grid */}
          <div className="spm-modal-grid">
            <div className="spm-field">
              <label className="spm-label">Giá (VNĐ) <span className="spm-label-req">*</span></label>
              <input
                className="spm-input" type="text"
                placeholder="0"
                required
                onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    e.target.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    console.log("Raw price input:", raw);
                    console.log("Formatted price input:", e.target.value);
                    setField("subPlanPrice", raw);
                  }
                }
                  
              />
            </div>

            <div className="spm-field">
              <label className="spm-label">Thời hạn (ngày) <span className="spm-label-req">*</span></label>
              <input
                className="spm-input" type="number" min="1"
                placeholder="30"
                value={form.durationDays}
                required
                onChange={(e) => setField("durationDays", e.target.value)}
              />
            </div>

            <div className="spm-field">
              <label className="spm-label">Hạng</label>
              <select
                className="spm-input"
                value={fmtTierReturnValue(form.featuredPriority)}
                onChange={(e) => {console.log(e.target.value); setField("featuredPriority", Number(e.target.value)) }}
              >
                {FEATURE_TIERS.map((tier) => (
                  <option key={tier.value} value={tier.value}>{tier.label}</option>
                ))}
              </select>
            </div>

            <div className="spm-field">
              <label className="spm-label">Số tin nổi bật tối đa</label>
              <input
                className="spm-input" type="number" min="0"
                placeholder="0"
                value={form.maxFeaturedPosts}
                required={form.featuredDurationDays > 0}
                onChange={(e) => setField("maxFeaturedPosts", e.target.value)}
              />
            </div>

            <div className="spm-field">
              <label className="spm-label">Số tin miễn phí tối đa</label>
              <input
                className="spm-input" type="number" min="0"
                placeholder="0"
                value={form.maxFreePost}
                onChange={(e) => setField("maxFreePost", e.target.value)}
              />
            </div>

            <div className="spm-field">
              <label className="spm-label">Số ngày nổi bật</label>
              <input
                className="spm-input" type="number" min="0"
                placeholder="0"
                value={form.featuredDurationDays}
                required={form.maxFeaturedPosts > 0}
                onChange={(e) => setField("featuredDurationDays", e.target.value)}
              />
            </div>

            <div className="spm-field" style={{ gridColumn: "1 / -1" }}>
              <label className="spm-label">Số bài đăng tối đa <span className="spm-label-req">*</span></label>
              <input
                className="spm-input" type="number" min="0"
                placeholder="10"
                value={form.maxPostPerSub}
                required
                onChange={(e) => setField("maxPostPerSub", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="spm-modal-footer">
          <button className="spm-modal-btn spm-modal-btn-cancel" type="button" onClick={onClose} disabled={submitting}>
            Huỷ
          </button>
          <button className="spm-modal-btn spm-modal-btn-save" type="submit" disabled={submitting}>
            {submitting
              ? <FontAwesomeIcon icon={faSpinner} className="spm-spinner" />
              : <FontAwesomeIcon icon={plan ? faPen : faPlus} />
            }
            {plan ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── SubscriptionPlanManager ──────────────────────────────────────────────────

export default function SubscriptionPlanManager() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | plan object

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/subscription-plans");
      setPlans(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleSave = async (form) => {
    const payload = {
      ...form,
      subPlanPrice: Number(form.subPlanPrice),
      durationDays: Number(form.durationDays),
      maxPostPerSub: Number(form.maxPostPerSub),
      maxFreePost: Number(form.maxFreePost),
      featuredPriority: Number(fmtTierReturnValue(form.featuredPriority)),
      maxFeaturedPosts: Number(form.maxFeaturedPosts),
      featuredDurationDays: Number(form.featuredDurationDays),
    };
    console.log("Saving plan with form data:", form);
    console.log("Saving plan with payload data:", payload);
    try {
      if (modal?.subPlanId) {
        await api.post(`/api/admin/subscription-plans/${modal.subPlanId}/update`, payload);
      } else {
        await api.post("/api/admin/subscription-plans", payload);
      }
    }
    catch (err) {
      Toast.fire({
        icon: "error",
        title: err.response?.data ?? "Lỗi không xác định"
      });
      return;
    }
    finally {
      setModal(null);
      await load();
    }
  };

  const handleToggle = async (id) => {
    await api.post(`/api/admin/subscription-plans/${id}/toggle`);
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá gói dịch vụ này?")) return;
    try {
      await api.post(`/api/admin/subscription-plans/${id}/delete`);
      await load();
      Toast.fire({
        icon: "success",
        title: "Xoá gói dịch vụ thành công"
      });
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.response?.data ?? "Không thể xoá gói này"
      });
    }
  };

  // ── Shared action buttons ─────────────────────────────────────────────────

  const ActionButtons = ({ plan }) => (
    <div className="spm-actions">
      <button
        className="spm-btn-icon spm-btn-edit"
        title="Chỉnh sửa"
        onClick={() => setModal(plan)}
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        className={`spm-btn-icon ${plan.isActive ? "spm-btn-toggle-on" : "spm-btn-toggle-off"}`}
        title={plan.isActive ? "Ngừng bán" : "Mở bán"}
        onClick={() => handleToggle(plan.subPlanId)}
      >
        <FontAwesomeIcon icon={plan.isActive ? faLock : faLockOpen} />
      </button>
      <button
        className="spm-btn-icon spm-btn-del"
        title="Xoá gói"
        onClick={() => handleDelete(plan.subPlanId)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="spm">
        <div className="spm-card">

          {/* Header */}
          <div className="spm-header">
            <div className="spm-header-left">
              <div className="spm-header-dot" />
              <span className="spm-title">Quản lý gói dịch vụ</span>
              {!loading && <span className="spm-count">{plans.length} gói</span>}
            </div>
            <button className="spm-add-btn" onClick={() => setModal("add")}>
              <FontAwesomeIcon icon={faPlus} />
              Thêm gói
            </button>
          </div>

          {/* Body */}
          {loading ? (
            <div className="spm-state">
              <FontAwesomeIcon icon={faSpinner} className="spm-state-icon spm-spinner" />
              <span className="spm-state-text">Đang tải…</span>
            </div>
          ) : plans.length === 0 ? (
            <div className="spm-state">
              <FontAwesomeIcon icon={faInbox} className="spm-state-icon" />
              <span className="spm-state-text">Chưa có gói dịch vụ nào</span>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="spm-table-wrap">
                <table className="spm-table">
                  <thead>
                    <tr>
                      <th>Gói dịch vụ</th>
                      <th>Giá</th>
                      <th>Thời hạn</th>
                      <th>Bài miễn phí</th>
                      <th>Bài tối đa</th>
                      <th>Hạng</th>
                      <th>Tin nổi bật</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p) => (
                      <tr key={p.subPlanId}>
                        <td>
                          <div className="spm-plan-name">{p.subPlanName}</div>
                          {p.subPlanTitle && <div className="spm-plan-title">{p.subPlanTitle}</div>}
                        </td>
                        <td className="spm-price">{fmtPrice(p.subPlanPrice)}</td>
                        <td>
                          <span className="spm-stat">
                            <FontAwesomeIcon icon={faClock} className="spm-stat-icon" />
                            {p.durationDays} ngày
                          </span>
                        </td>
                        <td>
                          <span className="spm-stat">
                            <FontAwesomeIcon icon={faTag} className="spm-stat-icon" />
                            {p.maxFreePost} bài
                          </span>
                        </td>
                        <td>
                          <span className="spm-stat">
                            <FontAwesomeIcon icon={faFileLines} className="spm-stat-icon" />
                            {p.maxPostPerSub} bài
                          </span>
                        </td>
                        <td>
                          <span className="spm-stat">
                            <FontAwesomeIcon icon={faTag} className="spm-stat-icon" />
                            {fmtTierReturnLabel(p.featuredPriority)}
                          </span>
                        </td>
                        <td>
                          <span className="spm-stat">
                            <FontAwesomeIcon icon={faClock} className="spm-stat-icon" />
                            {p.maxFeaturedPosts > 0 ? `${p.maxFeaturedPosts} bài / ${p.featuredDurationDays} ngày` : "Không có"}
                          </span>
                        </td>
                        <td>
                          {p.isActive
                            ? <span className="spm-status spm-status-on"><span className="spm-status-dot" />Đang bán</span>
                            : <span className="spm-status spm-status-off"><span className="spm-status-dot" />Ngừng bán</span>
                          }
                        </td>
                        <td><ActionButtons plan={p} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="spm-mobile-list">
                {plans.map((p) => (
                  <div key={p.subPlanId} className="spm-mobile-row">
                    <div className="spm-mobile-top">
                      <div>
                        <div className="spm-mobile-name">{p.subPlanName}</div>
                        {p.subPlanTitle && <div className="spm-mobile-sub">{p.subPlanTitle}</div>}
                      </div>
                      {p.isActive
                        ? <span className="spm-status spm-status-on"><span className="spm-status-dot" />Đang bán</span>
                        : <span className="spm-status spm-status-off"><span className="spm-status-dot" />Ngừng bán</span>
                      }
                    </div>

                    <div className="spm-mobile-stats">
                      <div className="spm-mobile-stat-item">
                        <FontAwesomeIcon icon={faTag} style={{ color: "var(--accent)" }} />
                        <strong>{fmtPrice(p.subPlanPrice)}</strong>
                      </div>
                      <div className="spm-mobile-stat-item">
                        <FontAwesomeIcon icon={faClock} />
                        <span>Thời hạn: <strong>{p.durationDays} ngày</strong></span>
                      </div>
                      <div className="spm-mobile-stat-item">
                        <FontAwesomeIcon icon={faTag} />
                        <span>Free: <strong>{p.maxFreePost} bài</strong></span>
                      </div>
                      <div className="spm-mobile-stat-item">
                        <FontAwesomeIcon icon={faFileLines} />
                        <span>Tối đa: <strong>{p.maxPostPerSub} bài</strong></span>
                      </div>
                      <div className="spm-mobile-stat-item">
                        <FontAwesomeIcon icon={faTag} />
                        <span>Feature: <strong>{fmtTierReturnLabel(p.featuredPriority)}</strong></span>
                      </div>
                      <div className="spm-mobile-stat-item">
                        <FontAwesomeIcon icon={faClock} />
                        <span>Nổi bật: <strong>{p.maxFeaturedPosts} bài / {p.featuredDurationDays} ngày</strong></span>
                      </div>
                    </div>

                    <div className="spm-mobile-bottom">
                      <ActionButtons plan={p} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <PlanModal
          plan={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}