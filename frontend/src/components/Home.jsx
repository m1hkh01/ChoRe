import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "@/assets/Home.css";
import PostGrid from "@/components/Post/PostGrid";

function Home() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // 👉 LƯU TẤT CẢ POSTS ĐỂ PHÂN TÍCH
  const [postCates, setPostCates] = useState([]); // 👉 THÊM STATE CHO POSTCATES
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maxPriceInDB, setMaxPriceInDB] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    brandId: null,
    categoryId: null,
    priceRange: [0, 0],
    time: null
  });

  // 👉 LẤY POSTS PHÙ HỢP VỚI FILTER HIỆN TẠI (CORE LOGIC)
  const getFilteredPostsForRelation = () => {
    let filtered = allPosts;

    const categoryId = filters.categoryId ? Number(filters.categoryId) : null;
    const brandId = filters.brandId ? Number(filters.brandId) : null;

    if (categoryId) {
      const postIdsInCategory = postCates
        .filter(pc => (pc.cateId || pc.CateId) === categoryId)
        .map(pc => pc.postId || pc.PostId);

      filtered = filtered.filter(p =>
        postIdsInCategory.includes(p.postId || p.PostId)
      );
    }

    if (brandId) {
      filtered = filtered.filter(
        p => (p.brandId || p.BrandId) === brandId
      );
    }

    return filtered;
  };

  // 👉 HÀM TÍNH CÁC BRAND KHẢ DỤNG - DỰA TRÊN CATEGORY ĐÃ CHỌN
  const getAvailableBrands = () => {
    // ⛔ CHƯA LOAD XONG DATA → KHÔNG DISABLE GÌ HẾT
    if (!postCates.length || !allPosts.length) {
      return brands.map(b => ({ ...b, isDisabled: false }));
    }

    const filteredPosts = getFilteredPostsForRelation();

    const validBrandIds = [...new Set(
      filteredPosts.map(p => p.brandId || p.BrandId)
    )];

    return brands.map(brand => {
      const brandId = brand.brandId || brand.BrandId;
      return {
        ...brand,
        isDisabled:
          filters.categoryId !== null &&
          !validBrandIds.includes(brandId)
      };
    });
  };


  // 👉 HÀM TÍNH CÁC CATEGORY KHẢ DỤNG - DỰA TRÊN BRAND ĐÃ CHỌN
 const getAvailableCategories = () => {
  if (!postCates.length || !allPosts.length) {
    return categories.map(c => ({ ...c, isDisabled: false }));
  }

  const filteredPosts = getFilteredPostsForRelation();
  const validPostIds = filteredPosts.map(p => p.postId || p.PostId);

  const validCategoryIds = [...new Set(
    postCates
      .filter(pc =>
        validPostIds.includes(pc.postId || pc.PostId)
      )
      .map(pc => pc.cateId || pc.CateId)
  )];

  return categories.map(category => {
    const cateId = category.cateId || category.CateId;
    return {
      ...category,
      isDisabled:
        filters.brandId !== null &&
        !validCategoryIds.includes(cateId)
    };
  });
};

  // 👉 LOAD POSTS
  const loadPosts = () => {
    api.get("/api/posts/home", {
      params: {
        keyword: filters.keyword || null,
        brandId: filters.brandId ? Number(filters.brandId) : null,
        categoryId: filters.categoryId ? Number(filters.categoryId) : null,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        time: filters.time ? Number(filters.time) : null
      }
    })
      .then(res => {
        setPosts(res.data);

        // TỰ ĐỘNG TÍNH MAX PRICE TỪ POSTS
        if (res.data && res.data.length > 0) {
          const calculatedMax = Math.max(...res.data.map(p => p.price));

          if (calculatedMax > maxPriceInDB) {
            setMaxPriceInDB(calculatedMax);

            if (filters.priceRange[1] === maxPriceInDB || filters.priceRange[1] === 0) {
              setFilters(prev => ({
                ...prev,
                priceRange: [prev.priceRange[0], calculatedMax]
              }));
            }
          }
        }
      })
      .catch(err => console.error("Lỗi load posts:", err));
  };

  // 👉 LOAD DATA BAN ĐẦU
  useEffect(() => {
    api.get("api/brands").then(res => setBrands(res.data));
    api.get("api/categories").then(res => setCategories(res.data));
    api.get("api/postcates").then(res => setPostCates(res.data));

    // 👉 LOAD TẤT CẢ POSTS (KHÔNG FILTER) ĐỂ PHÂN TÍCH RELATIONSHIP
    api.get("/api/posts/all", { params: {} })
      .then(res => {
        setAllPosts(res.data);
        setPosts(res.data);

        if (res.data && res.data.length > 0) {
          const calculatedMax = Math.max(...res.data.map(p => p.price));
          setMaxPriceInDB(calculatedMax);
          setFilters(prev => ({
            ...prev,
            priceRange: [0, calculatedMax]
          }));
        }
      })
      .catch(err => console.error("Lỗi load all posts:", err));
  }, []);

  // 👉 AUTO-LOAD KHI FILTER THAY ĐỔI
  useEffect(() => {
    if (maxPriceInDB === 0) return;

    const timer = setTimeout(() => {
      loadPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  // 👉 FORMAT TIỀN VN
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} triệu`;
    }
    return `${(price / 1000).toFixed(0)}k`;
  };

  // 👉 LẤY DANH SÁCH ĐÃ LỌC
  const availableBrands = getAvailableBrands();
  const availableCategories = getAvailableCategories();

  return (
    <main className="container my-5">

      {/* HERO */}
      <section className="text-center mb-5">
        <h2 className="fw-semibold display-6">
          Chào mừng đến với <span style={{ color: "#22c55e" }}>Chợ Rẻ</span>
        </h2>
        <p className="text-muted mt-2" style={{ fontWeight: "600" }}>
          Nền tảng mua bán đồ điện tử cũ nhanh chóng – minh bạch – tiết kiệm
        </p>
      </section>

      {/* 🔍 FILTER BAR */}
      <section className="mb-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">

            {/* THANH TÌM KIẾM */}
            <div className="d-flex gap-2 align-items-center p-2 mb-3"
              style={{
                border: "2px solid #e0e0e0",
                borderRadius: "50px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >

              <input
                className="form-control border-0"
                placeholder="Tìm sản phẩm..."
                value={filters.keyword}
                onChange={e =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
                style={{
                  fontSize: "14px",
                  boxShadow: "none"
                }}
              />

              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle border-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: "13px",
                    padding: "6px 12px",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Lọc</span>
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPriceInDB ||
                    filters.time) && (
                      <span className="badge bg-success rounded-pill" style={{ fontSize: "10px" }}>
                        {[
                          filters.priceRange[0] > 0 || filters.priceRange[1] < maxPriceInDB,
                          filters.time
                        ].filter(Boolean).length}
                      </span>
                    )}
                </button>

                <div className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: "320px" }}>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-2">
                      Khoảng giá
                    </label>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark">
                        {formatPrice(filters.priceRange[0])}đ
                      </span>
                      <span className="text-muted small">-</span>
                      <span className="badge bg-light text-dark">
                        {formatPrice(filters.priceRange[1])}đ
                      </span>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-muted" style={{ fontSize: "11px" }}>
                        Từ: {filters.priceRange[0].toLocaleString()}đ
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max={maxPriceInDB}
                        step="100000"
                        value={filters.priceRange[0]}
                        onChange={e => {
                          const newMin = Number(e.target.value);
                          if (newMin < filters.priceRange[1]) {
                            setFilters({
                              ...filters,
                              priceRange: [newMin, filters.priceRange[1]]
                            });
                          }
                        }}
                        style={{ accentColor: "#22c55e" }}
                      />
                    </div>

                    <div>
                      <label className="form-label small text-muted" style={{ fontSize: "11px" }}>
                        Đến: {filters.priceRange[1].toLocaleString()}đ
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max={maxPriceInDB}
                        step="100000"
                        value={filters.priceRange[1]}
                        onChange={e => {
                          const newMax = Number(e.target.value);
                          if (newMax > filters.priceRange[0]) {
                            setFilters({
                              ...filters,
                              priceRange: [filters.priceRange[0], newMax]
                            });
                          }
                        }}
                        style={{ accentColor: "#22c55e" }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-1">Thời gian đăng</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.time ?? ""}
                      onChange={e =>
                        setFilters({ ...filters, time: e.target.value || null })
                      }
                    >
                      <option value="">Tất cả thời gian</option>
                      <option value="1">24 giờ qua</option>
                      <option value="7">7 ngày qua</option>
                      <option value="30">30 ngày qua</option>
                    </select>
                  </div>

                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPriceInDB ||
                    filters.time) && (
                      <button
                        className="btn btn-sm btn-outline-danger w-100"
                        onClick={() => setFilters({
                          ...filters,
                          priceRange: [0, maxPriceInDB],
                          time: null
                        })}
                      >
                        ✖ Xóa bộ lọc
                      </button>
                    )}

                </div>
              </div>

              <button
                className="btn btn-success btn-sm"
                style={{
                  fontSize: "13px",
                  padding: "6px 16px",
                  borderRadius: "50px",
                  whiteSpace: "nowrap"
                }}
                onClick={loadPosts}
              >
                Tìm kiếm
              </button>

            </div>

            {/* 🏷️ PHÂN LOẠI & HÃNG */}
            <div className="mb-3">
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px"
                }}
              >
                {/* PHÂN LOẠI */}
                <div className="mb-3">
                  <h6 className="fw-semibold mb-2" style={{ fontWeight: 600, fontSize: "13px", color: "#484141ff" }}>Phân loại</h6>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
                      gap: "8px"
                    }}
                  >
                    {/* TẤT CẢ CATEGORY */}
                    <div
                      onClick={() => setFilters({ ...filters, categoryId: null })}
                      style={{
                        height: "40px",
                        border: !filters.categoryId ? "2px solid #22c55e" : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        backgroundColor: !filters.categoryId ? "#f0fdf4" : "#fafafa",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        if (!filters.categoryId) return;
                        e.currentTarget.style.borderColor = "#22c55e";
                      }}
                      onMouseLeave={e => {
                        if (!filters.categoryId) return;
                        e.currentTarget.style.borderColor = "#e0e0e0";
                      }}
                    >
                      <span style={{
                        fontSize: "13px",
                        fontWeight: !filters.categoryId ? "600" : "500",
                        color: !filters.categoryId ? "#22c55e" : "#6b7280",
                        textAlign: "center"
                      }}>
                        Tất cả
                      </span>
                    </div>

                    {/* CATEGORIES - CHỈ DISABLE NẾU BRAND ĐÃ CHỌN VÀ KHÔNG CÓ SẢN PHẨM */}
                    {availableCategories.map(c => (
                      <div
                        key={c.cateId}
                        onClick={() => {
                          if (!c.isDisabled) {
                            setFilters({ ...filters, categoryId: c.cateId });
                          }
                        }}
                        style={{
                          height: "40px",
                          border: filters.categoryId == c.cateId ? "2px solid #22c55e" : "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor: filters.categoryId == c.cateId ? "#f0fdf4" : "#fafafa",
                          cursor: c.isDisabled ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                          padding: "0 8px",
                          opacity: c.isDisabled ? 0.4 : 1,
                          filter: c.isDisabled ? "grayscale(100%)" : "none"
                        }}
                        onMouseEnter={e => {
                          if (filters.categoryId == c.cateId || c.isDisabled) return;
                          e.currentTarget.style.borderColor = "#22c55e";
                        }}
                        onMouseLeave={e => {
                          if (filters.categoryId == c.cateId || c.isDisabled) return;
                          e.currentTarget.style.borderColor = "#e0e0e0";
                        }}
                      >
                        <span style={{
                          fontSize: "13px",
                          fontWeight: filters.categoryId == c.cateId ? "600" : "500",
                          color: filters.categoryId == c.cateId ? "#22c55e" : "#6b7280",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {c.cateName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HÃNG */}
                <div>
                  <h6 className="fw-semibold mb-2" style={{ fontWeight: 600, fontSize: "13px", color: "#484141ff" }}>Hãng</h6>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                      gap: "10px"
                    }}
                  >
                    {/* TẤT CẢ BRAND */}
                    <div
                      onClick={() => setFilters({ ...filters, brandId: null })}
                      style={{
                        height: "70px",
                        border: !filters.brandId ? "2px solid #22c55e" : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        backgroundColor: !filters.brandId ? "#f0fdf4" : "#fafafa",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        if (!filters.brandId) return;
                        e.currentTarget.style.borderColor = "#22c55e";
                      }}
                      onMouseLeave={e => {
                        if (!filters.brandId) return;
                        e.currentTarget.style.borderColor = "#e0e0e0";
                      }}
                    >
                      <span style={{
                        fontSize: "11px",
                        fontWeight: !filters.brandId ? "600" : "400",
                        color: !filters.brandId ? "#22c55e" : "#6b7280"
                      }}>
                        Tất cả
                      </span>
                    </div>

                    {/* BRANDS - CHỈ DISABLE NẾU CATEGORY ĐÃ CHỌN VÀ KHÔNG CÓ SẢN PHẨM */}
                    {availableBrands.map(b => (
                      <div
                        key={b.brandId}
                        onClick={() => {
                          if (!b.isDisabled) {
                            setFilters({ ...filters, brandId: b.brandId });
                          }
                        }}
                        style={{
                          height: "70px",
                          border: filters.brandId == b.brandId ? "2px solid #22c55e" : "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor: filters.brandId == b.brandId ? "#f0fdf4" : "#fafafa",
                          cursor: b.isDisabled ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                          padding: "8px",
                          opacity: b.isDisabled ? 0.4 : 1,
                          filter: b.isDisabled ? "grayscale(100%)" : "none"
                        }}
                        onMouseEnter={e => {
                          if (filters.brandId == b.brandId || b.isDisabled) return;
                          e.currentTarget.style.borderColor = "#22c55e";
                        }}
                        onMouseLeave={e => {
                          if (filters.brandId == b.brandId || b.isDisabled) return;
                          e.currentTarget.style.borderColor = "#e0e0e0";
                        }}
                      >
                        {b.brandLogo && (
                          <img
                            src={`http://localhost:5121/brands/${b.brandLogo}`}
                            alt={b.brandName}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain"
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POSTS */}
      <section>
        {posts.length === 0 ? (
          <div className="text-center text-muted py-5">
            Không tìm thấy sản phẩm nào phù hợp
          </div>
        ) : (
          <div className="row g-4">
            <section>
              <h4 className="mb-4 fw-semibold">Tin đăng mới nhất</h4>
              <PostGrid posts={posts} />
            </section>
          </div>
        )}
      </section>

    </main>
  );
}

export default Home;