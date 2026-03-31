import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faPen, faTrash, faXmark,
  faSpinner, faInbox, faBuilding,
  faImage, faCheck, faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import api, { API_BASE_URL } from "@/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  brandId: null, brandName: "", description: "", parentBrandId: "", cateIds: [],
};

const ENDPOINTS = {
  brands: "/api/admin/brands",
  brandTree: "/api/admin/brands/tree",
  cateList: "/api/admin/categories",
  cateTree: "/api/admin/categories/tree",
  create: "/api/admin/brands",
  update: (id) => `/api/admin/brands/update/${id}`,
  delete: (id) => `/api/admin/brands/delete/${id}`,
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .bm {
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

  .bm { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 20px; }

  /* Card */
  .bm-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
  .bm-card-header { display: flex; align-items: center; gap: 9px; padding: 14px 20px; border-bottom: 1px solid var(--border); background: var(--bg-sub); }
  .bm-card-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .bm-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .bm-card-badge {
    margin-left: auto; padding: 2px 9px; border-radius: 999px;
    font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }

  /* Form */
  .bm-form { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .bm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 640px) { .bm-grid-2 { grid-template-columns: 1fr; } }

  .bm-field { display: flex; flex-direction: column; gap: 5px; }
  .bm-label { font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--text-sub); }
  .bm-label-req { color: #dc2626; margin-left: 2px; }

  .bm-input, .bm-select, .bm-textarea {
    padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: var(--font); color: var(--text); background: var(--bg-sub);
    outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  }
  .bm-input:focus, .bm-select:focus, .bm-textarea:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.11); background: #fff;
  }
  .bm-input--error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,0.09) !important; }
  .bm-textarea { resize: vertical; min-height: 80px; }
  .bm-select-arrow {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
  }

  /* Multi-select */
  .bm-multiselect { min-height: 140px; padding: 6px; }
  .bm-multiselect option { padding: 6px 8px; border-radius: 4px; font-size: 13px; }
  .bm-multiselect option:checked { background: var(--accent); color: #fff; }
  .bm-multiselect:disabled { opacity: 0.5; cursor: not-allowed; background: #f3f4f6; }
  .bm-select-hint { font-size: 11.5px; color: var(--text-xs); margin-top: 4px; }

  /* Inherit notice */
  .bm-inherit-notice {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: var(--radius-sm);
    background: #fffbeb; border: 1px solid #fde68a;
    font-size: 12.5px; color: #92400e;
  }
  .bm-inherit-notice svg { flex-shrink: 0; color: #d97706; }

  /* Selected tags */
  .bm-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .bm-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 999px; font-size: 12px; font-weight: 500;
    background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
  }
  .bm-tag-x {
    background: none; border: none; cursor: pointer; color: #6b7280;
    font-size: 10px; padding: 0; line-height: 1; display: flex; transition: color var(--transition);
  }
  .bm-tag-x:hover { color: #dc2626; }

  /* Logo upload */
  .bm-logo-area { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .bm-logo-preview {
    width: 60px; height: 60px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--bg-sub);
    display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;
  }
  .bm-logo-preview img { width: 100%; height: 100%; object-fit: contain; }
  .bm-logo-preview-icon { color: var(--text-xs); font-size: 20px; }
  .bm-logo-upload { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
  .bm-file-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
    border-radius: var(--radius-sm); border: 1px dashed var(--border); background: var(--bg-sub);
    font-size: 13px; font-family: var(--font); color: var(--text-sub);
    cursor: pointer; transition: all var(--transition); width: fit-content;
  }
  .bm-file-btn:hover { border-color: var(--accent); color: var(--accent); background: #f0fdf4; }
  .bm-file-name { font-size: 12px; color: var(--text-xs); }

  /* Error */
  .bm-error {
    display: flex; align-items: center; gap: 6px; padding: 8px 12px;
    border-radius: var(--radius-sm); background: #fff5f5; border: 1px solid #fecaca;
    font-size: 12.5px; color: #dc2626;
  }

  .bm-form-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* Buttons */
  .bm-btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
    border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; font-family: var(--font);
    border: 1px solid transparent; cursor: pointer; transition: all var(--transition);
  }
  .bm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .bm-btn-primary  { background: var(--accent); border-color: var(--accent); color: #fff; }
  .bm-btn-primary:hover:not(:disabled) { background: var(--accent-hover); border-color: var(--accent-hover); }
  .bm-btn-secondary { background: var(--bg-sub); border-color: var(--border); color: var(--text-sub); }
  .bm-btn-secondary:hover { background: #e5e7eb; }

  .bm-btn-icon {
    width: 30px; height: 30px; padding: 0; border-radius: var(--radius-sm);
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid transparent; font-size: 12px; cursor: pointer; transition: all var(--transition);
  }
  .bm-btn-edit { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .bm-btn-edit:hover { background: #fef3c7; }
  .bm-btn-del  { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .bm-btn-del:hover  { background: #fee2e2; }

  /* Table */
  .bm-table-wrap { overflow-x: auto; }
  table.bm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .bm-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .bm-table th {
    padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .bm-table td { padding: 11px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .bm-table tbody tr { transition: background var(--transition); }
  .bm-table tbody tr:hover { background: var(--bg-hover); }
  .bm-table tbody tr:last-child td { border-bottom: none; }

  .bm-logo-cell {
    width: 44px; height: 44px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg-sub);
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .bm-logo-cell img { width: 100%; height: 100%; object-fit: contain; }
  .bm-logo-cell-icon { color: var(--text-xs); font-size: 16px; }

  .bm-brand-name { font-weight: 600; }
  .bm-parent-badge {
    display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px;
    font-size: 11.5px; font-weight: 500; background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }
  .bm-td-actions { display: flex; gap: 6px; }

  /* State */
  .bm-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 50px 24px; gap: 10px; color: var(--text-sub);
  }
  .bm-state-icon { font-size: 30px; opacity: 0.28; }
  .bm-state-text { font-size: 13.5px; font-weight: 500; }
  .bm-spinner { animation: bmSpin 0.8s linear infinite; }
  @keyframes bmSpin { to { transform: rotate(360deg); } }

  /* Mobile */
  @media (max-width: 600px) { .bm-table-wrap { display: none; } }
  @media (min-width: 601px) { .bm-mobile-list { display: none; } }
  .bm-mobile-item {
    padding: 13px 16px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; gap: 12px; transition: background var(--transition);
  }
  .bm-mobile-item:last-child { border-bottom: none; }
  .bm-mobile-item:hover { background: var(--bg-hover); }
  .bm-mobile-logo {
    width: 40px; height: 40px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg-sub); display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .bm-mobile-logo img { width: 100%; height: 100%; object-fit: contain; }
  .bm-mobile-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .bm-mobile-name { font-size: 13.5px; font-weight: 600; color: var(--text); }
  .bm-mobile-parent { font-size: 12px; color: var(--text-xs); }
  .bm-mobile-actions { display: flex; gap: 6px; flex-shrink: 0; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderTreeOptions(nodes, level = 0) {
  return nodes.flatMap((n) => [
    <option key={n.brandId ?? n.cateId} value={n.brandId ?? n.cateId}>
      {"  ".repeat(level)}{level > 0 ? "↳ " : ""}{n.brandName ?? n.cateName}
    </option>,
    ...renderTreeOptions(n.subBrands ?? n.children ?? [], level + 1),
  ]);
}

function collectAncestors(tree, targetId, ancestors = []) {
  for (const node of tree) {
    if (node.cateId === targetId) return ancestors;
    const found = collectAncestors(node.children ?? [], targetId, [...ancestors, node.cateId]);
    if (found) return found;
  }
  return null;
}

function parseApiError(err) {
  const d = err.response?.data;
  if (!d) return "Có lỗi xảy ra";
  if (typeof d === "string") return d;
  if (d.title) return d.title;
  if (d.errors) return Object.values(d.errors).flat().join(", ");
  return "Có lỗi xảy ra";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LogoPreview({ file, src }) {
  if (file) return <img src={URL.createObjectURL(file)} alt="preview" />;
  if (src) return <img src={`${API_BASE_URL}/brands/${src}`} alt="logo" />;
  return <FontAwesomeIcon icon={faImage} className="bm-logo-preview-icon" />;
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <>
      <button className="bm-btn-icon bm-btn-edit" title="Sửa" onClick={onEdit}>
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button className="bm-btn-icon bm-btn-del" title="Xóa" onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BrandManager() {
  const [brands, setBrands] = useState([]);
  const [brandTree, setBrandTree] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [logo, setLogo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hãng con không được chọn danh mục — kế thừa từ hãng cha
  const isSubBrand = !!form.parentBrandId;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const loadBrands = useCallback(async () => {
    const [listRes, treeRes] = await Promise.all([
      api.get(ENDPOINTS.brands),
      api.get(ENDPOINTS.brandTree),
    ]);
    setBrands(listRes.data);
    setBrandTree(treeRes.data);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [cateRes, cateTreeRes] = await Promise.all([
          api.get(ENDPOINTS.cateList),
          api.get(ENDPOINTS.cateTree),
        ]);
        setCategories(cateRes.data);
        setCategoryTree(cateTreeRes.data);
        await loadBrands();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadBrands]);

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setLogo(null);
    setError("");
    setIsEditing(false);
  };

  const startEdit = (brand) => {
    setIsEditing(true);
    setError("");
    setLogo(null);
    setForm({
      brandId: brand.brandId,
      brandName: brand.brandName,
      description: brand.description ?? "",
      parentBrandId: brand.parentBrandId ?? "",
      cateIds: brand.cateIds ?? [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Khi đổi hãng cha → xóa danh mục đã chọn nếu chuyển sang hãng con
  const handleParentBrandChange = (value) => {
    setField("parentBrandId", value);
    if (value) setField("cateIds", []);   // hãng con không giữ danh mục
  };

  // ── Category multi-select ─────────────────────────────────────────────────

  const handleCategoryChange = (selectedOptions) => {
    const selectedIds = Array.from(selectedOptions, (o) => Number(o.value));
    const allIds = new Set(selectedIds);
    selectedIds.forEach((id) => {
      (collectAncestors(categoryTree, id) ?? []).forEach((aid) => allIds.add(aid));
    });
    setField("cateIds", Array.from(allIds));
  };

  const removeCateId = (id) =>
    setField("cateIds", form.cateIds.filter((c) => c !== id));

  const cateLabel = (id) =>
    categories.find((c) => c.cateId === id)?.cateName ?? `#${id}`;

  // ── Submit ────────────────────────────────────────────────────────────────

  const submit = async () => {
    if (!form.brandName.trim()) return setError("Tên thương hiệu là bắt buộc");
    if (!form.cateIds.length)
      return setError("Vui lòng chọn ít nhất 1 danh mục");

    setError("");
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("BrandName", form.brandName.trim());
      fd.append("Description", form.description.trim());
      if (form.parentBrandId) fd.append("ParentBrandId", Number(form.parentBrandId));

      // Chỉ gửi cateIds khi là hãng gốc
      form.cateIds.forEach((id) => fd.append("CateIds", Number(id)));

      if (logo) fd.append("logo", logo);

      const url = isEditing ? ENDPOINTS.update(form.brandId) : ENDPOINTS.create;
      await api.post(url, fd);

      resetForm();
      await loadBrands();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const del = async (id) => {
    if (!window.confirm("Xóa thương hiệu này?")) return;
    try {
      await api.post(ENDPOINTS.delete(id));
      await loadBrands();
    } catch (err) {
      alert(parseApiError(err));
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const currentLogo = isEditing
    ? brands.find((b) => b.brandId === form.brandId)?.brandLogo
    : null;

  const parentBrandName = isSubBrand
    ? brands.find((b) => b.brandId === Number(form.parentBrandId))?.brandName
    : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bm">

        {/* Form card */}
        <div className="bm-card">
          <div className="bm-card-header">
            <div className="bm-card-dot" />
            <span className="bm-card-title">
              {isEditing ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
            </span>
          </div>

          <div className="bm-form">
            {error && (
              <div className="bm-error">
                <FontAwesomeIcon icon={faXmark} /> {error}
              </div>
            )}

            <div className="bm-grid-2">
              {/* Brand name */}
              <div className="bm-field">
                <label className="bm-label">
                  Tên thương hiệu <span className="bm-label-req">*</span>
                </label>
                <input
                  className={`bm-input${error && !form.brandName.trim() ? " bm-input--error" : ""}`}
                  placeholder="VD: Samsung, Apple…"
                  value={form.brandName}
                  onChange={(e) => setField("brandName", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>

              {/* Parent brand */}
              <div className="bm-field">
                <label className="bm-label">Thương hiệu cha</label>
                <select
                  className="bm-select bm-select-arrow"
                  value={form.parentBrandId}
                  onChange={(e) => setField("parentBrandId", e.target.value)}
                >
                  <option value="">— Thương hiệu gốc —</option>
                  {renderTreeOptions(brandTree)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="bm-field">
              <label className="bm-label">Mô tả</label>
              <textarea
                className="bm-textarea"
                placeholder="Mô tả ngắn về thương hiệu…"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Logo */}
            <div className="bm-field">
              <label className="bm-label">Logo</label>
              <div className="bm-logo-area">
                <div className="bm-logo-preview">
                  <LogoPreview file={logo} src={currentLogo} />
                </div>
                <div className="bm-logo-upload">
                  <label className="bm-file-btn">
                    <FontAwesomeIcon icon={faImage} />
                    Chọn ảnh
                    <input
                      type="file" accept="image/*" hidden
                      onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className="bm-file-name">
                    {logo ? logo.name : "PNG, JPG, SVG — tối đa 2 MB"}
                  </span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bm-field">
              <label className="bm-label">
                Danh mục
                {!isSubBrand && <span className="bm-label-req">*</span>}
              </label>



              <select
                multiple
                className="bm-select bm-multiselect"
                value={form.cateIds.map(String)}
                onChange={(e) => handleCategoryChange(e.target.selectedOptions)}
              >
                {renderTreeOptions(categoryTree)}
              </select>
              <span className="bm-select-hint">
                Ctrl (Windows) / Cmd (Mac) để chọn nhiều · Danh mục cha tự động được thêm
              </span>

              {form.cateIds.length > 0 && (
                <div className="bm-tags">
                  {form.cateIds.map((id) => (
                    <span key={id} className="bm-tag">
                      <FontAwesomeIcon icon={faCheck} style={{ fontSize: 9 }} />
                      {cateLabel(id)}
                      <button
                        className="bm-tag-x"
                        onClick={() => removeCateId(id)}
                        aria-label="Bỏ chọn"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </span>
                  ))}
                </div>
              )}


            </div>

            <div className="bm-form-actions">
              <button className="bm-btn bm-btn-primary" onClick={submit} disabled={submitting}>
                {submitting
                  ? <FontAwesomeIcon icon={faSpinner} className="bm-spinner" />
                  : <FontAwesomeIcon icon={isEditing ? faPen : faPlus} />
                }
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </button>
              {isEditing && (
                <button className="bm-btn bm-btn-secondary" onClick={resetForm}>
                  <FontAwesomeIcon icon={faXmark} /> Huỷ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List card */}
        <div className="bm-card">
          <div className="bm-card-header">
            <div className="bm-card-dot" />
            <span className="bm-card-title">Danh sách thương hiệu</span>
            {!loading && <span className="bm-card-badge">{brands.length} thương hiệu</span>}
          </div>

          {loading ? (
            <div className="bm-state">
              <FontAwesomeIcon icon={faSpinner} className="bm-state-icon bm-spinner" />
              <span className="bm-state-text">Đang tải…</span>
            </div>
          ) : brands.length === 0 ? (
            <div className="bm-state">
              <FontAwesomeIcon icon={faBuilding} className="bm-state-icon" />
              <span className="bm-state-text">Chưa có thương hiệu nào</span>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="bm-table-wrap">
                <table className="bm-table">
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Tên thương hiệu</th>
                      <th>Thương hiệu cha</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((b) => (
                      <tr key={b.brandId}>
                        <td>
                          <div className="bm-logo-cell">
                            {b.brandLogo
                              ? <img src={`${API_BASE_URL}/brands/${b.brandLogo}`} alt={b.brandName} />
                              : <FontAwesomeIcon icon={faBuilding} className="bm-logo-cell-icon" />
                            }
                          </div>
                        </td>
                        <td className="bm-brand-name">{b.brandName}</td>
                        <td>
                          {b.parentBrandName
                            ? <span className="bm-parent-badge">{b.parentBrandName}</span>
                            : <span style={{ color: "var(--text-xs)" }}>—</span>
                          }
                        </td>
                        <td>
                          <div className="bm-td-actions">
                            <ActionButtons
                              onEdit={() => startEdit(b)}
                              onDelete={() => del(b.brandId)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="bm-mobile-list">
                {brands.map((b) => (
                  <div key={b.brandId} className="bm-mobile-item">
                    <div className="bm-mobile-logo">
                      {b.brandLogo
                        ? <img src={`${API_BASE_URL}/brands/${b.brandLogo}`} alt={b.brandName} />
                        : <FontAwesomeIcon icon={faBuilding} style={{ color: "var(--text-xs)", fontSize: 16 }} />
                      }
                    </div>
                    <div className="bm-mobile-info">
                      <div className="bm-mobile-name">{b.brandName}</div>
                      {b.parentBrandName && (
                        <div className="bm-mobile-parent">↳ {b.parentBrandName}</div>
                      )}
                    </div>
                    <div className="bm-mobile-actions">
                      <ActionButtons
                        onEdit={() => startEdit(b)}
                        onDelete={() => del(b.brandId)}
                      />
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