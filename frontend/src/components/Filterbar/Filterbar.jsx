import { useState, useEffect, useRef } from "react";
import "./FilterBar.css";

const TIME_OPTIONS = [
  { value: null, label: "Tất cả" },
  { value: 1,    label: "Hôm nay" },
  { value: 7,    label: "7 ngày" },
  { value: 30,   label: "30 ngày" },
  { value: 90,   label: "3 tháng" },
];

const PRICE_TYPE_OPTIONS = [
  { value: null,         label: "Tất cả" },
  { value: "FIXED",      label: "Giá cố định" },
  { value: "RANGE",      label: "Khoảng giá" },
  { value: "NEGOTIABLE", label: "Thương lượng" },
];

function FilterBar({ filters, maxPrice, addresses = [], onFilterChange, activeCount = 0 }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  // Local price state (string để người dùng gõ thoải mái)
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const sheetRef = useRef(null);

  // Sync khi filter reset từ bên ngoài
  useEffect(() => {
    setMinInput(filters.priceRange[0] > 0 ? String(filters.priceRange[0]) : "");
    setMaxInput(filters.priceRange[1] < maxPrice && filters.priceRange[1] > 0 ? String(filters.priceRange[1]) : "");
  }, [filters.priceRange[0], filters.priceRange[1], maxPrice]);

  useEffect(() => {
    if (!sheetOpen) return;
    const handler = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) setSheetOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sheetOpen]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  // Parse input string → number, bỏ dấu chấm/phẩy
  const parseInput = (str) => {
    const num = Number(str.replace(/[.,\s]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const formatDisplay = (val) => {
    if (!val) return "";
    return Number(val).toLocaleString("vi-VN");
  };

  const commitPrice = (minStr, maxStr) => {
    const min = parseInput(minStr);
    const max = parseInput(maxStr) || maxPrice;
    const safeMin = Math.max(0, Math.min(min, max - 1));
    const safeMax = Math.max(safeMin + 1, Math.min(max, maxPrice));
    onFilterChange({ priceRange: [safeMin, safeMax] });
  };

  const clearAll = () => {
    setMinInput("");
    setMaxInput("");
    onFilterChange({ priceRange: [0, maxPrice], time: null, address: null, priceType: null });
  };

  const formatPriceSummary = () => {
    const min = parseInput(minInput);
    const max = parseInput(maxInput);
    if (!min && !max) return null;
    const fmt = (v) => v >= 1_000_000
      ? (v / 1_000_000).toFixed(1).replace(".0", "") + " tr"
      : v >= 1_000 ? Math.round(v / 1_000) + "k" : v + " ₫";
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  // ── PRICE INPUT FIELDS ─────────────────────────────
  const PriceInputs = () => (
    <div className="fb-price-inputs">
      <div className="fb-price-input-wrap">
        <span className="fb-price-input-label">Từ</span>
        <div className="fb-price-input-field">
          <input
            type="text"
            inputMode="numeric"
            className="fb-price-input"
            placeholder="0"
            value={formatDisplay(minInput)}
            onChange={e => setMinInput(e.target.value.replace(/[^\d]/g, ""))}
            onBlur={() => commitPrice(minInput, maxInput)}
          />
          <span className="fb-price-input-unit">₫</span>
        </div>
      </div>
      <div className="fb-price-input-dash">—</div>
      <div className="fb-price-input-wrap">
        <span className="fb-price-input-label">Đến</span>
        <div className="fb-price-input-field">
          <input
            type="text"
            inputMode="numeric"
            className="fb-price-input"
            placeholder="Tối đa"
            value={formatDisplay(maxInput)}
            onChange={e => setMaxInput(e.target.value.replace(/[^\d]/g, ""))}
            onBlur={() => commitPrice(minInput, maxInput)}
          />
          <span className="fb-price-input-unit">₫</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP BAR ── */}
      <div className="filter-bar">
        <div className="fb-desktop">

          {/* Price inputs */}
          {/* <div className="fb-group">
            <label className="fb-label">Khoảng giá</label>
            <PriceInputs />
          </div> */}

          <div className="fb-sep" />

          {/* Price type */}
          <div className="fb-group">
            <label className="fb-label">Kiểu giá</label>
            <div className="fb-chips">
              {PRICE_TYPE_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  className={`fb-chip ${(filters.priceType ?? null) === opt.value ? "active" : ""}`}
                  onClick={() => onFilterChange({ priceType: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="fb-sep" />

          {/* Time */}
          <div className="fb-group">
            <label className="fb-label">Thời gian</label>
            <div className="fb-chips">
              {TIME_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  className={`fb-chip ${filters.time === opt.value ? "active" : ""}`}
                  onClick={() => onFilterChange({ time: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* {addresses.length > 0 && (
            <>
              <div className="fb-sep" />
              <div className="fb-group">
                <label className="fb-label">Khu vực</label>
                <select
                  className="fb-select"
                  value={filters.address || ""}
                  onChange={e => onFilterChange({ address: e.target.value || null })}
                >
                  <option value="">Tất cả</option>
                  {addresses.map(addr => (
                    <option key={addr} value={addr}>{addr}</option>
                  ))}
                </select>
              </div>
            </>
          )} */}

          {activeCount > 0 && (
            <button className="fb-clear" onClick={clearAll}>
              Xóa lọc <span className="fb-badge">{activeCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE TRIGGER ── */}
      <div className="fb-mobile-trigger">
        <button className="fb-trigger-btn" onClick={() => setSheetOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Lọc
          {activeCount > 0 && <span className="fb-trigger-badge">{activeCount}</span>}
        </button>
        <div className="fb-active-summary">
          {filters.priceType && (
            <span className="fb-summary-pill">
              {PRICE_TYPE_OPTIONS.find(o => o.value === filters.priceType)?.label}
              <button onClick={() => onFilterChange({ priceType: null })}>×</button>
            </span>
          )}
          {filters.time && (
            <span className="fb-summary-pill">
              {TIME_OPTIONS.find(o => o.value === filters.time)?.label}
              <button onClick={() => onFilterChange({ time: null })}>×</button>
            </span>
          )}
          {filters.address && (
            <span className="fb-summary-pill">
              {filters.address}
              <button onClick={() => onFilterChange({ address: null })}>×</button>
            </span>
          )}
          {formatPriceSummary() && (
            <span className="fb-summary-pill">
              {formatPriceSummary()}
              <button onClick={() => { setMinInput(""); setMaxInput(""); onFilterChange({ priceRange: [0, maxPrice] }); }}>×</button>
            </span>
          )}
        </div>
      </div>

      {sheetOpen && <div className="fb-overlay" onClick={() => setSheetOpen(false)} />}

      {/* ── BOTTOM SHEET ── */}
      <div className={`fb-sheet ${sheetOpen ? "open" : ""}`} ref={sheetRef}>
        <div className="fb-sheet-handle" />
        <div className="fb-sheet-header">
          <span className="fb-sheet-title">Bộ lọc</span>
          <button className="fb-sheet-close" onClick={() => setSheetOpen(false)}>✕</button>
        </div>
        <div className="fb-sheet-body">

          {/* Price */}
          <div className="fb-sheet-section">
            <div className="fb-sheet-section-head"><span>Khoảng giá</span></div>
            <PriceInputs />
          </div>

          {/* Price type */}
          <div className="fb-sheet-section">
            <div className="fb-sheet-section-head"><span>Kiểu giá</span></div>
            <div className="fb-chips" style={{ marginTop: 10 }}>
              {PRICE_TYPE_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  className={`fb-chip ${(filters.priceType ?? null) === opt.value ? "active" : ""}`}
                  onClick={() => onFilterChange({ priceType: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="fb-sheet-section">
            <div className="fb-sheet-section-head"><span>Thời gian đăng</span></div>
            <div className="fb-chips" style={{ marginTop: 10 }}>
              {TIME_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  className={`fb-chip ${filters.time === opt.value ? "active" : ""}`}
                  onClick={() => onFilterChange({ time: opt.value })}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          {/* Address */}
          {addresses.length > 0 && (
            <div className="fb-sheet-section">
              <div className="fb-sheet-section-head"><span>Khu vực</span></div>
              <select
                className="fb-select" style={{ width: "100%", marginTop: 8 }}
                value={filters.address || ""}
                onChange={e => onFilterChange({ address: e.target.value || null })}
              >
                <option value="">Tất cả khu vực</option>
                {addresses.map(addr => (
                  <option key={addr} value={addr}>{addr}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="fb-sheet-footer">
          <button className="fb-sheet-reset" onClick={clearAll}>Xóa tất cả</button>
          <button className="fb-sheet-apply" onClick={() => { commitPrice(minInput, maxInput); setSheetOpen(false); }}>
            Áp dụng {activeCount > 0 ? `(${activeCount})` : ""}
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterBar;