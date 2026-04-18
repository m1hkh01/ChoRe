import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faSlidersH, faChevronDown, faChevronUp,
  faTimes, faSpinner, faBoxOpen, faMapMarkerAlt, faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import PostCard from "@/components/Post/PostCard";
import provinceData from "@/data/sauSapNhap/province.json";
import wardData from "@/data/sauSapNhap/ward.json";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .sp {
    background: #f1f5f9;
    min-height: 100vh;
  }

  .sp-layout {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px 20px 60px;
    display: flex;
    gap: 22px;
    align-items: flex-start;
  }

  /* ── Sidebar ── */
  .sp-sidebar {
    width: 248px;
    flex-shrink: 0;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    position: sticky;
    top: 80px;
    max-height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
  }

  .sp-sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  .sp-sidebar-head-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .sp-reset {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
    padding: 3px 7px;
    border-radius: 6px;
    transition: background 0.12s;
  }
  .sp-reset:hover { background: #fef2f2; }

  .sp-sidebar-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0 16px;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }
  .sp-sidebar-body::-webkit-scrollbar       { width: 3px; }
  .sp-sidebar-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

  .sp-sidebar-foot {
    padding: 12px 14px;
    border-top: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  .sp-apply-btn {
    width: 100%;
    padding: 10px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
  }
  .sp-apply-btn:hover { background: #16a34a; }

  /* ── Filter section accordion ── */
  .sp-section { border-bottom: 1px solid #f8fafc; }

  .sp-section-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    font-size: 12px;
    font-weight: 700;
    color: #374151;
    cursor: pointer;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: background 0.12s;
  }
  .sp-section-btn:hover { background: #f8fafc; }
  .sp-section-btn svg   { font-size: 10px; color: #94a3b8; }

  .sp-section-body { padding: 4px 12px 12px; }

  /* ── Brand search input ── */
  .sp-brand-search {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 5px 9px;
    margin-bottom: 8px;
    background: #f8fafc;
    transition: border-color 0.15s;
  }
  .sp-brand-search:focus-within { border-color: #22c55e; background: #fff; }
  .sp-brand-search svg           { font-size: 11px; color: #94a3b8; flex-shrink: 0; }

  .sp-brand-search input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 12px;
    background: transparent;
    color: #374151;
    min-width: 0;
  }
  .sp-brand-search input::placeholder { color: #b0b8c1; }

  .sp-brand-search-clear {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 10px;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.12s;
  }
  .sp-brand-search-clear:hover { color: #ef4444; }

  /* ── Brand tree — dùng lại cùng class với category tree ── */
  .sp-brand-empty {
    font-size: 12px;
    color: #94a3b8;
    padding: 8px 4px;
    text-align: center;
  }

  /* ── Cate search — dùng lại cùng style brand search ── */
  .sp-cate-search {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 5px 9px;
    margin-bottom: 8px;
    background: #f8fafc;
    transition: border-color 0.15s;
  }
  .sp-cate-search:focus-within { border-color: #22c55e; background: #fff; }
  .sp-cate-search svg           { font-size: 11px; color: #94a3b8; flex-shrink: 0; }

  .sp-cate-search input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 12px;
    background: transparent;
    color: #374151;
    min-width: 0;
  }
  .sp-cate-search input::placeholder { color: #b0b8c1; }

  .sp-cate-search-clear {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 10px;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.12s;
  }
  .sp-cate-search-clear:hover { color: #ef4444; }

  /* ── Radio list ── */
  .sp-radio-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sp-radio {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 7px;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    transition: background 0.12s;
  }
  .sp-radio:hover        { background: #f8fafc; }
  .sp-radio.on           { background: #f0fdf4; color: #16a34a; font-weight: 600; }
  .sp-radio input        { accent-color: #22c55e; flex-shrink: 0; }

  /* ── Category tree ── */
  .sp-cate-node { }

  .sp-cate-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .sp-cate-expand {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    flex-shrink: 0;
    transition: color 0.12s;
  }
  .sp-cate-expand:hover { color: #22c55e; }
  .sp-cate-expand svg   { font-size: 9px; transition: transform 0.2s; }
  .sp-cate-expand.open svg { transform: rotate(90deg); }

  .sp-cate-spacer { width: 20px; flex-shrink: 0; }

  .sp-cate-label {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 6px;
    border-radius: 7px;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    transition: background 0.12s;
  }
  .sp-cate-label:hover { background: #f8fafc; }
  .sp-cate-label.on    { background: #f0fdf4; color: #16a34a; font-weight: 600; }
  .sp-cate-label input { accent-color: #22c55e; }

  .sp-cate-children { padding-left: 14px; }

  /* ── Price ── */
  .sp-price-quick {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
  }

  .sp-price-quick-btn {
    padding: 4px 9px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 11px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.12s;
  }
  .sp-price-quick-btn:hover { border-color: #22c55e; color: #16a34a; }
  .sp-price-quick-btn.on    { background: #22c55e; border-color: #22c55e; color: #fff; }

  .sp-price-inputs { display: flex; align-items: center; gap: 6px; }

  .sp-price-inputs input {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    font-size: 12px;
    outline: none;
    background: #f8fafc;
    transition: border-color 0.15s;
    min-width: 0;
  }
  .sp-price-inputs input:focus { border-color: #22c55e; background: #fff; }

  .sp-price-sep { font-size: 12px; color: #94a3b8; flex-shrink: 0; }

  /* ── Location ── */
  .sp-location-selects { display: flex; flex-direction: column; gap: 8px; }

  .sp-loc-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0 10px;
    background: #f8fafc;
    transition: border-color 0.15s;
  }
  .sp-loc-wrap:focus-within { border-color: #22c55e; background: #fff; }
  .sp-loc-wrap svg           { font-size: 11px; color: #94a3b8; flex-shrink: 0; }

  .sp-loc-select {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 12px;
    color: #374151;
    padding: 7px 0;
    cursor: pointer;
  }

  .sp-hint {
    font-size: 11px;
    color: #22c55e;
    font-weight: 500;
  }

  /* ── Main area ── */
  .sp-main { flex: 1; min-width: 0; }

  .sp-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .sp-toolbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sp-mobile-filter-btn {
    display: none;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s;
  }
  .sp-mobile-filter-btn:hover { border-color: #22c55e; color: #16a34a; }

  .sp-filter-badge {
    background: #22c55e;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    padding: 1px 6px;
  }

  .sp-result        { font-size: 13px; color: #64748b; }
  .sp-result strong { color: #0f172a; }

  .sp-sort {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    color: #374151;
    background: #fff;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .sp-sort:focus { border-color: #22c55e; }

  .sp-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }

  .sp-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.3);
    color: #16a34a;
    border-radius: 999px;
    padding: 4px 10px 4px 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .sp-pill button {
    background: none;
    border: none;
    color: #16a34a;
    font-size: 11px;
    cursor: pointer;
    padding: 0;
    opacity: 0.7;
    transition: opacity 0.12s;
  }
  .sp-pill button:hover { opacity: 1; }

  .sp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
  }

  .sp-loading, .sp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 72px 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    text-align: center;
    color: #94a3b8;
  }

  .sp-loading svg { font-size: 28px; color: #22c55e; }
  .sp-empty   svg { font-size: 40px; opacity: 0.3; }
  .sp-empty h3    { margin: 0; font-size: 15px; font-weight: 600; color: #475569; }
  .sp-empty p     { margin: 0; font-size: 13px; }

  .sp-empty-reset {
    padding: 8px 20px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .sp-empty-reset:hover { background: #16a34a; }

  .sp-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 200;
    backdrop-filter: blur(2px);
  }

  .sp-drawer {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: min(84vw, 300px);
    background: #fff;
    z-index: 201;
    display: flex;
    flex-direction: column;
    box-shadow: 8px 0 32px rgba(0,0,0,0.15);
    overflow: hidden;
  }

  .sp-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    flex-shrink: 0;
  }

  .sp-drawer-close {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 13px; color: #64748b;
    transition: all 0.12s;
  }
  .sp-drawer-close:hover { background: #fee2e2; border-color: #ef4444; color: #ef4444; }

  .sp-drawer-body  { flex: 1; overflow-y: auto; }
  .sp-drawer-foot  { padding: 12px 14px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }

  /* Node cha — không thể chọn, chỉ expand */
.sp-cate-label.is-parent {
  cursor: pointer;
  color: #1e293b;
  font-size: 12.5px;
  letter-spacing: 0.01em;
}
.sp-cate-label.is-parent:hover {
  background: #f1f5f9;
}
  
  @media (max-width: 900px) {
    .sp-sidebar           { display: none; }
    .sp-mobile-filter-btn { display: flex; }
    .sp-grid              { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
  }

  @media (max-width: 480px) {
    .sp-layout { padding: 16px 10px 48px; }
    .sp-grid   { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const API = "https://api.chore123.cloud/api";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];

const PRICE_RANGES = [
  { label: "< 1 tr", min: 0, max: 1000000 },
  { label: "1 – 3 tr", min: 1000000, max: 3000000 },
  { label: "3 – 5 tr", min: 3000000, max: 5000000 },
  { label: "5 – 10 tr", min: 5000000, max: 10000000 },
  { label: "> 10 tr", min: 10000000, max: null },
];

const PRICE_TYPES = [
  { value: "", label: "Tất cả" },
  { value: "NEGOTIABLE", label: "Thương lượng" },
  { value: "FIXED", label: "Giá cố định" },
  { value: "RANGE", label: "Khoảng giá" },
];

const provinces = Object.entries(provinceData)
  .map(([code, d]) => ({ code, name: d.name }))
  .sort((a, b) => a.name.localeCompare(b.name, "vi"));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPrice(p) {
  if (p.priceType === "FIXED") return p.price ?? 0;
  if (p.priceType === "RANGE") return ((p.minPrice ?? 0) + (p.maxPrice ?? 0)) / 2;
  return 0;
}

function flatten(nodes, acc = []) {
  nodes.forEach(n => {
    acc.push({ cateId: n.cateId, cateName: n.cateName });
    if (n.subCategories?.length) flatten(n.subCategories, acc);
  });
  return acc;
}

// Flatten brand tree thành map id → name để lookup cho pills
function flattenBrands(nodes, acc = {}) {
  nodes.forEach(n => {
    acc[n.brandId] = n.brandName;
    if (n.subBrands?.length) flattenBrands(n.subBrands, acc);
  });
  return acc;
}

// ─── Brand Tree — cùng cấu trúc với CategoryTree ─────────────────────────────

function BrandTree({ brands, selectedBrandId, onSelect }) {
  if (!brands || brands.length === 0)
    return <div className="sp-brand-empty">Không có thương hiệu</div>;

  return (
    <>
      {/* Tất cả */}
      <div className="sp-cate-node">
        <div className="sp-cate-row">
          <span className="sp-cate-spacer" />
          <label className={`sp-cate-label ${!selectedBrandId ? "on" : ""}`}>
            <input type="radio" name="brand" checked={!selectedBrandId}
              onChange={() => onSelect(null)} />
            Tất cả
          </label>
        </div>
      </div>

      {brands.map(parent => (
        <BrandNode
          key={parent.brandId}
          node={parent}
          selectedBrandId={selectedBrandId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function BrandNode({ node, selectedBrandId, onSelect }) {
  const hasSubs = node.subBrands?.length > 0;
  const isActive = selectedBrandId === node.brandId;
  const [expanded, setExpanded] = useState(
    hasSubs && node.subBrands.some(s => s.brandId === selectedBrandId)
  );

  return (
    <div className="sp-cate-node">
      <div className="sp-cate-row">
        {hasSubs ? (
          <button
            className={`sp-cate-expand ${expanded ? "open" : ""}`}
            onClick={() => setExpanded(v => !v)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        ) : (
          <span className="sp-cate-spacer" />
        )}
        <label
          className={`sp-cate-label ${isActive ? "on" : ""} ${hasSubs ? "is-parent" : ""}`}
          onClick={hasSubs ? (e) => { e.preventDefault(); setExpanded(v => !v); } : undefined}
        >
          {!hasSubs && (
            <input
              type="radio"
              name="brand"
              checked={isActive}
              onChange={() => onSelect(node.brandId)}
            />
          )}
          {node.brandName}
          {hasSubs && (
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
              ({node.subBrands.length})
            </span>
          )}
        </label>
      </div>
      {hasSubs && expanded && (
        <div className="sp-cate-children">
          {node.subBrands.map(sub => (
            <BrandNode
              key={sub.brandId}
              node={sub}
              selectedBrandId={selectedBrandId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
// ─── Category Tree component ──────────────────────────────────────────────────

function CategoryNode({ node, selected, onSelect }) {
  const hasSubs = node.subCategories?.length > 0;
  const isActive = selected === node.cateId;
  const [expanded, setExpanded] = useState(
    hasSubs && (isActive || node.subCategories?.some(s => s.cateId === selected))
  );

  return (
    <div className="sp-cate-node">
      <div className="sp-cate-row">
        {hasSubs ? (
          <button
            className={`sp-cate-expand ${expanded ? "open" : ""}`}
            onClick={() => setExpanded(v => !v)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        ) : (
          <span className="sp-cate-spacer" />
        )}
        <label
          className={`sp-cate-label ${isActive ? "on" : ""} ${hasSubs ? "is-parent" : ""}`}
          // Nếu có con → click chỉ toggle expand, không select
          onClick={hasSubs ? (e) => { e.preventDefault(); setExpanded(v => !v); } : undefined}
        >
          {/* Ẩn radio nếu là cha */}
          {!hasSubs && (
            <input
              type="radio"
              name="cate"
              checked={isActive}
              onChange={() => onSelect(node.cateId)}
            />
          )}
          {node.cateName}
          {hasSubs && (
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
              ({node.subCategories.length})
            </span>
          )}
        </label>
      </div>
      {hasSubs && expanded && (
        <div className="sp-cate-children">
          <CategoryTree
            nodes={node.subCategories}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
}

function CategoryTree({ nodes, selected, onSelect }) {
  return (
    <>
      {nodes.map(node => (
        <CategoryNode
          key={node.cateId}
          node={node}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({
  brandTree, brandKeyword, setBrandKeyword,
  selectedBrandId, setSelectedBrandId,
  cateKeyword, setCateKeyword,
  visibleHierarchy, selectedCateId, setSelectedCateId,
  selectedPriceType, handlePriceTypeChange,
  minPrice, setMinPrice, maxPrice, setMaxPrice,
  selectedProvinceCode, setSelectedProvinceCode,
  selectedWardCode, setSelectedWardCode,
  wardsForProvince, pendingAddressLabel, appliedAddress,
  activeCount, handleReset, handleApply,
}) {
  return (
    <>
      <div className="sp-sidebar-head">
        <span className="sp-sidebar-head-title">
          <FontAwesomeIcon icon={faSlidersH} /> Bộ lọc
        </span>
        {activeCount > 0 && (
          <button className="sp-reset" onClick={handleReset}>
            <FontAwesomeIcon icon={faTimes} /> Xoá
          </button>
        )}
      </div>

      <div className="sp-sidebar-body">

        {/* ── Thương hiệu ── */}
        <Section title="Thương hiệu">
          {/* Ô tìm kiếm brand */}
          <div className="sp-brand-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Tìm thương hiệu..."
              value={brandKeyword}
              onChange={e => setBrandKeyword(e.target.value)}
            />
            {brandKeyword && (
              <button className="sp-brand-search-clear" onClick={() => setBrandKeyword("")}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          {/* Cây brand cha-con */}
          <BrandTree
            brands={brandTree}
            selectedBrandId={selectedBrandId}
            onSelect={setSelectedBrandId}
          />
        </Section>

        {/* ── Danh mục ── */}
        <Section title="Danh mục">
          {/* Ô tìm kiếm danh mục */}
          <div className="sp-cate-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Tìm danh mục..."
              value={cateKeyword}
              onChange={e => setCateKeyword(e.target.value)}
            />
            {cateKeyword && (
              <button className="sp-cate-search-clear" onClick={() => setCateKeyword("")}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          <div className="sp-radio-list">
            <label className={`sp-radio ${!selectedCateId ? "on" : ""}`}>
              <input type="radio" name="cate" checked={!selectedCateId}
                onChange={() => setSelectedCateId(null)} />
              Tất cả danh mục
            </label>
            <CategoryTree
              nodes={visibleHierarchy}
              selected={selectedCateId}
              onSelect={setSelectedCateId}
            />
          </div>
        </Section>

        {/* ── Loại giá ── */}
        <Section title="Loại giá">
          <div className="sp-radio-list">
            {PRICE_TYPES.map(pt => (
              <label key={pt.value} className={`sp-radio ${selectedPriceType === pt.value ? "on" : ""}`}>
                <input type="radio" name="priceType" checked={selectedPriceType === pt.value}
                  onChange={() => handlePriceTypeChange(pt.value)} />
                {pt.label}
              </label>
            ))}
          </div>
        </Section>

        {/* ── Khoảng giá ── */}
        {selectedPriceType !== "NEGOTIABLE" && (
          <Section title="Khoảng giá">
            <div className="sp-price-quick">
              {PRICE_RANGES.map(r => (
                <button key={r.label}
                  className={`sp-price-quick-btn ${minPrice == r.min && maxPrice == (r.max ?? "") ? "on" : ""}`}
                  onClick={() => { setMinPrice(r.min ?? ""); setMaxPrice(r.max ?? ""); }}>
                  {r.label}
                </button>
              ))}
            </div>
            <div className="sp-price-inputs">
              <input type="number" placeholder="Từ (₫)" value={minPrice}
                onChange={e => setMinPrice(e.target.value)} min={0} />
              <span className="sp-price-sep">–</span>
              <input type="number" placeholder="Đến (₫)" value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)} min={0} />
            </div>
          </Section>
        )}

        {/* ── Khu vực ── */}
        <Section title="Khu vực">
          <div className="sp-location-selects">
            <div className="sp-loc-wrap">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <select className="sp-loc-select" value={selectedProvinceCode}
                onChange={e => setSelectedProvinceCode(e.target.value)}>
                <option value="">Tỉnh / Thành phố</option>
                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
              </select>
            </div>
            {selectedProvinceCode && (
              <div className="sp-loc-wrap">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ opacity: 0.45 }} />
                <select className="sp-loc-select" value={selectedWardCode}
                  onChange={e => setSelectedWardCode(e.target.value)}>
                  <option value="">Phường / Xã (tùy chọn)</option>
                  {wardsForProvince.map(w => (
                    <option key={w.code} value={w.code}>{w.name_with_type}</option>
                  ))}
                </select>
              </div>
            )}
            {pendingAddressLabel && pendingAddressLabel !== appliedAddress && (
              <p className="sp-hint">Sẽ lọc: <strong>{pendingAddressLabel}</strong></p>
            )}
          </div>
        </Section>

      </div>

      <div className="sp-sidebar-foot">
        <button className="sp-apply-btn" onClick={handleApply}>
          <FontAwesomeIcon icon={faSearch} /> Áp dụng
        </button>
      </div>
    </>
  );
}

// ─── Section accordion ────────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sp-section">
      <button className="sp-section-btn" onClick={() => setOpen(v => !v)}>
        {title}
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
      </button>
      {open && <div className="sp-section-body">{children}</div>}
    </div>
  );
}

// ─── Main SearchPage ──────────────────────────────────────────────────────────

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";
  const urlCateId = searchParams.get("cateId") || searchParams.get("categoryId") || null;
  const urlBrandId = searchParams.get("brandId") || null;

  // ── Filter state ──────────────────────────────────────────────────────────
  const [selectedCateId, setSelectedCateId] = useState(urlCateId ? +urlCateId : null);
  const [selectedBrandId, setSelectedBrandId] = useState(urlBrandId ? +urlBrandId : null);
  const [brandKeyword, setBrandKeyword] = useState("");
  const [cateKeyword, setCateKeyword] = useState("");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [appliedAddress, setAppliedAddress] = useState(searchParams.get("address") || "");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [brandTree, setBrandTree] = useState([]);   // cây cha-con đã lọc
  const [brandMap, setBrandMap] = useState({});   // id → name (cho pills)
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync URL params khi navigate
  useEffect(() => {
    setSelectedCateId(urlCateId ? +urlCateId : null);
    setSelectedBrandId(urlBrandId ? +urlBrandId : null);
  }, [urlCateId, urlBrandId]);

  // Wards
  const wardsForProvince = useMemo(() =>
    !selectedProvinceCode ? [] :
      Object.entries(wardData)
        .filter(([, w]) => w.parent_code === selectedProvinceCode)
        .map(([code, w]) => ({ code, ...w }))
        .sort((a, b) => a.name.localeCompare(b.name, "vi")),
    [selectedProvinceCode]
  );

  useEffect(() => { setSelectedWardCode(""); }, [selectedProvinceCode]);

  // ── Fetch categories ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/categories/hierarchy`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setCategoryHierarchy(data);
        setFlatCategories(flatten(data));
      })
      .catch(() => { });
  }, []);

  // ── Fetch brands — dùng /api/brands/tree (đã có sẵn) ───────────────────────
  const [allBrandTree, setAllBrandTree] = useState([]); // toàn bộ cây gốc
  const brandDebounce = useRef(null);

  // Load 1 lần khi mount — normalize PascalCase → camelCase từ .NET
  const normalizeBrand = (b) => ({
    brandId: b.brandId ?? b.BrandId,
    brandName: b.brandName ?? b.BrandName,
    brandLogo: b.brandLogo ?? b.BrandLogo,
    subBrands: (b.subBrands ?? b.SubBrands ?? []).map(normalizeBrand),
  });

  useEffect(() => {
    setBrandTree(allBrandTree);
  }, [allBrandTree]);

  useEffect(() => {
    fetch(`${API}/brands/tree`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const normalized = data.map(normalizeBrand);
        setAllBrandTree(normalized);
        setBrandMap(flattenBrands(normalized));
      })
      .catch(() => { });
  }, []);

  // Filter brandTree theo keyword + cateId ở client — debounce 300ms
  useEffect(() => {
    clearTimeout(brandDebounce.current);
    brandDebounce.current = setTimeout(() => {
      const kw = brandKeyword.trim().toLowerCase();

      if (!kw) {
        setBrandTree(allBrandTree);
        return;
      }

      const filtered = allBrandTree
        .map(parent => {
          const filteredSubs = (parent.subBrands ?? []).filter(sub =>
            sub.brandName.toLowerCase().includes(kw)
          );
          const parentMatch = parent.brandName.toLowerCase().includes(kw);

          if (!parentMatch && filteredSubs.length === 0) return null;

          return {
            ...parent,
            subBrands: parentMatch ? (parent.subBrands ?? []) : filteredSubs,
          };
        })
        .filter(Boolean);

      setBrandTree(filtered);
    }, 300);
    return () => clearTimeout(brandDebounce.current);
  }, [brandKeyword, allBrandTree]);

  // Khi brand đang chọn không còn trong danh sách → reset
  useEffect(() => {
    if (!selectedBrandId || !brandTree.length) return;
    const allIds = new Set(Object.keys(brandMap).map(Number));
    if (!allIds.has(selectedBrandId)) setSelectedBrandId(null);
  }, [brandTree]);

  // ── Visible category hierarchy (lọc theo brand + keyword) ─────────────────
  const visibleHierarchy = useMemo(() => {
    const kw = cateKeyword.trim().toLowerCase();

    const matchesKw = (n) =>
      !kw || n.cateName.toLowerCase().includes(kw) ||
      n.subCategories?.some(s => s.cateName.toLowerCase().includes(kw));

    const filterBrand = (nodes) =>
      nodes
        .filter(n =>
          n.brands?.some(b => b.brandId === selectedBrandId) ||
          n.subCategories?.some(s => s.brands?.some(b => b.brandId === selectedBrandId))
        )
        .map(n => ({ ...n, subCategories: filterBrand(n.subCategories ?? []) }));

    const filterKw = (nodes) =>
      nodes
        .filter(matchesKw)
        .map(n => ({
          ...n,
          subCategories: kw
            ? (n.subCategories ?? []).filter(s => s.cateName.toLowerCase().includes(kw))
            : (n.subCategories ?? []),
        }));

    let result = categoryHierarchy;
    if (selectedBrandId) result = filterBrand(result);
    if (kw) result = filterKw(result);
    return result;
  }, [selectedBrandId, cateKeyword, categoryHierarchy]);

  // ── Fetch posts ───────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
  setLoading(true);
  try {
    const p = new URLSearchParams();
    if (urlKeyword) p.set("keyword", urlKeyword);
    if (selectedBrandId) p.set("brandId", selectedBrandId);
    if (selectedCateId) p.set("categoryId", selectedCateId);
    if (minPrice && selectedPriceType !== "NEGOTIABLE") p.set("minPrice", minPrice);
    if (maxPrice && selectedPriceType !== "NEGOTIABLE") p.set("maxPrice", maxPrice);
    const res = await fetch(`${API}/posts/home?${p}`);
    const data = res.ok ? await res.json() : { featuredPosts: [], latestPosts: [] };
    const featured = Array.isArray(data.featuredPosts) ? data.featuredPosts : [];
    const latest   = Array.isArray(data.latestPosts)   ? data.latestPosts   : [];
    setPosts([...featured, ...latest]);
  } catch { setPosts([]); }
  finally { setLoading(false); }
}, [urlKeyword, selectedBrandId, selectedCateId, minPrice, maxPrice]);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Client-side filter + sort ─────────────────────────────────────────────
  useEffect(() => {
    let r = [...(Array.isArray(posts) ? posts : [])];
    if (selectedPriceType) r = r.filter(p => p.priceType === selectedPriceType);
    if (appliedAddress) r = r.filter(p => p.address?.toLowerCase().includes(appliedAddress.toLowerCase()));
    r.sort((a, b) => {
      if (sortBy === "price_asc") return getPrice(a) - getPrice(b);
      if (sortBy === "price_desc") return getPrice(b) - getPrice(a);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredPosts(r);
  }, [posts, selectedPriceType, appliedAddress, sortBy]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const pendingAddressLabel = useMemo(() => {
    if (!selectedProvinceCode) return "";
    const prov = provinceData[selectedProvinceCode];
    if (selectedWardCode) return wardData[selectedWardCode]?.path || prov?.name || "";
    return prov?.name || "";
  }, [selectedProvinceCode, selectedWardCode]);

  const handlePriceTypeChange = (val) => {
    setSelectedPriceType(val);
    if (val === "NEGOTIABLE") { setMinPrice(""); setMaxPrice(""); }
  };

  const handleApply = () => {
    const addr = pendingAddressLabel;
    setAppliedAddress(addr);
    const p = {};
    if (urlKeyword) p.keyword = urlKeyword;
    if (selectedCateId) p.cateId = selectedCateId;
    if (selectedBrandId) p.brandId = selectedBrandId;
    if (minPrice && selectedPriceType !== "NEGOTIABLE") p.minPrice = minPrice;
    if (maxPrice && selectedPriceType !== "NEGOTIABLE") p.maxPrice = maxPrice;
    if (addr) p.address = addr;
    setSearchParams(p, { preventScrollReset: true });
    setDrawerOpen(false);
  };

  const handleReset = () => {
    setSelectedCateId(null);
    setSelectedBrandId(null);
    setBrandKeyword("");
    setCateKeyword("");
    setMinPrice(""); setMaxPrice("");
    setSelectedPriceType("");
    setSortBy("newest");
    setSelectedProvinceCode(""); setSelectedWardCode("");
    setAppliedAddress("");
    setSearchParams(urlKeyword ? { keyword: urlKeyword } : {}, { preventScrollReset: true });
  };

  const activeCount = [
    selectedCateId,
    selectedBrandId,
    (minPrice || maxPrice) && selectedPriceType !== "NEGOTIABLE",
    selectedPriceType,
    appliedAddress,
  ].filter(Boolean).length;

  const sidebarProps = {
    brandTree, brandKeyword, setBrandKeyword,
    selectedBrandId, setSelectedBrandId,
    cateKeyword, setCateKeyword,
    visibleHierarchy, selectedCateId, setSelectedCateId,
    selectedPriceType, handlePriceTypeChange,
    minPrice, setMinPrice, maxPrice, setMaxPrice,
    selectedProvinceCode, setSelectedProvinceCode,
    selectedWardCode, setSelectedWardCode,
    wardsForProvince, pendingAddressLabel, appliedAddress,
    activeCount, handleReset, handleApply,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="sp">
        <div className="sp-layout">

          {/* Desktop sidebar */}
          <aside className="sp-sidebar">
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* Main */}
          <main className="sp-main">
            <div className="sp-toolbar">
              <div className="sp-toolbar-left">
                <button className="sp-mobile-filter-btn" onClick={() => setDrawerOpen(true)}>
                  <FontAwesomeIcon icon={faSlidersH} />
                  Bộ lọc
                  {activeCount > 0 && <span className="sp-filter-badge">{activeCount}</span>}
                </button>
                <span className="sp-result">
                  {loading
                    ? "Đang tải..."
                    : <><strong>{filteredPosts.length}</strong> kết quả{urlKeyword && <> cho "<strong>{urlKeyword}</strong>"</>}</>
                  }
                </span>
              </div>
              <select className="sp-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Active pills */}
            {activeCount > 0 && (
              <div className="sp-pills">
                {selectedBrandId && (
                  <span className="sp-pill">
                    {brandMap[selectedBrandId] ?? `Brand #${selectedBrandId}`}
                    <button onClick={() => setSelectedBrandId(null)}><FontAwesomeIcon icon={faTimes} /></button>
                  </span>
                )}
                {selectedCateId && (
                  <span className="sp-pill">
                    {flatCategories.find(c => c.cateId === selectedCateId)?.cateName}
                    <button onClick={() => setSelectedCateId(null)}><FontAwesomeIcon icon={faTimes} /></button>
                  </span>
                )}
                {selectedPriceType && (
                  <span className="sp-pill">
                    {PRICE_TYPES.find(p => p.value === selectedPriceType)?.label}
                    <button onClick={() => handlePriceTypeChange("")}><FontAwesomeIcon icon={faTimes} /></button>
                  </span>
                )}
                {(minPrice || maxPrice) && selectedPriceType !== "NEGOTIABLE" && (
                  <span className="sp-pill">
                    {minPrice ? (+minPrice).toLocaleString("vi-VN") + "₫" : "0"} – {maxPrice ? (+maxPrice).toLocaleString("vi-VN") + "₫" : "∞"}
                    <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}><FontAwesomeIcon icon={faTimes} /></button>
                  </span>
                )}
                {appliedAddress && (
                  <span className="sp-pill">
                    📍 {appliedAddress}
                    <button onClick={() => { setSelectedProvinceCode(""); setSelectedWardCode(""); setAppliedAddress(""); }}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className="sp-loading">
                <FontAwesomeIcon icon={faSpinner} spin />
                <p>Đang tìm kiếm...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="sp-empty">
                <FontAwesomeIcon icon={faBoxOpen} />
                <h3>Không tìm thấy kết quả</h3>
                <p>Thử thay đổi từ khoá hoặc điều chỉnh bộ lọc</p>
                <button className="sp-empty-reset" onClick={handleReset}>Xoá bộ lọc</button>
              </div>
            ) : (
              <div className="sp-grid">
                {filteredPosts.map(post => <PostCard key={post.postId} post={post} />)}
              </div>
            )}
          </main>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <div className="sp-backdrop" onClick={() => setDrawerOpen(false)} />
            <div className="sp-drawer">
              <div className="sp-drawer-head">
                Bộ lọc
                <button className="sp-drawer-close" onClick={() => setDrawerOpen(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="sp-drawer-body">
                <SidebarContent {...sidebarProps} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}