import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faPen, faTrash, faXmark,
  faSpinner, faInbox, faSlidersH,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .sm {
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

  .sm { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 20px; }

  /* ── Card ── */
  .sm-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .sm-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
  }
  .sm-card-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); flex-shrink: 0;
  }
  .sm-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .sm-card-badge {
    margin-left: auto;
    padding: 2px 9px; border-radius: 999px;
    font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border);
    color: var(--text-sub);
  }

  /* ── Category picker ── */
  .sm-picker { padding: 18px 20px; }
  .sm-picker-label {
    display: block; font-size: 11.5px; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
    color: var(--text-sub); margin-bottom: 7px;
  }
  .sm-picker-row { display: flex; align-items: center; gap: 10px; }
  .sm-picker-icon { color: var(--accent); font-size: 15px; flex-shrink: 0; }

  .sm-select {
    flex: 1; padding: 9px 34px 9px 12px;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .sm-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(4,153,71,0.11);
    background: #fff;
  }

  /* ── Form ── */
  .sm-form { padding: 18px 20px; display: flex; flex-direction: column; gap: 13px; }

  .sm-field { display: flex; flex-direction: column; gap: 5px; }
  .sm-label {
    font-size: 11.5px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-sub);
  }
  .sm-label-req { color: #dc2626; margin-left: 2px; }

  .sm-input {
    padding: 8px 12px;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  }
  .sm-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(4,153,71,0.11);
    background: #fff;
  }
  .sm-input--error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,0.09) !important; }

  .sm-error {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 12px; border-radius: var(--radius-sm);
    background: #fff5f5; border: 1px solid #fecaca;
    font-size: 12.5px; color: #dc2626;
  }

  .sm-form-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── Buttons ── */
  .sm-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    border: 1px solid transparent; cursor: pointer;
    transition: all var(--transition);
  }
  .sm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .sm-btn-primary  { background: var(--accent); border-color: var(--accent); color: #fff; }
  .sm-btn-primary:hover:not(:disabled) { background: var(--accent-hover); border-color: var(--accent-hover); }
  .sm-btn-secondary { background: var(--bg-sub); border-color: var(--border); color: var(--text-sub); }
  .sm-btn-secondary:hover { background: #e5e7eb; }

  .sm-btn-icon {
    width: 30px; height: 30px; padding: 0;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm); border: 1px solid transparent;
    font-size: 12px; cursor: pointer; transition: all var(--transition);
  }
  .sm-btn-edit { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .sm-btn-edit:hover { background: #fef3c7; }
  .sm-btn-del  { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .sm-btn-del:hover  { background: #fee2e2; }

  /* ── Divider ── */
  .sm-divider { border: none; border-top: 1px solid var(--border); margin: 0; }

  /* ── Table ── */
  .sm-table-wrap { overflow-x: auto; }
  table.sm-table {
    width: 100%; border-collapse: collapse; font-size: 13.5px;
  }
  .sm-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .sm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .sm-table td {
    padding: 11px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle;
  }
  .sm-table tbody tr { transition: background var(--transition); }
  .sm-table tbody tr:hover { background: var(--bg-hover); }
  .sm-table tbody tr:last-child td { border-bottom: none; }
  .sm-td-name { font-weight: 500; }
  .sm-td-desc { color: var(--text-sub); font-size: 13px; }
  .sm-td-actions { display: flex; gap: 6px; }

  /* ── Empty / Loading / Prompt ── */
  .sm-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 24px; gap: 10px; color: var(--text-sub);
  }
  .sm-state-icon { font-size: 30px; opacity: 0.28; }
  .sm-state-text { font-size: 13.5px; font-weight: 500; }
  .sm-state-sub  { font-size: 12px; color: var(--text-xs); }
  .sm-spinner { animation: smSpin 0.8s linear infinite; }
  @keyframes smSpin { to { transform: rotate(360deg); } }

  /* ── Mobile cards (≤ 580px) ── */
  @media (max-width: 580px) {
    .sm-table-wrap { display: none; }
    .sm-mobile-list { display: flex; flex-direction: column; }
    .sm-picker-row { flex-direction: column; align-items: stretch; gap: 8px; }
    .sm-picker-icon { display: none; }
  }
  @media (min-width: 581px) {
    .sm-mobile-list { display: none; }
  }

  .sm-mobile-item {
    padding: 13px 16px;
    border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
    transition: background var(--transition);
  }
  .sm-mobile-item:last-child { border-bottom: none; }
  .sm-mobile-item:hover { background: var(--bg-hover); }
  .sm-mobile-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .sm-mobile-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .sm-mobile-desc { font-size: 12px; color: var(--text-xs); }
  .sm-mobile-actions { display: flex; gap: 6px; flex-shrink: 0; margin-top: 1px; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = { specId: null, specName: "", description: "" };

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActionButtons({ onEdit, onDelete }) {
  return (
    <>
      <button className="sm-btn-icon sm-btn-edit" title="Sửa" onClick={onEdit}>
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button className="sm-btn-icon sm-btn-del" title="Xóa" onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );
}

// ─── SpecificationManager ─────────────────────────────────────────────────────

export default function SpecificationManager() {
  const [categories, setCategories] = useState([]);
  const [specs,      setSpecs]      = useState([]);
  const [cateId,     setCateId]     = useState("");
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [isEditing,  setIsEditing]  = useState(false);
  const [error,      setError]      = useState("");
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Fetch categories once ─────────────────────────────────────────────────

  useEffect(() => {
    api.get("/api/admin/categories").then((res) => setCategories(res.data));
  }, []);

  // ── Fetch specs when category changes ─────────────────────────────────────

  const loadSpecs = useCallback(async (id = cateId) => {
    if (!id) return;
    setLoadingSpecs(true);
    try {
      const res = await api.get(`/api/admin/specifications/by-category/${id}`);
      setSpecs(res.data);
    } finally {
      setLoadingSpecs(false);
    }
  }, [cateId]);

  useEffect(() => { loadSpecs(cateId); }, [cateId]);

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => { setForm(EMPTY_FORM); setIsEditing(false); setError(""); };

  const startEdit = (spec) => {
    setIsEditing(true);
    setError("");
    setForm({ specId: spec.specId, specName: spec.specName, description: spec.description ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const submit = async () => {
    if (!form.specName.trim()) return setError("Tên thông số là bắt buộc");
    setError(""); setSubmitting(true);
    try {
        const payload = {
            specName:    form.specName.trim(),
            description: form.description.trim(),
            cateId,
        };
        if (isEditing) {
            // ✅ đổi từ api.put → api.post, url mới
            await api.post(`/api/admin/specifications/update/${form.specId}`, payload);
        } else {
            await api.post("/api/admin/specifications", payload);
        }
        resetForm();
        await loadSpecs(cateId);
    } catch (err) {
        setError(err.response?.data || "Có lỗi xảy ra");
    } finally {
        setSubmitting(false);
    }
};

const del = async (id) => {
    if (!window.confirm("Xóa thông số này?")) return;
    try {
        // ✅ đổi từ api.delete → api.post, url mới
        await api.post(`/api/admin/specifications/delete/${id}`);
        await loadSpecs(cateId);
    } catch (err) {
        alert(err.response?.data ?? "Không thể xóa thông số này");
    }
};
  // ── Render ────────────────────────────────────────────────────────────────

  const selectedCate = categories.find((c) => c.cateId === Number(cateId));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="sm">

        {/* ── Category picker card ── */}
        <div className="sm-card">
          <div className="sm-card-header">
            <div className="sm-card-dot" />
            <span className="sm-card-title">Cấu hình phân loại</span>
          </div>

          <div className="sm-picker">
            <label className="sm-picker-label">Chọn danh mục</label>
            <div className="sm-picker-row">
              <FontAwesomeIcon icon={faLayerGroup} className="sm-picker-icon" />
              <select
                className="sm-select"
                value={cateId}
                onChange={(e) => {
                  setCateId(Number(e.target.value) || "");
                  resetForm();
                }}
              >
                <option value="">— Chọn danh mục —</option>
                {categories.map((c) => (
                  <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Form + table (only when category selected) ── */}
        {cateId ? (
          <>
            {/* Form card */}
            <div className="sm-card">
              <div className="sm-card-header">
                <div className="sm-card-dot" />
                <span className="sm-card-title">
                  {isEditing ? "Cập nhật thông số" : "Thêm thông số mới"}
                </span>
              </div>

              <div className="sm-form">
                {error && (
                  <div className="sm-error">
                    <FontAwesomeIcon icon={faXmark} />
                    {error}
                  </div>
                )}

                <div className="sm-field">
                  <label className="sm-label">
                    Tên thông số <span className="sm-label-req">*</span>
                  </label>
                  <input
                    className={`sm-input${error && !form.specName.trim() ? " sm-input--error" : ""}`}
                    placeholder="VD: RAM, CPU, Màn hình…"
                    value={form.specName}
                    onChange={(e) => setField("specName", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                  />
                </div>

                <div className="sm-field">
                  <label className="sm-label">Mô tả</label>
                  <input
                    className="sm-input"
                    placeholder="Mô tả ngắn (tuỳ chọn)…"
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                  />
                </div>

                <div className="sm-form-actions">
                  <button className="sm-btn sm-btn-primary" onClick={submit} disabled={submitting}>
                    {submitting
                      ? <FontAwesomeIcon icon={faSpinner} className="sm-spinner" />
                      : <FontAwesomeIcon icon={isEditing ? faPen : faPlus} />
                    }
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </button>
                  {isEditing && (
                    <button className="sm-btn sm-btn-secondary" onClick={resetForm}>
                      <FontAwesomeIcon icon={faXmark} />
                      Huỷ
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Specs list card */}
            <div className="sm-card">
              <div className="sm-card-header">
                <div className="sm-card-dot" />
                <span className="sm-card-title">
                  Thông số của <strong>{selectedCate?.cateName}</strong>
                </span>
                {!loadingSpecs && (
                  <span className="sm-card-badge">{specs.length} mục</span>
                )}
              </div>

              {loadingSpecs ? (
                <div className="sm-state">
                  <FontAwesomeIcon icon={faSpinner} className="sm-state-icon sm-spinner" />
                  <span className="sm-state-text">Đang tải…</span>
                </div>
              ) : specs.length === 0 ? (
                <div className="sm-state">
                  <FontAwesomeIcon icon={faSlidersH} className="sm-state-icon" />
                  <span className="sm-state-text">Chưa có thông số nào</span>
                  <span className="sm-state-sub">Thêm thông số đầu tiên ở trên</span>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="sm-table-wrap">
                    <table className="sm-table">
                      <thead>
                        <tr>
                          <th>Tên thông số</th>
                          <th>Mô tả</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specs.map((spec) => (
                          <tr key={spec.specId}>
                            <td className="sm-td-name">{spec.specName}</td>
                            <td className="sm-td-desc">{spec.description || "—"}</td>
                            <td>
                              <div className="sm-td-actions">
                                <ActionButtons
                                  onEdit={() => startEdit(spec)}
                                  onDelete={() => del(spec.specId)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm-mobile-list">
                    {specs.map((spec) => (
                      <div key={spec.specId} className="sm-mobile-item">
                        <div className="sm-mobile-info">
                          <div className="sm-mobile-name">{spec.specName}</div>
                          {spec.description && (
                            <div className="sm-mobile-desc">{spec.description}</div>
                          )}
                        </div>
                        <div className="sm-mobile-actions">
                          <ActionButtons
                            onEdit={() => startEdit(spec)}
                            onDelete={() => del(spec.specId)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* No category selected prompt */
          <div className="sm-card">
            <div className="sm-state">
              <FontAwesomeIcon icon={faLayerGroup} className="sm-state-icon" />
              <span className="sm-state-text">Chọn danh mục để bắt đầu</span>
              <span className="sm-state-sub">Thông số sẽ hiện sau khi bạn chọn danh mục phía trên</span>
            </div>
          </div>
        )}

      </div>
    </>
  );
}