import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "@/assets/Home.css";

function Home() {
  const [posts, setPosts] = useState([]);

  // 👉 THÊM STATE CHO DB
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // 👉 THÊM STATE CHO GIÁ TỐI ĐA
  const [maxPriceInDB, setMaxPriceInDB] = useState(0);

  // 👉 FILTER (Thay maxPrice thành priceRange)
  const [filters, setFilters] = useState({
    keyword: "",
    brandId: null,
    categoryId: null,
    priceRange: [0, 0], // Sẽ được update sau khi load max price
    time: null
  });

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
        
        // 👉 TỰ ĐỘNG TÍNH MAX PRICE TỪ POSTS
        if (res.data && res.data.length > 0) {
          const calculatedMax = Math.max(...res.data.map(p => p.price));
          
          // Chỉ update maxPriceInDB nếu giá mới cao hơn
          if (calculatedMax > maxPriceInDB) {
            setMaxPriceInDB(calculatedMax);
            
            // Update filter range nếu đang ở mặc định
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

  // 👉 LOAD DATA BAN ĐẦU (brands, categories)
  useEffect(() => {
    api.get("api/brands").then(res => setBrands(res.data));
    api.get("api/categories").then(res => setCategories(res.data));
    
    // Load posts ban đầu để tính max price
    loadPosts();
  }, []);

  // 👉 AUTO-LOAD KHI FILTER THAY ĐỔI (với debounce) - Bỏ qua lần đầu tiên
  useEffect(() => {
    // Bỏ qua nếu maxPriceInDB chưa được set (tức là lần render đầu tiên)
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

  return (
    <main className="container my-5">

      {/* HERO */}
      <section className="text-center mb-5">
        <h2 className="fw-semibold display-6">
          Chào mừng đến với <span style={{ color: "#22c55e" }}>Chợ Rẻ</span>
        </h2>
        <p className="text-muted mt-2">
          Nền tảng mua bán đồ điện tử cũ nhanh chóng – minh bạch – tiết kiệm
        </p>
      </section>

      {/* 🔍 FILTER BAR - Chợ Tốt Style Compact */}
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

              {/* KEYWORD INPUT */}
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

              {/* FILTER DROPDOWN BUTTON - CHỈ CÒN GIÁ & THỜI GIAN */}
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
                  <span>Lọc</span>
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

                {/* DROPDOWN MENU - CHỈ GIÁ & THỜI GIAN */}
                <div className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: "320px" }}>

                  {/* PRICE RANGE SLIDER */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-2">
                      Khoảng giá
                    </label>
                    
                    {/* Display current range */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark">
                        {formatPrice(filters.priceRange[0])}đ
                      </span>
                      <span className="text-muted small">-</span>
                      <span className="badge bg-light text-dark">
                        {formatPrice(filters.priceRange[1])}đ
                      </span>
                    </div>

                    {/* Min Price Slider */}
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
                        style={{
                          accentColor: "#22c55e"
                        }}
                      />
                    </div>

                    {/* Max Price Slider */}
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
                        style={{
                          accentColor: "#22c55e"
                        }}
                      />
                    </div>
                  </div>

                  {/* TIME */}
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

                  {/* RESET BUTTON */}
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

              {/* SEARCH BUTTON */}
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

            {/* 🏷️ PHÂN LOẠI & HÃNG - GOM CHUNG 1 BOX */}
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
                  <h6 className="fw-semibold mb-2" style={{ fontSize: "13px", color: "#6b7280" }}>Phân loại</h6>
                  <div 
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
                      gap: "8px"
                    }}
                  >
                    {/* TẤT CẢ */}
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

                    {/* CATEGORIES */}
                    {categories.map(c => (
                      <div
                        key={c.cateId}
                        onClick={() => setFilters({ ...filters, categoryId: c.cateId })}
                        style={{
                          height: "40px",
                          border: filters.categoryId == c.cateId ? "2px solid #22c55e" : "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor: filters.categoryId == c.cateId ? "#f0fdf4" : "#fafafa",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                          padding: "0 8px"
                        }}
                        onMouseEnter={e => {
                          if (filters.categoryId == c.cateId) return;
                          e.currentTarget.style.borderColor = "#22c55e";
                        }}
                        onMouseLeave={e => {
                          if (filters.categoryId == c.cateId) return;
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
                  <h6 className="fw-semibold mb-2" style={{ fontSize: "13px", color: "#6b7280" }}>Hãng</h6>
                  <div 
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                      gap: "10px"
                    }}
                  >
                    {/* TẤT CẢ */}
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

                    {/* BRANDS - CHỈ LOGO */}
                    {brands.map(b => (
                      <div
                        key={b.brandId}
                        onClick={() => setFilters({ ...filters, brandId: b.brandId })}
                        style={{
                          height: "70px",
                          border: filters.brandId == b.brandId ? "2px solid #22c55e" : "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor: filters.brandId == b.brandId ? "#f0fdf4" : "#fafafa",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                          padding: "8px"
                        }}
                        onMouseEnter={e => {
                          if (filters.brandId == b.brandId) return;
                          e.currentTarget.style.borderColor = "#22c55e";
                        }}
                        onMouseLeave={e => {
                          if (filters.brandId == b.brandId) return;
                          e.currentTarget.style.borderColor = "#e0e0e0";
                        }}
                      >
                        {/* CHỈ LOGO - KHÔNG TÊN */}
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
        <h4 className="mb-4 fw-semibold">Tin đăng mới nhất</h4>

        {posts.length === 0 ? (
          <div className="text-center text-muted py-5">
            Không tìm thấy sản phẩm nào phù hợp
          </div>
        ) : (
          <div className="row g-4">
            {posts.map(post => (
              <div
                key={post.postId}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div className="post-card h-100">
                  <div className="post-thumb">
                    <img
                      src={
                        post.thumbnail
                          ? `http://localhost:5121/uploads/${post.thumbnail}`
                          : "/no-image.png"
                      }
                      alt={post.title}
                    />
                  </div>

                  <div className="post-body">
                    <h6 className="post-title">{post.title}</h6>
                    <p className="post-desc">{post.shortDescription}</p>

                    <div className="post-meta">
                      <span className="price">
                        {post.price.toLocaleString()} ₫
                      </span>
                      <span className="address">{post.address}</span>
                    </div>

                    <div className="post-user">👤 {post.userName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}

export default Home;