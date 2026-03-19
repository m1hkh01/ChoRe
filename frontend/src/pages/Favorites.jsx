import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart, faMapMarkerAlt, faTrash,
  faBoxOpen, faCommentDots,
  faCheckSquare, faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";

import api from "@/api";
import { useAuthStore } from "@/store/auth";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .fv {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px 80px;
  }

  /* ─── Top row ─────────────────────────────────── */
  .fv-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 12px;
  }

  .fv-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
  }

  .fv-heading svg { color: #ef4444; }

  .fv-tag {
    font-size: 15px;
    font-weight: 600;
    color: #94a3b8;
    background: #f1f5f9;
    border-radius: 999px;
    padding: 2px 10px;
  }

  .fv-top-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ─── Buttons ─────────────────────────────────── */
  .fv-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    background: none;
  }

  .fv-btn-red             { color: #dc2626; border-color: #fca5a5; background: #fff5f5; }
  .fv-btn-red:hover       { background: #fee2e2; }
  .fv-btn-red:disabled    { opacity: 0.4; cursor: not-allowed; }

  .fv-btn-ghost           { color: #64748b; border-color: #e2e8f0; background: #fff; }
  .fv-btn-ghost:hover     { background: #f8fafc; }

  /* ─── Toolbar ─────────────────────────────────── */
  .fv-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    margin-bottom: 12px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .fv-check-all {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px 0;
    user-select: none;
  }
  .fv-check-all:hover { color: #0f172a; }
  .fv-check-all svg   { font-size: 20px; }

  .fv-sel-info {
    font-size: 15px;
    color: #22c55e;
    font-weight: 600;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 999px;
    padding: 2px 10px;
  }

  /* ─── List ────────────────────────────────────── */
  .fv-list { display: flex; flex-direction: column; gap: 8px; }

  /* ─── Row wrapper ─────────────────────────────── */
  .fv-row {
    display: flex;
    align-items: stretch;
    gap: 10px;
  }

  .fv-row-check {
    display: flex;
    align-items: center;
    padding-top: 2px;
  }

  .fv-chk {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-size: 20px;
    color: #cbd5e1;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .fv-chk:hover, .fv-chk.on { color: #22c55e; }

  /* ─── Card ────────────────────────────────────── */
  .fv-card {
    flex: 1;
    display: grid;
    grid-template-columns: 90px 1fr auto;
    align-items: center;
    gap: 16px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
    min-width: 0;
  }
  .fv-card:hover { border-color: #cbd5e1; }
  .fv-card.on    { border-color: #86efac; background: #f0fdf4; }

  /* ─── Thumbnail ───────────────────────────────── */
  .fv-thumb {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    background: #f1f5f9;
    flex-shrink: 0;
  }
  .fv-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* ─── Info ────────────────────────────────────── */
  .fv-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .fv-title-text {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fv-price         { font-size: 15px; font-weight: 700; color: #dc2626; }
  .fv-price-range   { font-size: 15px; font-weight: 700; color: #dc2626; }
  .fv-price-deal    { font-size: 15px; font-weight: 600; color: #f59e0b; }
  .fv-price-contact { font-size: 15px; font-weight: 500; color: #94a3b8; }

  .fv-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .fv-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    color: #94a3b8;
  }
  .fv-meta svg { font-size: 13px; }

  /* ─── Side actions ────────────────────────────── */
  .fv-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .fv-ico {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    color: #64748b;
    text-decoration: none;
    transition: all 0.15s;
  }
  .fv-ico:hover     { border-color: #22c55e; color: #16a34a; background: #f0fdf4; }
  .fv-ico.del:hover { border-color: #ef4444; color: #dc2626; background: #fff5f5; }
  .fv-ico:disabled  { opacity: 0.4; cursor: not-allowed; }

  /* ─── Empty ───────────────────────────────────── */
  .fv-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 80px 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    text-align: center;
  }
  .fv-empty svg  { font-size: 44px; color: #e2e8f0; }
  .fv-empty h3   { margin: 0; font-size: 16px; font-weight: 600; color: #475569; }
  .fv-empty p    { margin: 0; font-size: 15px; color: #94a3b8; }
  .fv-empty-cta {
    margin-top: 6px;
    padding: 10px 26px;
    background: #22c55e;
    color: #fff;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.15s;
  }
  .fv-empty-cta:hover { background: #16a34a; }

  /* ─── Login gate ──────────────────────────────── */
  .fv-gate {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 20px;
    gap: 14px;
    text-align: center;
  }
  .fv-gate svg { font-size: 44px; color: #ef4444; opacity: 0.35; }
  .fv-gate p   { margin: 0; font-size: 20px; color: #475569; }
  .fv-gate-btn {
    padding: 10px 28px;
    background: #22c55e;
    color: #fff;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.15s;
  }
  .fv-gate-btn:hover { background: #16a34a; }

  /* ─── Responsive ──────────────────────────────── */
  @media (max-width: 600px) {
    .fv            { padding: 24px 12px 60px; }
    .fv-heading    { font-size: 18px; }
    .fv-card       { grid-template-columns: 76px 1fr auto; gap: 12px; padding: 12px; }
    .fv-thumb      { width: 76px; height: 76px; }
    .fv-title-text { font-size: 15px; }
    .fv-actions    { flex-direction: row; }
    .fv-ico        { width: 30px; height: 30px; font-size: 15px; border-radius: 6px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const IMG_BASE  = "https://api.chore123.cloud/uploads/";
const IMG_LOCAL = "http://localhost:5121/uploads/";

function Price({ post }) {
  if (post.priceType === "FIXED")
    return <span className="fv-price">{post.price ? post.price.toLocaleString("vi-VN") + " ₫" : "Liên hệ"}</span>;
  if (post.priceType === "RANGE")
    return <span className="fv-price-range">{post.minPrice?.toLocaleString("vi-VN")} – {post.maxPrice?.toLocaleString("vi-VN")} ₫</span>;
  if (post.priceType === "NEGOTIABLE")
    return <span className="fv-price-deal">Thương lượng</span>;
  return <span className="fv-price-contact">Liên hệ</span>;
}

// ─── FavCard ──────────────────────────────────────────────────────────────────

function FavCard({ post, checked, onToggle, onRemove }) {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);

  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(e); };

  const handleRemove = stop(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await api.delete(`api/save-posts/${post.postId}`);
      onRemove(post.postId);
      // PostCard trên các trang khác sẽ tự reload khi nhận event này
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch {
      /* Lỗi API — giữ nguyên item, không xóa UI */
    } finally {
      setLoading(false);
    }
  });

  const handleChat = stop(() =>
    navigate(`/chat?postId=${post.postId}&sellerId=${post.userId}`)
  );

  return (
    <div className="fv-row">
      <div className="fv-row-check">
        <button
          className={`fv-chk ${checked ? "on" : ""}`}
          onClick={() => onToggle(post.postId)}
        >
          <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} />
        </button>
      </div>

      <Link to={`/posts/${post.postId}`} className={`fv-card ${checked ? "on" : ""}`}>
        <div className="fv-thumb">
          <img
            src={`${IMG_BASE}${post.thumbnail}`}
            alt={post.title}
            loading="lazy"
            onError={(e) => {
              if (!e.target.dataset.fb) {
                e.target.dataset.fb = "1";
                e.target.src = `${IMG_LOCAL}${post.thumbnail}`;
              }
            }}
          />
        </div>

        <div className="fv-info">
          <div className="fv-title-text">{post.title}</div>
          <Price post={post} />
          <div className="fv-meta">
            {post.address && (
              <span><FontAwesomeIcon icon={faMapMarkerAlt} />{post.address}</span>
            )}
          </div>
        </div>

        <div className="fv-actions">
          <button className="fv-ico" onClick={handleChat} title="Nhắn tin người bán">
            <FontAwesomeIcon icon={faCommentDots} />
          </button>
          <button className="fv-ico del" onClick={handleRemove} disabled={loading} title="Xóa">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </Link>
    </div>
  );
}

// ─── Favorites (main) ─────────────────────────────────────────────────────────

export default function Favorites() {
  const { user }                    = useAuthStore();
  const [items,    setItems]        = useState([]);
  const [selected, setSelected]     = useState(new Set());
  const [deleting, setDeleting]     = useState(false);

  // ── Load từ API ──────────────────────────────────────────────────────────────
  const load = async () => {
    try {
      const res = await api.get("api/save-posts");
      setItems(res.data);
    } catch (e) {
      console.error("Lỗi tải danh sách yêu thích:", e.response ?? e);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
    // Reload khi PostCard ở trang khác thêm/gỡ yêu thích
    window.addEventListener("favoritesUpdated", load);
    return () => window.removeEventListener("favoritesUpdated", load);
  }, [user]);

  // ── Xóa một item (callback từ FavCard — API đã gọi xong) ─────────────────────
  const handleRemove = (postId) => {
    setItems((prev) => prev.filter((p) => p.postId !== postId));
    setSelected((prev) => { const s = new Set(prev); s.delete(postId); return s; });
  };

  // ── Chọn / bỏ chọn ───────────────────────────────────────────────────────────
  const toggle    = (id) => setSelected((prev) => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const allChecked  = items.length > 0 && selected.size === items.length;
  const toggleAll   = () => setSelected(allChecked ? new Set() : new Set(items.map((p) => p.postId)));

  // ── Xóa nhiều mục đã chọn ────────────────────────────────────────────────────
  const deleteSelected = async () => {
    if (deleting) return;
    setDeleting(true);
    await Promise.allSettled([...selected].map((id) => api.delete(`api/save-posts/${id}`)));
    setItems((prev) => prev.filter((p) => !selected.has(p.postId)));
    setSelected(new Set());
    setDeleting(false);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // ── Xóa tất cả ───────────────────────────────────────────────────────────────
  const deleteAll = async () => {
    if (!window.confirm(`Xóa tất cả ${items.length} tin đã lưu?`)) return;
    if (deleting) return;
    setDeleting(true);
    await Promise.allSettled(items.map((p) => api.delete(`api/save-posts/${p.postId}`)));
    setItems([]);
    setSelected(new Set());
    setDeleting(false);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // ── Guard: chưa đăng nhập ─────────────────────────────────────────────────────
  if (!user) return (
    <>
      <style>{CSS}</style>
      <div className="fv-gate">
        <FontAwesomeIcon icon={faHeartOutline} />
        <p>Vui lòng đăng nhập để xem tin đã lưu</p>
        <Link to="/login" className="fv-gate-btn">Đăng nhập</Link>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="fv">

        {/* Top */}
        <div className="fv-top">
          <h1 className="fv-heading">
            Tin đã lưu
            <span className="fv-tag">{items.length}/100</span>
          </h1>

          {items.length > 0 && (
            <div className="fv-top-actions">
              <button className="fv-btn fv-btn-red" onClick={deleteAll} disabled={deleting}>
                <FontAwesomeIcon icon={faTrash} />
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* Toolbar chọn nhiều */}
        {items.length > 0 && (
          <div className="fv-toolbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="fv-check-all" onClick={toggleAll}>
                <FontAwesomeIcon
                  icon={allChecked ? faCheckSquare : faSquare}
                  style={{ color: allChecked ? "#22c55e" : "#cbd5e1" }}
                />
                {allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
              {selected.size > 0 && (
                <span className="fv-sel-info">Đã chọn {selected.size}</span>
              )}
            </div>

            {selected.size > 0 && (
              <button className="fv-btn fv-btn-red" onClick={deleteSelected} disabled={deleting}>
                <FontAwesomeIcon icon={faTrash} />
                Xóa {selected.size} mục
              </button>
            )}
          </div>
        )}

        {/* Danh sách / Empty */}
        {items.length === 0 ? (
          <div className="fv-empty">
            <FontAwesomeIcon icon={faBoxOpen} />
            <h3>Chưa có tin yêu thích nào</h3>
            <p>Lưu tin để xem lại nhanh hơn</p>
            <Link to="/" className="fv-empty-cta">Khám phá ngay</Link>
          </div>
        ) : (
          <div className="fv-list">
            {items.map((post) => (
              <FavCard
                key={post.postId}
                post={post}
                checked={selected.has(post.postId)}
                onToggle={toggle}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
}