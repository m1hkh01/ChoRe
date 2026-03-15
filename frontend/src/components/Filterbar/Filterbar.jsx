import { useState, useEffect, useRef, useCallback } from "react";
import "./FilterBar.css";
import useFetch from "@/Hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown, faChevronRight, faTimes, faLayerGroup, faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_OPTIONS = [
  { value: null, label: "Tất cả" },
  { value: 1,    label: "Hôm nay" },
  { value: 7,    label: "7 ngày" },
  { value: 30,   label: "30 ngày" },
  { value: 90,   label: "3 tháng" },
];

const PRICE_TYPE_OPTIONS = [
  { value: null,         label: "Tất cả" },
  { value: "FIXED",      label: "Cố định" },
  { value: "RANGE",      label: "Khoảng giá" },
  { value: "NEGOTIABLE", label: "Thương lượng" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseInput = (str) => { const n = Number(String(str).replace(/[.,\s]/g, "")); return isNaN(n) ? 0 : n; };
const formatNum  = (val) => val ? Number(val).toLocaleString("vi-VN") : "";
const fmtShort   = (v) =>
  v >= 1_000_000 ? (v / 1_000_000).toFixed(1).replace(".0", "") + " tr"
  : v >= 1_000   ? Math.round(v / 1_000) + "k"
  : v + " ₫";

// ─── Reusable sub-components ──────────────────────────────────────────────────

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="fb-chips">
      {options.map(opt => (
        <button
          key={String(opt.value)}
          className={`fb-chip ${(value ?? null) === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function PriceField({ label, value, placeholder, onChange, onBlur }) {
  return (
    <div className="fb-price-field">
      <span className="fb-price-label">{label}</span>
      <div className="fb-price-input-wrap">
        <input
          type="text" inputMode="numeric" className="fb-price-input"
          placeholder={placeholder}
          value={formatNum(value)}
          onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
          onBlur={onBlur}
        />
        <span className="fb-price-unit">₫</span>
      </div>
    </div>
  );
}

function PriceInputs({ minInput, maxInput, onMinChange, onMaxChange, onBlur }) {
  return (
    <div className="fb-price-inputs">
      <PriceField label="Từ"  value={minInput} placeholder="0"      onChange={onMinChange} onBlur={onBlur} />
      <span className="fb-price-dash">—</span>
      <PriceField label="Đến" value={maxInput} placeholder="Tối đa" onChange={onMaxChange} onBlur={onBlur} />
    </div>
  );
}

function SheetSection({ title, children }) {
  return (
    <div className="fb-sheet-section">
      <p className="fb-sheet-section-title">{title}</p>
      {children}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4"  y1="6"  x2="20" y2="6" />
      <line x1="8"  y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

// ─── Desktop category mega dropdown ──────────────────────────────────────────

function CategoryDropdown({ onClose }) {
  const navigate = useNavigate();
  const { data: categoryData } = useFetch("/api/categories/hierarchy");
  const [categories, setCategories] = useState([]);
  const [activeCate, setActiveCate] = useState(null);

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData);
      setActiveCate(categoryData[0] ?? null);
    }
  }, [categoryData]);

  const go = (path) => { navigate(path); onClose(); };

  return (
    <div className="fb-cate-panel">
      <div className="fb-cate-left">
        {categories.map(cate => (
          <button
            key={cate.cateId}
            className={`fb-cate-item ${activeCate?.cateId === cate.cateId ? "active" : ""}`}
            onMouseEnter={() => setActiveCate(cate)}
            onClick={() => go(`/search?cateId=${cate.cateId}`)}
          >
            <span>{cate.cateName}</span>
            <FontAwesomeIcon icon={faChevronRight} className="fb-cate-arrow" />
          </button>
        ))}
      </div>

      {activeCate && (
        <div className="fb-cate-right">
          {activeCate.subCategories?.length > 0 && (
            <div className="fb-cate-section">
              <div className="fb-cate-section-title">Danh mục con</div>
              <div className="fb-mega-chips">
                {activeCate.subCategories.map(sub => (
                  <button key={sub.cateId} className="fb-mega-chip"
                    onClick={() => go(`/search?cateId=${sub.cateId}`)}>
                    {sub.cateName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeCate.brands?.length > 0 && (
            <div className="fb-cate-section">
              <div className="fb-cate-section-title">Thương hiệu</div>
              <div className="fb-mega-chips">
                {activeCate.brands.map(brand => (
                  <button key={brand.brandId} className="fb-mega-chip"
                    onClick={() => go(`/search?brandId=${brand.brandId}`)}>
                    {brand.brandName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!activeCate.subCategories?.length && !activeCate.brands?.length && (
            <p className="fb-cate-empty">Chưa có danh mục con hoặc thương hiệu</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile category accordion (inside sheet) ─────────────────────────────────

function MobileCateList({ onNavigate }) {
  const { data: categoryData } = useFetch("/api/categories/hierarchy");
  const [categories, setCategories] = useState([]);
  const [expanded,   setExpanded]   = useState(null);

  useEffect(() => { if (categoryData) setCategories(categoryData); }, [categoryData]);

  return (
    <div className="fb-mobile-cate">
      {categories.map(cate => (
        <div key={cate.cateId}>
          <button
            className={`fb-mobile-cate-item ${expanded === cate.cateId ? "open" : ""}`}
            onClick={() => setExpanded(id => id === cate.cateId ? null : cate.cateId)}
          >
            <span>{cate.cateName}</span>
            <FontAwesomeIcon icon={faChevronRight} className="fb-mobile-cate-arrow" />
          </button>

          {expanded === cate.cateId && (
            <div className="fb-mobile-cate-expand">
              {cate.subCategories?.map(sub => (
                <button key={sub.cateId} className="fb-mobile-cate-sub"
                  onClick={() => onNavigate(`/search?cateId=${sub.cateId}`)}>
                  <FontAwesomeIcon icon={faAngleRight} /> {sub.cateName}
                </button>
              ))}
              {cate.brands?.map(brand => (
                <button key={brand.brandId} className="fb-mobile-cate-sub fb-mobile-cate-sub--brand"
                  onClick={() => onNavigate(`/search?brandId=${brand.brandId}`)}>
                  <FontAwesomeIcon icon={faAngleRight} /> {brand.brandName}
                </button>
              ))}
              <button className="fb-mobile-cate-sub fb-mobile-cate-sub--all"
                onClick={() => onNavigate(`/search?cateId=${cate.cateId}`)}>
                Xem tất cả {cate.cateName}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Category Ticker ──────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CategoryTicker() {
  const navigate = useNavigate();
  const { data: categoryData } = useFetch("/api/categories/hierarchy");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!categoryData) return;
    // Flatten: parent + all children, no hierarchy
    const flat = [];
    categoryData.forEach(cate => {
      flat.push({ id: `c-${cate.cateId}`, label: cate.cateName, path: `/search?cateId=${cate.cateId}` });
      cate.subCategories?.forEach(sub => {
        flat.push({ id: `s-${sub.cateId}`, label: sub.cateName, path: `/search?cateId=${sub.cateId}` });
      });
      cate.brands?.forEach(brand => {
        flat.push({ id: `b-${brand.brandId}`, label: brand.brandName, path: `/search?brandId=${brand.brandId}` });
      });
    });
    setItems(shuffle(flat));
  }, [categoryData]);

  if (!items.length) return null;

  // Double the list for seamless loop
  const track = [...items, ...items];

  return (
    <div className="cate-ticker">
      <div className="cate-ticker-inner">
        <div className="cate-ticker-track">
          {track.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              className="cate-ticker-chip"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main FilterBar ───────────────────────────────────────────────────────────

export default function FilterBar({ filters, maxPrice, addresses = [], onFilterChange, activeCount = 0 }) {
  const navigate = useNavigate();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [cateOpen,  setCateOpen]  = useState(false);
  const [minInput,  setMinInput]  = useState("");
  const [maxInput,  setMaxInput]  = useState("");

  const sheetRef = useRef(null);
  const cateRef  = useRef(null);

  // Sync inputs on external reset
  useEffect(() => {
    setMinInput(filters.priceRange[0] > 0 ? String(filters.priceRange[0]) : "");
    setMaxInput(filters.priceRange[1] > 0 && filters.priceRange[1] < maxPrice ? String(filters.priceRange[1]) : "");
  }, [filters.priceRange[0], filters.priceRange[1], maxPrice]);

  // Click outside — close sheet
  useEffect(() => {
    if (!sheetOpen) return;
    const h = (e) => { if (sheetRef.current && !sheetRef.current.contains(e.target)) setSheetOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [sheetOpen]);

  // Click outside — close category dropdown
  useEffect(() => {
    if (!cateOpen) return;
    const h = (e) => { if (cateRef.current && !cateRef.current.contains(e.target)) setCateOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [cateOpen]);

  // Lock body scroll when sheet open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  const commitPrice = useCallback((minStr, maxStr) => {
    const min = parseInput(minStr);
    const max = parseInput(maxStr) || maxPrice;
    const safeMin = Math.max(0, Math.min(min, max - 1));
    const safeMax = Math.max(safeMin + 1, Math.min(max, maxPrice));
    onFilterChange({ priceRange: [safeMin, safeMax] });
  }, [maxPrice, onFilterChange]);

  const clearAll = () => {
    setMinInput(""); setMaxInput("");
    onFilterChange({ priceRange: [0, maxPrice], time: null, address: null, priceType: null });
  };

  const clearPrice = () => {
    setMinInput(""); setMaxInput("");
    onFilterChange({ priceRange: [0, maxPrice] });
  };

  const priceSummary = () => {
    const min = parseInput(minInput);
    const max = parseInput(maxInput);
    if (!min && !max) return null;
    if (min && max) return `${fmtShort(min)} – ${fmtShort(max)}`;
    if (min) return `Từ ${fmtShort(min)}`;
    return `Đến ${fmtShort(max)}`;
  };

  const activePills = [
    filters.priceType && { label: PRICE_TYPE_OPTIONS.find(o => o.value === filters.priceType)?.label, onRemove: () => onFilterChange({ priceType: null }) },
    filters.time      && { label: TIME_OPTIONS.find(o => o.value === filters.time)?.label,             onRemove: () => onFilterChange({ time: null }) },
    filters.address   && { label: filters.address,                                                      onRemove: () => onFilterChange({ address: null }) },
    priceSummary()    && { label: priceSummary(),                                                        onRemove: clearPrice },
  ].filter(Boolean);

  return (
    <>
      {/* ── Category ticker (sticky) ── */}
      <CategoryTicker />

      {/* ── Desktop bar ── */}
      <div className="filter-bar">
        <div className="fb-desktop">

          {/* Category dropdown nằm trên ticker — bỏ khỏi bar */}

          <div className="fb-group">
            <span className="fb-label">Kiểu giá</span>
            <ChipGroup options={PRICE_TYPE_OPTIONS} value={filters.priceType}
              onChange={val => {
                onFilterChange({ priceType: val });
                // reset price khi bỏ chọn
                if (!val) { setMinInput(""); setMaxInput(""); onFilterChange({ priceType: val, priceRange: [0, maxPrice] }); }
              }} />
          </div>

          {/* Inline price inputs — chỉ hiện khi FIXED hoặc RANGE */}
          {(filters.priceType === "FIXED" || filters.priceType === "RANGE") && (
            <>
              <div className="fb-sep" />
              <div className="fb-group">
                <span className="fb-label">
                  {filters.priceType === "FIXED" ? "Giá cố định" : "Khoảng giá"}
                </span>
                <PriceInputs
                  minInput={minInput} maxInput={maxInput}
                  onMinChange={setMinInput} onMaxChange={setMaxInput}
                  onBlur={() => commitPrice(minInput, maxInput)}
                />
              </div>
            </>
          )}

          <div className="fb-sep" />

          <div className="fb-group">
            <span className="fb-label">Thời gian</span>
            <ChipGroup options={TIME_OPTIONS} value={filters.time}
              onChange={val => onFilterChange({ time: val })} />
          </div>

          {activeCount > 0 && (
            <button className="fb-clear" onClick={clearAll}>
              Xóa lọc <span className="fb-badge">{activeCount}</span>
            </button>
          )}

        </div>
      </div>

      {/* ── Mobile trigger row ── */}
      <div className="fb-mobile-trigger">
        <button className="fb-trigger-btn" onClick={() => setSheetOpen(true)}>
          <FilterIcon />
          Lọc
          {activeCount > 0 && <span className="fb-trigger-badge">{activeCount}</span>}
        </button>
        <div className="fb-active-pills">
          {activePills.map((pill, i) => (
            <span key={i} className="fb-pill">
              {pill.label}
              <button onClick={pill.onRemove} aria-label="Xóa">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* ── Overlay ── */}
      {sheetOpen && <div className="fb-overlay" onClick={() => setSheetOpen(false)} />}

      {/* ── Bottom sheet ── */}
      <div className={`fb-sheet ${sheetOpen ? "open" : ""}`} ref={sheetRef}>
        <div className="fb-sheet-handle" />

        <div className="fb-sheet-header">
          <span className="fb-sheet-title">Bộ lọc</span>
          <button className="fb-sheet-close" onClick={() => setSheetOpen(false)} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="fb-sheet-body">

          <SheetSection title="Danh mục">
            <MobileCateList onNavigate={(path) => { setSheetOpen(false); navigate(path); }} />
          </SheetSection>

          <SheetSection title="Kiểu giá">
            <ChipGroup options={PRICE_TYPE_OPTIONS} value={filters.priceType}
              onChange={val => {
                onFilterChange({ priceType: val });
                if (!val) { setMinInput(""); setMaxInput(""); onFilterChange({ priceType: val, priceRange: [0, maxPrice] }); }
              }} />
            {(filters.priceType === "FIXED" || filters.priceType === "RANGE") && (
              <div className="fb-sheet-price-inline">
                <p className="fb-sheet-price-label">
                  {filters.priceType === "FIXED" ? "Nhập giá cố định" : "Nhập khoảng giá"}
                </p>
                <PriceInputs
                  minInput={minInput} maxInput={maxInput}
                  onMinChange={setMinInput} onMaxChange={setMaxInput}
                  onBlur={() => commitPrice(minInput, maxInput)}
                />
              </div>
            )}
          </SheetSection>

          <SheetSection title="Thời gian đăng">
            <ChipGroup options={TIME_OPTIONS} value={filters.time}
              onChange={val => onFilterChange({ time: val })} />
          </SheetSection>

          {addresses.length > 0 && (
            <SheetSection title="Khu vực">
              <select className="fb-select" value={filters.address || ""}
                onChange={e => onFilterChange({ address: e.target.value || null })}>
                <option value="">Tất cả khu vực</option>
                {addresses.map(addr => <option key={addr} value={addr}>{addr}</option>)}
              </select>
            </SheetSection>
          )}

        </div>

        <div className="fb-sheet-footer">
          <button className="fb-sheet-reset" onClick={clearAll}>Xóa tất cả</button>
          <button className="fb-sheet-apply"
            onClick={() => { commitPrice(minInput, maxInput); setSheetOpen(false); }}>
            Áp dụng{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>
    </>
  );
}