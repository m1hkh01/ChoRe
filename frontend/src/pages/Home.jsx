import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import "@/assets/Home.css";
import PostGrid from "@/components/Post/PostGrid";
import FilterBar from "@/components/Filterbar/FilterBar";
import { useAuthStore } from "@/store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import provinceData from "@/data/sauSapNhap/province.json";
import wardData from "@/data/sauSapNhap/ward.json";

// ✅ Derive provinces array từ provinceData object
const provinces = Object.entries(provinceData).map(([code, data]) => ({
  code,
  name: data.name,
})).sort((a, b) => a.name.localeCompare(b.name, "vi"));

function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const locationRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [postCates, setPostCates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maxPriceInDB, setMaxPriceInDB] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    brandId: null,
    categoryId: null,
    priceRange: [0, 0],
    time: null,
    address: null,
    priceType: null,
  });

  // Wards của tỉnh đang chọn
  const wardsForProvince = useMemo(() => {
    if (!selectedProvinceCode) return [];
    return Object.entries(wardData)
      .filter(([, w]) => w.parent_code === selectedProvinceCode)
      .map(([code, w]) => ({ code, ...w }));
  }, [selectedProvinceCode]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Áp dụng vị trí → sync vào filters.address
  const applyLocation = () => {
    let location = "";
    if (selectedWardCode) {
      location = wardData[selectedWardCode]?.path || wardData[selectedWardCode]?.name_with_type || "";
    } else if (selectedProvinceCode) {
      location = provinceData[selectedProvinceCode]?.name || "";
    }
    setSelectedLocation(location);
    setFilters(prev => ({ ...prev, address: location || null }));
    setLocationOpen(false);
  };

  // ✅ Xóa vị trí
  const clearLocation = (e) => {
    e.stopPropagation();
    setSelectedLocation("");
    setSelectedProvinceCode("");
    setSelectedWardCode("");
    setFilters(prev => ({ ...prev, address: null }));
  };

  const handleFilterChange = (patch) => {
    setFilters(prev => ({ ...prev, ...patch }));
  };

  const getFilteredPostsForRelation = () => {
    let filtered = allPosts;
    const categoryId = filters.categoryId ? Number(filters.categoryId) : null;
    const brandId = filters.brandId ? Number(filters.brandId) : null;
    if (categoryId) {
      const postIdsInCategory = postCates
        .filter(pc => (pc.cateId || pc.CateId) === categoryId)
        .map(pc => pc.postId || pc.PostId);
      filtered = filtered.filter(p => postIdsInCategory.includes(p.postId || p.PostId));
    }
    if (brandId) {
      filtered = filtered.filter(p => (p.brandId || p.BrandId) === brandId);
    }
    return filtered;
  };

  const getAvailableBrands = () => {
    if (!postCates.length || !allPosts.length) return brands.map(b => ({ ...b, isDisabled: false }));
    const filteredPosts = getFilteredPostsForRelation();
    const validBrandIds = [...new Set(filteredPosts.map(p => p.brandId || p.BrandId))];
    return brands.map(brand => ({
      ...brand,
      isDisabled: filters.categoryId !== null && !validBrandIds.includes(brand.brandId || brand.BrandId)
    }));
  };

  const getAvailableCategories = () => {
    if (!postCates.length || !allPosts.length) return categories.map(c => ({ ...c, isDisabled: false }));
    const filteredPosts = getFilteredPostsForRelation();
    const validPostIds = filteredPosts.map(p => p.postId || p.PostId);
    const validCategoryIds = [...new Set(
      postCates.filter(pc => validPostIds.includes(pc.postId || pc.PostId)).map(pc => pc.cateId || pc.CateId)
    )];
    return categories.map(category => ({
      ...category,
      isDisabled: filters.brandId !== null && !validCategoryIds.includes(category.cateId || category.CateId)
    }));
  };

  const loadPosts = () => {
    api.get("/api/posts/home", {
      params: {
        keyword: filters.keyword || null,
        userId: user ? user.userId : null,
        brandId: filters.brandId ? Number(filters.brandId) : null,
        categoryId: filters.categoryId ? Number(filters.categoryId) : null,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        time: filters.time ? Number(filters.time) : null,
      }
    })
      .then(res => {
        setPosts(res.data);
        if (res.data?.length > 0) {
          const pricesArray = res.data.map(p => {
            if (p.priceType === "FIXED" && p.price) return p.price;
            if (p.priceType === "RANGE" && p.maxPrice) return p.maxPrice;
            return 0;
          }).filter(price => price > 0);
          if (pricesArray.length > 0) {
            const calculatedMax = Math.max(...pricesArray);
            if (calculatedMax > maxPriceInDB) {
              setMaxPriceInDB(calculatedMax);
              if (filters.priceRange[1] === maxPriceInDB || filters.priceRange[1] === 0) {
                setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], calculatedMax] }));
              }
            }
          }
        }
      })
      .catch(err => console.error("Lỗi load posts:", err));
  };

  useEffect(() => {
    api.get("api/brands").then(res => setBrands(res.data));
    api.get("api/categories").then(res => setCategories(res.data));
    api.get("api/postcates").then(res => setPostCates(res.data));
    api.get("/api/posts/all", { params: { statusIds: [2], userId: user ? user.userId : null } })
      .then(res => {
        setAllPosts(res.data);
        setPosts(res.data);
        if (res.data?.length > 0) {
          const pricesArray = res.data.map(p => {
            if (p.priceType === "FIXED" && p.price) return p.price;
            if (p.priceType === "RANGE" && p.maxPrice) return p.maxPrice;
            return 0;
          }).filter(price => price > 0);
          if (pricesArray.length > 0) {
            const calculatedMax = Math.max(...pricesArray);
            setMaxPriceInDB(calculatedMax);
            setFilters(prev => ({ ...prev, priceRange: [0, calculatedMax] }));
          }
        }
      })
      .catch(err => console.error("Lỗi load posts:", err));
  }, []);

  useEffect(() => {
    if (maxPriceInDB === 0) return;
    const timer = setTimeout(() => { loadPosts(); }, 500);
    return () => clearTimeout(timer);
  }, [filters, maxPriceInDB, postCates, allPosts]);

  const getFilteredPosts = () => {
    return posts.filter(post => {
      if (filters.priceType && post.priceType !== filters.priceType) return false;
      let priceMatch = true;
      if (post.priceType === "NEGOTIABLE") {
        priceMatch = true;
      } else if (post.priceType === "FIXED") {
        const price = post.price || 0;
        priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      } else if (post.priceType === "RANGE") {
        const minPrice = post.minPrice || 0;
        const maxPrice = post.maxPrice || 0;
        priceMatch = maxPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
      }
      const addressMatch = !filters.address ||
        (post.address || post.Address || "").toLowerCase().includes(filters.address.toLowerCase());
      return priceMatch && addressMatch;
    });
  };

  const filteredPosts = getFilteredPosts();
  const _AvailableBrands = getAvailableBrands();
  const _AvailableCategories = getAvailableCategories();

  const uniqueAddresses = useMemo(() => {
    const set = new Set(
      allPosts.map(p => (p.address || p.Address || "").trim()).filter(Boolean)
    );
    return [...set].sort();
  }, [allPosts]);

  const activeFilterCount = [
    filters.time !== null,
    filters.address !== null,
    filters.priceType !== null,
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPriceInDB,
  ].filter(Boolean).length;

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchInput.trim();
    if (q) navigate(`/search?keyword=${encodeURIComponent(q)}`);
    else navigate("/search");
  };

  const handleCategoryClick = (cateId) => {
    setFilters(prev => ({ ...prev, categoryId: prev.categoryId === cateId ? null : cateId }));
  };

  return (
    <div className="home-wrapper">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-banner">
          <h1
            style={{
              fontSize: "clamp(30px,4vw,48px)",
              fontStyle: "Arial, sans-serif",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "30px",
              WebkitBackgroundClip: "text",
              color: "White"
            }}
          >
            Giá tốt, gần bạn, chốt nhanh!
          </h1>

          <form className="hero-search-bar" onSubmit={handleSearch}>

            {/* Input search */}
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="hero-input"
            />

            {/* ✅ Khu vực — đã fix */}
            <div className="hero-location" ref={locationRef}>
              <button
                type="button"
                className={`hero-location-btn ${selectedLocation ? "has-value" : ""}`}
                onClick={() => setLocationOpen(prev => !prev)}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="hero-loc-icon" />
                <span className="hero-loc-text">{selectedLocation || "Khu vực"}</span>
                {selectedLocation ? (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="hero-loc-clear"
                    onClick={clearLocation}
                  />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} className={`hero-loc-chevron ${locationOpen ? "open" : ""}`} />
                )}
              </button>

              {locationOpen && (
                <div className="hero-location-dropdown">
                  <select
                    className="hero-location-select"
                    value={selectedProvinceCode}
                    onChange={e => { setSelectedProvinceCode(e.target.value); setSelectedWardCode(""); }}
                  >
                    <option value="">Tỉnh / Thành phố</option>
                    {provinces.map(p => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>

                  {selectedProvinceCode && (
                    <select
                      className="hero-location-select"
                      value={selectedWardCode}
                      onChange={e => setSelectedWardCode(e.target.value)}
                    >
                      <option value="">Phường / Xã (tuỳ chọn)</option>
                      {wardsForProvince.map(w => (
                        <option key={w.code} value={w.code}>
                          {w.name_with_type || w.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    className="hero-location-apply"
                    onClick={applyLocation}
                  >
                    Áp dụng
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="hero-btn">Tìm</button>
          </form>
        </div>
      </section>

      {/* ── CATEGORY CHIPS ── */}
      {_AvailableCategories.length > 0 && (
        <section className="home-cats">
          <div className="home-cats-inner">
            <button
              className={`cat-chip ${filters.categoryId === null ? "active" : ""}`}
              onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))}
            >Tất cả</button>
            {_AvailableCategories.filter(c => !c.isDisabled).map(cat => (
              <button
                key={cat.cateId || cat.CateId}
                className={`cat-chip ${filters.categoryId === (cat.cateId || cat.CateId) ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.cateId || cat.CateId)}
              >
                {cat.cateName || cat.CateName}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── POSTS ── */}
      <main className="home-main">
        <div className="cards-panel">
          <div className="section-header">
            <h2 className="section-title">Tin đăng mới nhất</h2>
            <span className="section-count">{filteredPosts.length} sản phẩm</span>
          </div>

          {maxPriceInDB > 0 && (
            <FilterBar
              filters={filters}
              maxPrice={maxPriceInDB}
              addresses={uniqueAddresses}
              onFilterChange={handleFilterChange}
              activeCount={activeFilterCount}
            />
          )}

          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p>Không tìm thấy sản phẩm nào phù hợp</p>
            </div>
          ) : (
            <PostGrid posts={filteredPosts} />
          )}
        </div>
      </main>

    </div>
  );
}

export default Home;