import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt, faChevronDown, faTimes,
  faLayerGroup, faChevronRight, faSearch,
} from "@fortawesome/free-solid-svg-icons";

import api from "@/api";
import "@/assets/Home.css";
import PostGrid from "@/components/Post/PostGrid";
import FilterBar from "@/components/Filterbar/FilterBar";
import { useAuthStore } from "@/store/auth";
import useFetch from "@/Hooks/useFetch";
import provinceData from "@/data/sauSapNhap/province.json";
import wardData from "@/data/sauSapNhap/ward.json";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FILTERS = {
  keyword:    "",
  brandId:    null,
  categoryId: null,
  priceRange: [0, 0],
  time:       null,
  address:    null,
  priceType:  null,
};

const provinces = Object.entries(provinceData)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name, "vi"));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMaxPrice(posts) {
  const prices = posts.map(p => p.price || p.maxPrice || 0).filter(Boolean);
  return Math.max(...prices, 0);
}

function resolveLocationLabel(provinceCode, wardCode) {
  if (wardCode) return wardData[wardCode]?.path ?? wardData[wardCode]?.name_with_type ?? "";
  return provinceData[provinceCode]?.name ?? "";
}

// ─── Hero Category Dropdown ───────────────────────────────────────────────────

function HeroCategoryDropdown({ onClose }) {
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
    <div className="hero-cate-panel">
      <div className="hero-cate-left">
        <div className="hero-cate-header">Danh mục</div>
        {categories.map(cate => (
          <button
            key={cate.cateId}
            className={`hero-cate-item ${activeCate?.cateId === cate.cateId ? "active" : ""}`}
            onMouseEnter={() => setActiveCate(cate)}
            onClick={() => go(`/search?cateId=${cate.cateId}`)}
          >
            <span>{cate.cateName}</span>
            <FontAwesomeIcon icon={faChevronRight} className="hero-cate-arrow" />
          </button>
        ))}
      </div>

      {activeCate && (
        <div className="hero-cate-right">
          {activeCate.subCategories?.length > 0 && (
            <div className="hero-cate-section">
              <div className="hero-cate-section-title">Danh mục con</div>
              <div className="hero-cate-chips">
                {activeCate.subCategories.map(sub => (
                  <button key={sub.cateId} className="hero-cate-chip"
                    onClick={() => go(`/search?cateId=${sub.cateId}`)}>
                    {sub.cateName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeCate.brands?.length > 0 && (
            <div className="hero-cate-section">
              <div className="hero-cate-section-title">Thương hiệu</div>
              <div className="hero-cate-chips">
                {activeCate.brands.map(brand => (
                  <button key={brand.brandId} className="hero-cate-chip"
                    onClick={() => go(`/search?brandId=${brand.brandId}`)}>
                    {brand.brandName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!activeCate.subCategories?.length && !activeCate.brands?.length && (
            <p className="hero-cate-empty">Chưa có danh mục con hoặc thương hiệu</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const { user }    = useAuthStore();
  const navigate    = useNavigate();
  const locationRef = useRef(null);
  const cateRef     = useRef(null);

  // Posts
  const [posts,    setPosts]    = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  // Search
  const [searchInput, setSearchInput] = useState("");

  // Location picker
  const [locationOpen,         setLocationOpen]         = useState(false);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedWardCode,     setSelectedWardCode]     = useState("");
  const [selectedLocation,     setSelectedLocation]     = useState("");

  // Category dropdown
  const [cateOpen, setCateOpen] = useState(false);

  // Filters & price ceiling
  const [maxPriceInDB, setMaxPriceInDB] = useState(0);
  const [filters,      setFilters]      = useState(INITIAL_FILTERS);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const wardsForProvince = useMemo(() =>
    selectedProvinceCode
      ? Object.entries(wardData)
          .filter(([, w]) => w.parent_code === selectedProvinceCode)
          .map(([code, w]) => ({ code, ...w }))
      : [],
    [selectedProvinceCode]
  );

  const filteredPosts = useMemo(() =>
    posts.filter(post => {
      if (filters.priceType && post.priceType !== filters.priceType) return false;
      if (filters.address) {
        const addr = (post.address ?? "").toLowerCase();
        if (!addr.includes(filters.address.toLowerCase())) return false;
      }
      return true;
    }),
    [posts, filters]
  );

  const uniqueAddresses = useMemo(() => {
    const set = new Set(allPosts.map(p => (p.address ?? "").trim()).filter(Boolean));
    return [...set].sort();
  }, [allPosts]);

  // ── Effects ───────────────────────────────────────────────────────────────────

  // Click outside — location
  useEffect(() => {
    const h = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Click outside — category
  useEffect(() => {
    if (!cateOpen) return;
    const h = (e) => {
      if (cateRef.current && !cateRef.current.contains(e.target)) setCateOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [cateOpen]);

  // Initial load
  useEffect(() => {
    api.get("/api/posts/all", { params: { statusIds: [2], userId: user?.userId } })
      .then(res => {
        const data = res.data;
        const max  = getMaxPrice(data);
        setAllPosts(data);
        setPosts(data);
        setMaxPriceInDB(max);
        setFilters(prev => ({ ...prev, priceRange: [0, max] }));
      });
  }, []);

  // Debounced filter fetch
  useEffect(() => {
    if (!maxPriceInDB) return;
    const timer = setTimeout(() => {
      api.get("/api/posts/home", {
        params: {
          keyword:    filters.keyword || null,
          brandId:    filters.brandId,
          categoryId: filters.categoryId,
          minPrice:   filters.priceRange[0],
          maxPrice:   filters.priceRange[1],
          time:       filters.time,
          userId:     user?.userId,
        },
      }).then(res => setPosts(res.data));
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, maxPriceInDB]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchInput.trim();
    navigate(q ? `/search?keyword=${encodeURIComponent(q)}` : "/search");
  };

  const applyLocation = () => {
    const location = resolveLocationLabel(selectedProvinceCode, selectedWardCode);
    setSelectedLocation(location);
    setFilters(prev => ({ ...prev, address: location || null }));
    setLocationOpen(false);
  };

  const clearLocation = (e) => {
    e.stopPropagation();
    setSelectedLocation("");
    setSelectedProvinceCode("");
    setSelectedWardCode("");
    setFilters(prev => ({ ...prev, address: null }));
  };

  const patchFilters = (patch) => setFilters(prev => ({ ...prev, ...patch }));

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="home-wrapper">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <h1 className="hero-title">Mua bán đồ điện tử cũ dễ dàng!</h1>
          <p className="hero-sub">Hàng nghìn sản phẩm, giá tốt, giao nhanh toàn quốc</p>

          <form className="hero-search-bar" onSubmit={handleSearch}>

            {/* Category button */}
            <div className="hero-cate-wrap" ref={cateRef}>
              <button
                type="button"
                className={`hero-cate-btn ${cateOpen ? "open" : ""}`}
                onClick={() => setCateOpen(v => !v)}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
                {/* <span>Danh mục</span> */}
                <FontAwesomeIcon icon={faChevronDown} className="hero-cate-chevron" />
              </button>
              {cateOpen && <HeroCategoryDropdown onClose={() => setCateOpen(false)} />}
            </div>

            <div className="hero-search-divider" />

            {/* Keyword input */}
            <input
              type="text"
              className="hero-input"
              placeholder="Tìm sản phẩm, danh mục, thương hiệu..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />

            {/* Location picker */}
            <div className="hero-location" ref={locationRef}>
              <button
                type="button"
                className={`hero-location-btn ${locationOpen ? "open" : ""}`}
                onClick={() => setLocationOpen(v => !v)}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="hero-location-icon" />
                <span className="hero-location-text">{selectedLocation || "Khu vực"}</span>
                <FontAwesomeIcon
                  icon={selectedLocation ? faTimes : faChevronDown}
                  className="hero-location-chevron"
                  onClick={selectedLocation ? clearLocation : undefined}
                />
              </button>

              {locationOpen && (
                <div className="hero-location-dropdown">
                  <p className="hero-location-dropdown-title">Chọn khu vực</p>
                  <select value={selectedProvinceCode}
                    onChange={e => { setSelectedProvinceCode(e.target.value); setSelectedWardCode(""); }}>
                    <option value="">Tỉnh / Thành phố</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>

                  {selectedProvinceCode && (
                    <select value={selectedWardCode}
                      onChange={e => setSelectedWardCode(e.target.value)}>
                      <option value="">Phường / Xã</option>
                      {wardsForProvince.map(w => (
                        <option key={w.code} value={w.code}>{w.name_with_type ?? w.name}</option>
                      ))}
                    </select>
                  )}

                  <div className="hero-location-actions">
                    {selectedLocation && (
                      <button type="button" className="hero-location-clear" onClick={clearLocation}>
                        Xóa
                      </button>
                    )}
                    <button type="button" className="hero-location-apply" onClick={applyLocation}>
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="hero-btn">
              <FontAwesomeIcon icon={faSearch} />
              <span>Tìm kiếm</span>
            </button>

          </form>
        </div>
      </section>

      {/* ── Posts ── */}
      <main className="home-main">
        <div className="cards-panel">

          <div className="section-header">
            <h2 className="section-title">Tin đăng mới nhất</h2>
            <span className="section-count">{filteredPosts.length} sản phẩm</span>
          </div>

          <FilterBar
            filters={filters}
            maxPrice={maxPriceInDB}
            addresses={uniqueAddresses}
            onFilterChange={patchFilters}
          />

          {filteredPosts.length === 0
            ? <div className="empty-state">Không có sản phẩm</div>
            : <PostGrid posts={filteredPosts} />
          }

        </div>
      </main>

    </div>
  );
}