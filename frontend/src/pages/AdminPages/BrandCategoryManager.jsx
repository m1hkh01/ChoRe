import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk, faSpinner, faLayerGroup,
  faBuilding, faChevronRight, faChevronDown,
  faCheckSquare, faSquare, faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .bcm {
    --accent:       var(--primary-color);
    --accent-hover: var(--primary-color-hover);
    --success:      var(--success);
    --border:       #e5e7eb;
    --bg:           #ffffff;
    --bg-sub:       #f9fafb;
    --bg-hover:     #f0fdf4;
    --text:         #111827;
    --text-sub:     #6b7280;
    --text-xs:      #9ca3af;
    --radius:       10px;
    --radius-sm:    6px;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --transition:   0.15s ease;
    --font:         'Inter', 'Segoe UI', sans-serif;
  }

  .bcm { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 20px; }

  /* ── Card ── */
  .bcm-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;
  }
  .bcm-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
  }
  .bcm-card-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .bcm-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .bcm-card-meta { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .bcm-badge {
    padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border); color: var(--text-sub);
  }
  .bcm-badge-green {
    background: #f0fdf4; border-color: #bbf7d0; color: #15803d;
  }

  /* ── Picker ── */
  .bcm-picker { padding: 18px 20px; }
  .bcm-label {
    display: block; font-size: 11.5px; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
    color: var(--text-sub); margin-bottom: 7px;
  }
  .bcm-picker-row { display: flex; align-items: center; gap: 10px; }
  .bcm-picker-icon { color: var(--accent); font-size: 15px; flex-shrink: 0; }
  .bcm-select {
    flex: 1; padding: 9px 34px 9px 12px;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
  }
  .bcm-select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.11); background: #fff;
  }

  /* ── Tree ── */
  .bcm-tree-wrap {
    padding: 14px 16px; max-height: 420px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 2px;
  }
  .bcm-tree-wrap::-webkit-scrollbar { width: 4px; }
  .bcm-tree-wrap::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

  /* Node row */
  .bcm-node { display: flex; flex-direction: column; }
  .bcm-node-row {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px; border-radius: var(--radius-sm);
    cursor: pointer; user-select: none;
    transition: background var(--transition);
  }
  .bcm-node-row:hover { background: var(--bg-hover); }
  .bcm-node-row--checked { background: #f0fdf4; }

  /* Expand toggle */
  .bcm-toggle-btn {
    width: 18px; height: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: none; background: none; cursor: pointer;
    color: var(--text-xs); font-size: 10px; border-radius: 3px;
    transition: color var(--transition), background var(--transition);
  }
  .bcm-toggle-btn:hover { background: #e5e7eb; color: var(--text-sub); }
  .bcm-toggle-spacer { width: 18px; flex-shrink: 0; }

  /* Custom checkbox */
  .bcm-checkbox {
    width: 17px; height: 17px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
  }
  .bcm-checkbox--checked   { color: var(--accent); }
  .bcm-checkbox--partial   { color: #f59e0b; }
  .bcm-checkbox--unchecked { color: #d1d5db; }

  /* Node label */
  .bcm-node-label {
    font-size: 13.5px; flex: 1; min-width: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .bcm-node-label--parent { font-weight: 600; color: var(--text); }
  .bcm-node-label--child  { font-weight: 400; color: var(--text-sub); }
  .bcm-node-label--checked { color: var(--text) !important; }

  /* Children indent */
  .bcm-children { margin-left: 26px; border-left: 1.5px solid #f0f0f0; padding-left: 8px; }

  /* ── Footer ── */
  .bcm-footer {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    gap: 10px; padding: 14px 20px;
    border-top: 1px solid var(--border); background: var(--bg-sub);
  }
  .bcm-footer-info { font-size: 12.5px; color: var(--text-sub); }
  .bcm-footer-info strong { color: var(--accent); }

  /* ── Buttons ── */
  .bcm-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    border: 1px solid transparent; cursor: pointer; transition: all var(--transition);
  }
  .bcm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .bcm-btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .bcm-btn-primary:hover:not(:disabled) { background: var(--accent-hover); border-color: var(--accent-hover); }
  .bcm-btn-ghost {
    background: transparent; border-color: var(--border); color: var(--text-sub); font-size: 12px; padding: 5px 12px;
  }
  .bcm-btn-ghost:hover { background: #e5e7eb; }

  /* ── Success toast ── */
  .bcm-toast {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: var(--radius-sm);
    background: #f0fdf4; border: 1px solid #bbf7d0;
    font-size: 13px; font-weight: 500; color: #15803d;
    animation: bcmFadeIn 0.2s ease;
  }
  @keyframes bcmFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

  /* ── Empty / Loading ── */
  .bcm-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 50px 24px; gap: 10px; color: var(--text-sub);
  }
  .bcm-state-icon { font-size: 30px; opacity: 0.28; }
  .bcm-state-text { font-size: 13.5px; font-weight: 500; }
  .bcm-state-sub  { font-size: 12px; color: var(--text-xs); }
  .bcm-spinner { animation: bcmSpin 0.8s linear infinite; }
  @keyframes bcmSpin { to { transform: rotate(360deg); } }

  /* ── Mobile ── */
  @media (max-width: 580px) {
    .bcm-picker-row { flex-direction: column; align-items: stretch; }
    .bcm-picker-icon { display: none; }
    .bcm-tree-wrap { max-height: 360px; padding: 10px 12px; }
    .bcm-footer { flex-direction: column; align-items: stretch; }
    .bcm-btn-primary { justify-content: center; }
  }
`;

// ─── Tree helpers ─────────────────────────────────────────────────────────────

/** Collect all descendant cateIds */
function getAllDescendants(node) {
  return (node.children ?? []).flatMap((c) => [c.cateId, ...getAllDescendants(c)]);
}

/** Find ancestor cateIds of a targetId */
function findAncestors(nodes, targetId, ancestors = []) {
  for (const node of nodes) {
    if (node.cateId === targetId) return ancestors;
    const found = findAncestors(node.children ?? [], targetId, [...ancestors, node.cateId]);
    if (found) return found;
  }
  return null;
}

/** Find node by cateId */
function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.cateId === id) return n;
    const found = findNode(n.children ?? [], id);
    if (found) return found;
  }
  return null;
}

/** Count all nodes in tree */
function countNodes(nodes) {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children ?? []), 0);
}

// ─── CategoryNode ─────────────────────────────────────────────────────────────

function CategoryNode({ node, checkedIds, onToggle, tree, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0);

  const hasChildren = node.children?.length > 0;
  const isChecked   = checkedIds.includes(node.cateId);
  const descendants = getAllDescendants(node);
  const checkedDescendants = descendants.filter((id) => checkedIds.includes(id));
  const isPartial   = !isChecked && checkedDescendants.length > 0;

  const checkIcon = isChecked  ? faCheckSquare
                  : isPartial  ? faMinusSquare
                  : faSquare;
  const checkClass = isChecked  ? "bcm-checkbox--checked"
                   : isPartial  ? "bcm-checkbox--partial"
                   : "bcm-checkbox--unchecked";

  return (
    <div className="bcm-node">
      <div
        className={`bcm-node-row${isChecked ? " bcm-node-row--checked" : ""}`}
        onClick={() => onToggle(node, !isChecked)}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            className="bcm-toggle-btn"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            aria-label={expanded ? "Thu gọn" : "Mở rộng"}
          >
            <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />
          </button>
        ) : (
          <span className="bcm-toggle-spacer" />
        )}

        {/* Checkbox icon */}
        <span className={`bcm-checkbox ${checkClass}`}>
          <FontAwesomeIcon icon={checkIcon} />
        </span>

        {/* Label */}
        <span className={`bcm-node-label ${hasChildren ? "bcm-node-label--parent" : "bcm-node-label--child"}${isChecked ? " bcm-node-label--checked" : ""}`}>
          {node.cateName}
        </span>

        {/* Count badge when partially selected */}
        {isPartial && (
          <span className="bcm-badge" style={{ fontSize: 10 }}>
            {checkedDescendants.length}/{descendants.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="bcm-children">
          {node.children.map((child) => (
            <CategoryNode
              key={child.cateId}
              node={child}
              checkedIds={checkedIds}
              onToggle={onToggle}
              tree={tree}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BrandCategoryManager ─────────────────────────────────────────────────────

export default function BrandCategoryManager() {
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandId,    setBrandId]    = useState("");
  const [checkedIds, setCheckedIds] = useState([]);

  const [loadingTree, setLoadingTree] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/brands"),
      api.get("/api/admin/categories/tree"),
    ]).then(([b, c]) => {
      setBrands(b.data);
      setCategories(c.data);
    });
  }, []);

  useEffect(() => {
    if (!brandId) { setCheckedIds([]); return; }
    setLoadingTree(true);
    api.get(`/api/admin/brand-categories/${brandId}`)
      .then((res) => setCheckedIds(res.data))
      .finally(() => setLoadingTree(false));
  }, [brandId]);

  // ── Toggle ────────────────────────────────────────────────────────────────

  const handleToggle = useCallback((node, checked) => {
    setSaved(false);
    setCheckedIds((prev) => {
      let next = new Set(prev);
      const descendants = getAllDescendants(node);

      if (checked) {
        next.add(node.cateId);
        descendants.forEach((id) => next.add(id));
        const ancestors = findAncestors(categories, node.cateId) ?? [];
        ancestors.forEach((id) => next.add(id));
      } else {
        next.delete(node.cateId);
        descendants.forEach((id) => next.delete(id));
      }

      return Array.from(next);
    });
  }, [categories]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      // Send only leaf nodes — backend handles ancestor propagation
      const leafIds = checkedIds.filter((id) => {
        const node = findNode(categories, id);
        return node && !node.children?.length;
      });

      await api.put("/api/admin/brand-categories", {
        brandId: Number(brandId),
        cateIds: leafIds,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data ?? "Lỗi khi lưu phân loại");
    } finally {
      setSaving(false);
    }
  };

  // ── Select all / none ─────────────────────────────────────────────────────

  const selectAll = () => {
    const all = [];
    const collect = (nodes) => nodes.forEach((n) => { all.push(n.cateId); collect(n.children ?? []); });
    collect(categories);
    setCheckedIds(all);
    setSaved(false);
  };

  const selectNone = () => { setCheckedIds([]); setSaved(false); };

  // ── Derived ───────────────────────────────────────────────────────────────

  const selectedBrand = brands.find((b) => b.brandId === Number(brandId));
  const totalNodes    = countNodes(categories);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bcm">

        {/* ── Brand picker card ── */}
        <div className="bcm-card">
          <div className="bcm-card-header">
            <div className="bcm-card-dot" />
            <span className="bcm-card-title">Phân loại thương hiệu</span>
          </div>

          <div className="bcm-picker">
            <label className="bcm-label">Chọn thương hiệu</label>
            <div className="bcm-picker-row">
              <FontAwesomeIcon icon={faBuilding} className="bcm-picker-icon" />
              <select
                className="bcm-select"
                value={brandId}
                onChange={(e) => { setBrandId(e.target.value); setSaved(false); }}
              >
                <option value="">— Chọn thương hiệu —</option>
                {brands.map((b) => (
                  <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Category tree card ── */}
        {brandId ? (
          <div className="bcm-card">
            <div className="bcm-card-header">
              <div className="bcm-card-dot" />
              <span className="bcm-card-title">
                Danh mục của <strong>{selectedBrand?.brandName}</strong>
              </span>
              <div className="bcm-card-meta">
                {!loadingTree && (
                  <span className={`bcm-badge${checkedIds.length ? " bcm-badge-green" : ""}`}>
                    {checkedIds.length} / {totalNodes} đã chọn
                  </span>
                )}
                <button className="bcm-btn bcm-btn-ghost" onClick={selectAll}>Tất cả</button>
                <button className="bcm-btn bcm-btn-ghost" onClick={selectNone}>Bỏ chọn</button>
              </div>
            </div>

            {loadingTree ? (
              <div className="bcm-state">
                <FontAwesomeIcon icon={faSpinner} className="bcm-state-icon bcm-spinner" />
                <span className="bcm-state-text">Đang tải…</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="bcm-state">
                <FontAwesomeIcon icon={faLayerGroup} className="bcm-state-icon" />
                <span className="bcm-state-text">Không có danh mục nào</span>
              </div>
            ) : (
              <div className="bcm-tree-wrap" role="tree">
                {categories.map((node) => (
                  <CategoryNode
                    key={node.cateId}
                    node={node}
                    checkedIds={checkedIds}
                    onToggle={handleToggle}
                    tree={categories}
                    depth={0}
                  />
                ))}
              </div>
            )}

            <div className="bcm-footer">
              <div className="bcm-footer-info">
                Đã chọn <strong>{checkedIds.length}</strong> danh mục
                {checkedIds.length > 0 && ` · ${checkedIds.length} sẽ được lưu`}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {saved && (
                  <div className="bcm-toast">
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    Đã lưu thành công
                  </div>
                )}
                <button
                  className="bcm-btn bcm-btn-primary"
                  onClick={handleSave}
                  disabled={saving || loadingTree}
                >
                  {saving
                    ? <FontAwesomeIcon icon={faSpinner} className="bcm-spinner" />
                    : <FontAwesomeIcon icon={faFloppyDisk} />
                  }
                  Lưu phân loại
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bcm-card">
            <div className="bcm-state">
              <FontAwesomeIcon icon={faBuilding} className="bcm-state-icon" />
              <span className="bcm-state-text">Chọn thương hiệu để bắt đầu</span>
              <span className="bcm-state-sub">Danh mục sẽ hiện sau khi bạn chọn thương hiệu phía trên</span>
            </div>
          </div>
        )}

      </div>
    </>
  );
}