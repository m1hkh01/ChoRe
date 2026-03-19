import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark, faUser, faClock, faTag,
  faCheck, faXmark as faReject,
  faChevronLeft, faChevronRight,
  faCommentDollar, faArrowsLeftRight,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .ppm-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.50);
    backdrop-filter: blur(4px);
    z-index: 1700;
    animation: ppmFade 0.18s ease;
  }
  @keyframes ppmFade { from { opacity: 0; } to { opacity: 1; } }

  .ppm-modal {
    position: fixed;
    inset: 0;
    z-index: 1750;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    pointer-events: none;
  }

  .ppm-dialog {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.22);
    width: 100%; max-width: 860px;
    max-height: calc(100dvh - 32px);
    display: flex; flex-direction: column;
    pointer-events: all;
    animation: ppmSlide 0.22s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  @keyframes ppmSlide {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Header ── */
  .ppm-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }
  .ppm-header-left { display: flex; align-items: center; gap: 10px; }
  .ppm-header-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--primary-color);
  }
  .ppm-header-title {
    font-size: 15px; font-weight: 700; color: #111827;
    font-family: 'Inter', sans-serif;
  }
  .ppm-close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: #f3f4f6; border: 1px solid #e5e7eb;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #6b7280; font-size: 13px;
    transition: all 0.15s ease;
  }
  .ppm-close-btn:hover { background: #e5e7eb; color: #111827; }

  /* ── Body ── */
  .ppm-body {
    flex: 1; overflow-y: auto;
    display: grid; grid-template-columns: 1fr 340px;
    gap: 0;
    min-height: 0;
  }
  .ppm-body::-webkit-scrollbar { width: 4px; }
  .ppm-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

  /* ── Left col ── */
  .ppm-left {
    padding: 22px;
    border-right: 1px solid #f0f0f0;
    overflow-y: auto;
    display: flex; flex-direction: column; gap: 20px;
  }
  .ppm-left::-webkit-scrollbar { width: 3px; }
  .ppm-left::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

  /* Title block */
  .ppm-post-title {
    font-size: 18px; font-weight: 700; color: #111827;
    line-height: 1.4; font-family: 'Inter', sans-serif;
  }
  .ppm-meta {
    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;
  }
  .ppm-meta-item {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12.5px; color: #6b7280;
    background: #f9fafb; border: 1px solid #f0f0f0;
    padding: 4px 10px; border-radius: 999px;
  }
  .ppm-meta-item svg { font-size: 11px; }

  /* Price */
  .ppm-price-fixed  { color: var(--primary-color); font-weight: 700; font-size: 13px; }
  .ppm-price-range  { color: var(--preview, #2196f3); font-weight: 700; font-size: 13px; }
  .ppm-price-nego   { color: #f59e0b; font-weight: 700; font-size: 13px; }
  .ppm-price-muted  { color: #9ca3af; font-size: 13px; }

  /* Section */
  .ppm-section-title {
    font-size: 12px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 10px;
  }

  /* Description */
  .ppm-desc {
    font-size: 13.5px; line-height: 1.7; color: #374151;
  }
  .ppm-desc img { max-width: 100%; border-radius: 8px; }
  .ppm-desc p { margin-bottom: 8px; }

  /* Specs table */
  .ppm-spec-table {
    width: 100%; border-collapse: collapse;
    font-size: 13px;
  }
  .ppm-spec-table tr:nth-child(even) td { background: #f9fafb; }
  .ppm-spec-table td {
    padding: 7px 12px;
    border: 1px solid #f0f0f0;
    color: #374151;
  }
  .ppm-spec-table td:first-child {
    font-weight: 600; color: #6b7280;
    width: 42%; background: #f9fafb;
  }

  /* ── Right col ── */
  .ppm-right {
    padding: 22px;
    display: flex; flex-direction: column; gap: 14px;
    background: #fafafa;
    overflow-y: auto;
  }
  .ppm-right::-webkit-scrollbar { width: 3px; }
  .ppm-right::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

  /* Image viewer */
  .ppm-img-main-wrap {
    position: relative; border-radius: 10px; overflow: hidden;
    background: #f0f0f0; aspect-ratio: 4/3;
  }
  .ppm-img-main {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .ppm-img-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.08);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: #374151;
    transition: all 0.15s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .ppm-img-nav:hover { background: #fff; }
  .ppm-img-nav--prev { left: 8px; }
  .ppm-img-nav--next { right: 8px; }
  .ppm-img-counter {
    position: absolute; bottom: 8px; right: 10px;
    background: rgba(0,0,0,0.45); color: #fff;
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 999px;
  }
  .ppm-img-no-image {
    width: 100%; aspect-ratio: 4/3;
    background: #f3f4f6; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; font-size: 13px;
  }

  /* Thumbnails */
  .ppm-thumbnails {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .ppm-thumb {
    width: 52px; height: 52px; border-radius: 7px;
    object-fit: cover; cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.15s ease, opacity 0.15s ease;
    opacity: 0.65;
  }
  .ppm-thumb--active { border-color: var(--primary-color); opacity: 1; }
  .ppm-thumb:hover { opacity: 1; }

  /* ── Footer ── */
  .ppm-footer {
    display: flex; justify-content: flex-end; align-items: center; gap: 10px;
    padding: 14px 22px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    flex-shrink: 0;
  }
  .ppm-footer-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 20px; border-radius: 9px;
    font-size: 13.5px; font-weight: 600; font-family: 'Inter', sans-serif;
    cursor: pointer; border: 1px solid transparent;
    transition: all 0.15s ease;
  }
  .ppm-footer-btn--reject {
    background: #fff5f5; border-color: #fecaca; color: #dc2626;
  }
  .ppm-footer-btn--reject:hover { background: #fee2e2; }
  .ppm-footer-btn--approve {
    background: var(--primary-color); border-color: var(--primary-color); color: #fff;
  }
  .ppm-footer-btn--approve:hover { background: var(--primary-color-hover); border-color: var(--primary-color-hover); }

  /* ── Mobile ── */
  @media (max-width: 700px) {
    .ppm-dialog { border-radius: 14px; max-height: calc(100dvh - 24px); }
    .ppm-body {
      grid-template-columns: 1fr;
      overflow-y: auto;
    }
    .ppm-left { border-right: none; border-bottom: 1px solid #f0f0f0; padding: 16px; }
    .ppm-right { padding: 16px; }
    .ppm-post-title { font-size: 16px; }
    .ppm-footer { flex-direction: row; gap: 8px; }
    .ppm-footer-btn { flex: 1; justify-content: center; padding: 10px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (str) => {
  if (!str) return "—";
  const iso = str.endsWith("Z") ? str : str + "Z";
  return new Date(iso).toLocaleString("vi-VN");
};

// ─── Price ────────────────────────────────────────────────────────────────────

function Price({ post }) {
  if (!post.priceType) {
    return <span className="ppm-meta-item ppm-price-muted">Liên hệ</span>;
  }

  switch (post.priceType) {
    case "NEGOTIABLE":
      return (
        <span className="ppm-meta-item ppm-price-nego">
          <FontAwesomeIcon icon={faCommentDollar} />
          Thương lượng
        </span>
      );
    case "RANGE":
      return (
        <span className="ppm-meta-item ppm-price-range">
          <FontAwesomeIcon icon={faArrowsLeftRight} />
          {post.minPrice?.toLocaleString("vi-VN")} đ — {post.maxPrice?.toLocaleString("vi-VN")} đ
        </span>
      );
    case "FIXED":
    default:
      return (
        <span className="ppm-meta-item ppm-price-fixed">
          <FontAwesomeIcon icon={faTag} />
          {post.price?.toLocaleString("vi-VN")} đ
        </span>
      );
  }
}

// ─── Image Viewer ─────────────────────────────────────────────────────────────

function ImageViewer({ images, baseURL }) {
  const [idx, setIdx] = useState(0);

  if (!images?.length) {
    return <div className="ppm-img-no-image">Không có hình ảnh</div>;
  }

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      <div className="ppm-img-main-wrap">
        <img
          className="ppm-img-main"
          src={`${baseURL}/uploads/${images[idx].postImage1}`}
          alt={`Ảnh ${idx + 1}`}
        />
        {images.length > 1 && (
          <>
            <button className="ppm-img-nav ppm-img-nav--prev" onClick={prev} aria-label="Ảnh trước">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="ppm-img-nav ppm-img-nav--next" onClick={next} aria-label="Ảnh sau">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <div className="ppm-img-counter">{idx + 1} / {images.length}</div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="ppm-thumbnails">
          {images.map((img, i) => (
            <img
              key={img.postImageId ?? i}
              className={`ppm-thumb${i === idx ? " ppm-thumb--active" : ""}`}
              src={`${baseURL}/uploads/${img.postImage1}`}
              alt={`Thumb ${i + 1}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ─── PostPreviewModal ─────────────────────────────────────────────────────────

export default function PostPreviewModal({ post, onClose, onApprove, onReject }) {
  if (!post) return null;

  const baseURL = api.defaults.baseURL;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ppm-overlay" onClick={onClose} aria-hidden="true" />

      <div className="ppm-modal" role="dialog" aria-modal="true" aria-label="Xem trước bài viết"
        onClick={handleOverlayClick}>
        <div className="ppm-dialog">

          {/* Header */}
          <div className="ppm-header">
            <div className="ppm-header-left">
              <div className="ppm-header-dot" />
              <span className="ppm-header-title">Xem trước bài viết</span>
            </div>
            <button className="ppm-close-btn" onClick={onClose} aria-label="Đóng">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Body */}
          <div className="ppm-body">

            {/* Left — info */}
            <div className="ppm-left">

              {/* Title + meta */}
              <div>
                <div className="ppm-post-title">{post.title}</div>
                <div className="ppm-meta">
                  <span className="ppm-meta-item">
                    <FontAwesomeIcon icon={faUser} />
                    {post.user?.userName}
                  </span>
                  <span className="ppm-meta-item">
                    <FontAwesomeIcon icon={faClock} />
                    {formatDate(post.createdAt)}
                  </span>
                  <Price post={post} />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="ppm-section-title">Mô tả</div>
                <div
                  className="ppm-desc ckeditor-preview"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />
              </div>

              {/* Specifications */}
              {post.postSpecificationsDto?.length > 0 && (
                <div>
                  <div className="ppm-section-title">Cấu hình chi tiết</div>
                  <table className="ppm-spec-table">
                    <tbody>
                      {post.postSpecificationsDto.map((spec, i) => (
                        <tr key={i}>
                          <td>{spec.specName}</td>
                          <td>{spec.specValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right — images */}
            <div className="ppm-right">
              <div className="ppm-section-title">Hình ảnh</div>
              <ImageViewer images={post.postImages} baseURL={baseURL} />
            </div>
          </div>

          {/* Footer */}
          <div className="ppm-footer">
            <button
              className="ppm-footer-btn ppm-footer-btn--reject"
              onClick={() => onReject(post.postId)}
            >
              <FontAwesomeIcon icon={faReject} />
              Từ chối
            </button>
            <button
              className="ppm-footer-btn ppm-footer-btn--approve"
              onClick={() => onApprove(post.postId)}
            >
              <FontAwesomeIcon icon={faCheck} />
              Duyệt bài
            </button>
          </div>

        </div>
      </div>
    </>
  );
}