import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen, faTrash, faPlus, faXmark,
  faChevronDown, faFolder, faFolderOpen,
  faSpinner, faInbox,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .cm {
    --accent:       var(--primary-color);
    --accent-hover: var(--primary-color-hover);
    --danger:       var(--cancel, #dc2626);
    --border:       #e5e7eb;
    --bg:           #ffffff;
    --bg-sub:       #f9fafb;
    --bg-row-parent:#f0fdf4;
    --bg-row-hover: #fafafa;
    --text:         #111827;
    --text-sub:     #6b7280;
    --text-xs:      #9ca3af;
    --radius:       10px;
    --radius-sm:    6px;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 4px 16px rgba(0,0,0,0.09);
    --transition:   0.16s ease;
    --font:         'Inter', 'Segoe UI', sans-serif;
  }

  .cm { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 20px; }

  /* ── Shared card ── */
  .cm-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .cm-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
  }
  .cm-card-header-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); flex-shrink: 0;
  }
  .cm-card-title {
    font-size: 14px; font-weight: 700; color: var(--text);
  }

  /* ── Form ── */
  .cm-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

  .cm-field { display: flex; flex-direction: column; gap: 5px; }
  .cm-label {
    font-size: 11.5px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-sub);
  }
  .cm-label span { color: #dc2626; margin-left: 2px; }

  .cm-input,
  .cm-textarea,
  .cm-select {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  }
  .cm-input:focus,
  .cm-textarea:focus,
  .cm-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(4,153,71,0.11);
    background: #fff;
  }
  .cm-input.cm-input-error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.09); }
  .cm-textarea { resize: vertical; min-height: 72px; }
  .cm-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }

  .cm-error-msg {
    font-size: 12px; color: #dc2626;
    display: flex; align-items: center; gap: 5px;
    padding: 8px 12px;
    background: #fff5f5; border: 1px solid #fecaca;
    border-radius: var(--radius-sm);
  }

  .cm-form-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── Buttons ── */
  .cm-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    border: 1px solid transparent; cursor: pointer;
    transition: all var(--transition);
  }
  .cm-btn-primary {
    background: var(--accent); border-color: var(--accent); color: #fff;
  }
  .cm-btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
  .cm-btn-secondary {
    background: var(--bg-sub); border-color: var(--border); color: var(--text-sub);
  }
  .cm-btn-secondary:hover { background: #e5e7eb; }

  .cm-btn-icon {
    width: 30px; height: 30px; padding: 0;
    border-radius: var(--radius-sm);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; cursor: pointer; border: 1px solid transparent;
    transition: all var(--transition);
  }
  .cm-btn-edit {
    background: #fffbeb; border-color: #fde68a; color: #b45309;
  }
  .cm-btn-edit:hover { background: #fef3c7; }
  .cm-btn-del {
    background: #fff5f5; border-color: #fecaca; color: #dc2626;
  }
  .cm-btn-del:hover { background: #fee2e2; }

  /* ── Table ── */
  .cm-table-wrap { overflow-x: auto; }
  table.cm-table {
    width: 100%; border-collapse: collapse; font-size: 13.5px;
  }
  .cm-table thead tr {
    background: var(--bg-sub); border-bottom: 1px solid var(--border);
  }
  .cm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub);
    white-space: nowrap;
  }
  .cm-table td {
    padding: 10px 16px; border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }
  .cm-table tbody tr { transition: background var(--transition); }
  .cm-table tbody tr:hover { background: var(--bg-row-hover); }
  .cm-table tbody tr:last-child td { border-bottom: none; }

  /* Parent row */
  .cm-row-parent { background: var(--bg-row-parent) !important; }
  .cm-row-parent:hover { background: #dcfce7 !important; }
  .cm-parent-name {
    display: flex; align-items: center; gap: 8px;
    font-weight: 700; color: var(--text);
  }
  .cm-parent-icon { color: var(--accent); font-size: 13px; }

  /* Child row */
  .cm-child-name {
    display: flex; align-items: center; gap: 8px;
    padding-left: 10px;
    color: var(--text-sub); font-weight: 500;
  }
  .cm-child-indent {
    display: flex; align-items: center; gap: 4px; color: var(--text-xs);
    font-size: 12px;
  }

  /* Brand count badge */
  .cm-badge {
    display: inline-flex; align-items: center;
    padding: 2px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border);
    color: var(--text-sub);
  }

  .cm-td-desc { color: var(--text-sub); font-size: 13px; max-width: 280px; }
  .cm-td-actions { display: flex; gap: 6px; }

  /* ── Empty / Loading ── */
  .cm-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 50px 24px; gap: 10px; color: var(--text-sub);
  }
  .cm-state-icon { font-size: 32px; opacity: 0.30; }
  .cm-state-text { font-size: 13.5px; font-weight: 500; }
  .cm-spinner { animation: cmSpin 0.8s linear infinite; }
  @keyframes cmSpin { to { transform: rotate(360deg); } }

  /* ── Mobile cards (≤ 600px) ── */
  @media (max-width: 600px) {
    .cm-table-wrap { display: none; }
    .cm-mobile-list { display: flex; flex-direction: column; }
  }
  @media (min-width: 601px) {
    .cm-mobile-list { display: none; }
  }

  .cm-mobile-item {
    padding: 13px 16px;
    border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
    transition: background var(--transition);
  }
  .cm-mobile-item:last-child { border-bottom: none; }
  .cm-mobile-item:hover { background: var(--bg-row-hover); }
  .cm-mobile-item--parent { background: var(--bg-row-parent); }
  .cm-mobile-item--parent:hover { background: #dcfce7; }
  .cm-mobile-item--child { padding-left: 28px; }
  .cm-mobile-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .cm-mobile-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .cm-mobile-name--child { font-weight: 500; color: var(--text-sub); }
  .cm-mobile-desc { font-size: 12px; color: var(--text-xs); }
  .cm-mobile-meta { display: flex; gap: 8px; align-items: center; margin-top: 2px; }
  .cm-mobile-actions { display: flex; gap: 6px; flex-shrink: 0; margin-top: 2px; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = { cateId: null, cateName: "", description: "", parentCateId: "" };

// ─── Components ───────────────────────────────────────────────────────────────

function ActionButtons({ onEdit, onDelete }) {
  return (
    <>
      <button className="cm-btn-icon cm-btn-edit" title="Sửa" onClick={onEdit}>
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button className="cm-btn-icon cm-btn-del" title="Xóa" onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );
}

// ─── CategoryManager ──────────────────────────────────────────────────────────

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [isEditing,  setIsEditing]  = useState(false);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data);
    } catch {
      // silent — data already shown
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const parents  = categories.filter((c) => c.parentCateId == null);
  const childrenOf = (id) => categories.filter((c) => c.parentCateId === id);

  // ── Form ──────────────────────────────────────────────────────────────────

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => { setForm(EMPTY_FORM); setIsEditing(false); setError(""); };

  const startEdit = (c) => {
    setIsEditing(true);
    setError("");
    setForm({
      cateId:      c.cateId,
      cateName:    c.cateName,
      description: c.description ?? "",
      parentCateId: c.parentCateId ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!form.cateName.trim()) return setError("Tên danh mục là bắt buộc");
    setError(""); setSubmitting(true);
    try {
      const payload = {
        cateName:     form.cateName.trim(),
        description:  form.description.trim(),
        parentCateId: form.parentCateId || null,
      };
      if (isEditing) {
        await api.put(`/api/admin/categories/${form.cateId}`, payload);
      } else {
        await api.post("/api/admin/categories", payload);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      await loadData();
    } catch (err) {
      alert(err.response?.data ?? "Không thể xóa danh mục này");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cm">

        {/* ── Form card ── */}
        <div className="cm-card">
          <div className="cm-card-header">
            <div className="cm-card-header-dot" />
            <span className="cm-card-title">
              {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </span>
          </div>

          <div className="cm-form">
            {error && (
              <div className="cm-error-msg">
                <FontAwesomeIcon icon={faXmark} />
                {error}
              </div>
            )}

            <div className="cm-field">
              <label className="cm-label">Tên danh mục <span>*</span></label>
              <input
                className={`cm-input${error && !form.cateName.trim() ? " cm-input-error" : ""}`}
                placeholder="Nhập tên danh mục…"
                value={form.cateName}
                onChange={(e) => setField("cateName", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>

            <div className="cm-field">
              <label className="cm-label">Mô tả</label>
              <textarea
                className="cm-textarea"
                placeholder="Mô tả ngắn (tuỳ chọn)…"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            <div className="cm-field">
              <label className="cm-label">Danh mục cha</label>
              <select
                className="cm-select"
                value={form.parentCateId}
                onChange={(e) => setField("parentCateId", e.target.value)}
              >
                <option value="">— Danh mục gốc —</option>
                {parents
                  .filter((c) => c.cateId !== form.cateId)
                  .map((c) => (
                    <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                  ))}
              </select>
            </div>

            <div className="cm-form-actions">
              <button className="cm-btn cm-btn-primary" onClick={submit} disabled={submitting}>
                {submitting
                  ? <FontAwesomeIcon icon={faSpinner} className="cm-spinner" />
                  : <FontAwesomeIcon icon={isEditing ? faPen : faPlus} />
                }
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </button>
              {isEditing && (
                <button className="cm-btn cm-btn-secondary" onClick={resetForm}>
                  <FontAwesomeIcon icon={faXmark} />
                  Huỷ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="cm-card">
          <div className="cm-card-header">
            <div className="cm-card-header-dot" />
            <span className="cm-card-title">Danh sách phân loại</span>
          </div>

          {loading ? (
            <div className="cm-state">
              <FontAwesomeIcon icon={faSpinner} className="cm-state-icon cm-spinner" />
              <span className="cm-state-text">Đang tải…</span>
            </div>
          ) : parents.length === 0 ? (
            <div className="cm-state">
              <FontAwesomeIcon icon={faInbox} className="cm-state-icon" />
              <span className="cm-state-text">Chưa có danh mục nào</span>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="cm-table-wrap">
                <table className="cm-table">
                  <thead>
                    <tr>
                      <th>Tên danh mục</th>
                      <th>Mô tả</th>
                      <th>Thương hiệu</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parents.map((parent) => (
                      <>
                        {/* Parent row */}
                        <tr key={parent.cateId} className="cm-row-parent">
                          <td>
                            <div className="cm-parent-name">
                              <FontAwesomeIcon icon={faFolderOpen} className="cm-parent-icon" />
                              {parent.cateName}
                            </div>
                          </td>
                          <td className="cm-td-desc">{parent.description || "—"}</td>
                          <td><span className="cm-badge">{parent.brandCount ?? 0}</span></td>
                          <td>
                            <div className="cm-td-actions">
                              <ActionButtons
                                onEdit={() => startEdit(parent)}
                                onDelete={() => del(parent.cateId)}
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Child rows */}
                        {childrenOf(parent.cateId).map((child) => (
                          <tr key={child.cateId}>
                            <td>
                              <div className="cm-child-name">
                                <span className="cm-child-indent">
                                  <FontAwesomeIcon icon={faChevronDown} style={{ transform: "rotate(-90deg)", fontSize: 9 }} />
                                </span>
                                <FontAwesomeIcon icon={faFolder} style={{ color: "#9ca3af", fontSize: 12 }} />
                                {child.cateName}
                              </div>
                            </td>
                            <td className="cm-td-desc">{child.description || "—"}</td>
                            <td><span className="cm-badge">{child.brandCount ?? 0}</span></td>
                            <td>
                              <div className="cm-td-actions">
                                <ActionButtons
                                  onEdit={() => startEdit(child)}
                                  onDelete={() => del(child.cateId)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="cm-mobile-list">
                {parents.map((parent) => (
                  <>
                    <div key={parent.cateId} className="cm-mobile-item cm-mobile-item--parent">
                      <div className="cm-mobile-info">
                        <div className="cm-mobile-name">
                          <FontAwesomeIcon icon={faFolderOpen} style={{ color: "var(--accent)", marginRight: 6 }} />
                          {parent.cateName}
                        </div>
                        {parent.description && (
                          <div className="cm-mobile-desc">{parent.description}</div>
                        )}
                        <div className="cm-mobile-meta">
                          <span className="cm-badge">{parent.brandCount ?? 0} thương hiệu</span>
                        </div>
                      </div>
                      <div className="cm-mobile-actions">
                        <ActionButtons
                          onEdit={() => startEdit(parent)}
                          onDelete={() => del(parent.cateId)}
                        />
                      </div>
                    </div>

                    {childrenOf(parent.cateId).map((child) => (
                      <div key={child.cateId} className="cm-mobile-item cm-mobile-item--child">
                        <div className="cm-mobile-info">
                          <div className="cm-mobile-name cm-mobile-name--child">
                            <FontAwesomeIcon icon={faFolder} style={{ color: "#9ca3af", marginRight: 6 }} />
                            {child.cateName}
                          </div>
                          {child.description && (
                            <div className="cm-mobile-desc">{child.description}</div>
                          )}
                          <div className="cm-mobile-meta">
                            <span className="cm-badge">{child.brandCount ?? 0} thương hiệu</span>
                          </div>
                        </div>
                        <div className="cm-mobile-actions">
                          <ActionButtons
                            onEdit={() => startEdit(child)}
                            onDelete={() => del(child.cateId)}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
}