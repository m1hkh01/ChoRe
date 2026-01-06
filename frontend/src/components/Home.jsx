import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./Home.css";

function Home() {
  const [posts, setPosts] = useState([]);

  // 👉 THÊM STATE CHO DB
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // 👉 FILTER (GIỮ NGUYÊN – chỉ sửa đúng tên field)
  const [filters, setFilters] = useState({
    keyword: "",
    brandId: null,
    categoryId: null,
    maxPrice: null,
    time: null
  });

  // 👉 LOAD POSTS (KHÔNG ĐỤNG LOGIC CŨ)
  const loadPosts = () => {
    api.get("/posts/home", {
      params: {
        keyword: filters.keyword || null,
        brandId: filters.brandId ? Number(filters.brandId) : null,
        categoryId: filters.categoryId ? Number(filters.categoryId) : null,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
        time: filters.time ? Number(filters.time) : null
      }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error("Lỗi load posts:", err));
  };

  // 👉 LOAD DATA BAN ĐẦU (brands, categories)
  useEffect(() => {
    api.get("/brands").then(res => setBrands(res.data));
    api.get("/categories").then(res => setCategories(res.data));
  }, []); // Chỉ chạy 1 lần khi component mount

  // 👉 AUTO-LOAD KHI FILTER THAY ĐỔI (với debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 500); // Đợi 0.5s sau khi user ngừng thay đổi filter

    return () => clearTimeout(timer); // Clear timer cũ khi filter thay đổi
  }, [filters]); // Chạy mỗi khi filters thay đổi

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

            <div className="d-flex gap-2 align-items-center p-2"
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

              {/* FILTER DROPDOWN BUTTON */}
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
                  {(filters.brandId || filters.categoryId || filters.maxPrice || filters.time) && (
                    <span className="badge bg-success rounded-pill" style={{ fontSize: "10px" }}>
                      {[filters.brandId, filters.categoryId, filters.maxPrice, filters.time].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* DROPDOWN MENU */}
                <div className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: "300px" }}>

                  {/* CATEGORY */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-1">📂 Phân loại</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.categoryId ?? ""}
                      onChange={e =>
                        setFilters({ ...filters, categoryId: e.target.value || null })
                      }
                    >
                      <option value="">Tất cả phân loại</option>
                      {categories.map(c => (
                        <option key={c.cateId} value={c.cateId}>
                          {c.cateName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BRAND */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-1">🏷️ Hãng</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.brandId ?? ""}
                      onChange={e =>
                        setFilters({ ...filters, brandId: e.target.value || null })
                      }
                    >
                      <option value="">Tất cả hãng</option>
                      {brands.map(b => (
                        <option key={b.brandId} value={b.brandId}>
                          {b.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRICE */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-1">💰 Giá</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.maxPrice ?? ""}
                      onChange={e =>
                        setFilters({ ...filters, maxPrice: e.target.value || null })
                      }
                    >
                      <option value="">Tất cả mức giá</option>
                      <option value="5000000">≤ 5 triệu</option>
                      <option value="10000000">≤ 10 triệu</option>
                      <option value="20000000">≤ 20 triệu</option>
                    </select>
                  </div>

                  {/* TIME */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-1">⏰ Thời gian đăng</label>
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
                  {(filters.brandId || filters.categoryId || filters.maxPrice || filters.time) && (
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => setFilters({
                        ...filters,
                        brandId: null,
                        categoryId: null,
                        maxPrice: null,
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

          </div>
        </div>
      </section>

      {/* POSTS */}
      <section>
        <h4 className="mb-4 fw-semibold">🔥 Tin đăng mới nhất</h4>

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
                          ? `https://localhost:7252/uploads/${post.thumbnail}`
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