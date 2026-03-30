import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUser, faEye, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";

import "./PostCard.css";
import api from "../../api";
import { useAuthStore } from "@/store/auth";
import { Toast } from "../../utils/toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABEL = {
  1: { label: "Chờ duyệt", cls: "pending" },
  2: { label: "Đã duyệt", cls: "approved" },
  3: { label: "Từ chối", cls: "rejected" },
  4: { label: "Đang bán", cls: "selling" },
  5: { label: "Đã bán", cls: "sold" },
  6: { label: "Đã ẩn", cls: "hidden" },
};

const IMG_BASE = "https://api.chore123.cloud/uploads/";
const IMG_LOCAL = "http://localhost:5121/uploads/";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderPrice(post) {
  switch (post.priceType) {
    case "FIXED":
      return (
        <span className="pc-price pc-price--fixed">
          {post.price ? post.price.toLocaleString("vi-VN") + " ₫" : "Liên hệ"}
        </span>
      );
    case "RANGE":
      return (
        <span className="pc-price pc-price--range">
          {post.minPrice?.toLocaleString("vi-VN")} – {post.maxPrice?.toLocaleString("vi-VN")} ₫
        </span>
      );
    case "NEGOTIABLE":
      return <span className="pc-price pc-price--negotiable">Thương lượng</span>;
    default:
      return <span className="pc-price pc-price--contact">Liên hệ</span>;
  }
}

// ─── Delete endpoint theo role ────────────────────────────────────────────────
// Admin  → DELETE /api/admin/posts/{id}
// Censor → DELETE /api/censor/posts/{id}
// User   → DELETE /api/posts/{id}  (chỉ bài của mình)

function deleteUrl(role, postId) {
  if (role === "Admin") return `api/admin/posts/${postId}`;
  if (role === "Censor") return `api/censor/posts/${postId}`;
  return `api/posts/${postId}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostCard({ post, onDeleted }) {
  const { user } = useAuthStore();
  const [isFav, setIsFav] = useState(post.isSaved ?? false);
  const [favLoad, setFavLoad] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const role = user?.role;
  const isAdmin = role === "Admin";
  const isCensor = role === "Censor";
  const isOwner = !!user && Number(user.userId) === Number(post.userId);

  // Hiện nút xóa khi: Admin / Censor (bất kỳ bài) hoặc User (bài của mình)
  const canDelete = isAdmin || isCensor || isOwner;

  useEffect(() => {
    setIsFav(post.isSaved ?? false);
  }, [post.postId, post.isSaved]);

  // ── Favourite ───────────────────────────────────────────────────────────────

  const handleFavClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Vui lòng đăng nhập để thêm yêu thích");
      return;
    }
    if (favLoad) return;

    const prev = isFav;
    setIsFav(!prev);
    setFavLoad(true);

    try {
      if (prev) {
        const res = await api.delete(`api/save-posts/${post.postId}`);
        Toast.fire({ icon: "success", title: res.data?.message || "Đã xóa khỏi yêu thích!" });
      } else {
        const res = await api.post("api/save-posts", { PostId: post.postId });
        Toast.fire({ icon: "success", title: res.data?.message || "Đã thêm vào yêu thích!" });
      }
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch {
      setIsFav(prev);
      Toast.fire({ icon: "error", title: prev ? "Lỗi khi xóa yêu thích!" : "Lỗi khi thêm yêu thích!" });
    } finally {
      setFavLoad(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  // const handleDelete = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   console.log("role:", role, "| url:", deleteUrl(role, post.postId));

  //   if (!window.confirm(`Xóa bài "${post.title}"? Hành động này không thể hoàn tác.`)) return;

  //   setDeleting(true);
  //   try {
  //     const res = await api.delete(deleteUrl(role, post.postId));
  //     Toast.fire({ icon: "success", title: res.data?.message || "Đã xóa bài đăng!" });
  //     setDeleted(true);
  //     onDeleted?.(post.postId);
  //   } catch (err) {
  //     Toast.fire({ icon: "error", title: err.response?.data?.message || err.response?.data?.Error || "Lỗi khi xóa bài!" });
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  if (deleted) return null;

  const status = STATUS_LABEL[post.postStatusId];

  return (
    <Link to={`/posts/${post.postId}`} className="pc">

      {/* Image */}
      <div className="pc-img-wrap">
        <img
          src={`${IMG_BASE}${post.thumbnail}`}
          alt={post.title}
          className="pc-img"
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.fallback) {
              e.target.dataset.fallback = "true";
              e.target.src = `${IMG_LOCAL}${post.thumbnail}`;
            }
          }}
        />

        {status && (
          <span className={`pc-status pc-status--${status.cls}`}>{status.label}</span>
        )}

        {/* Nút yêu thích — luôn hiện */}
        <button
          className={`pc-fav ${isFav ? "pc-fav--active" : ""} ${favLoad ? "pc-fav--loading" : ""}`}
          onClick={handleFavClick}
          disabled={favLoad}
          aria-label={isFav ? "Bỏ yêu thích" : "Thêm yêu thích"}
        >
          <FontAwesomeIcon icon={isFav ? faHeart : faHeartOutline} />
        </button>

        {/* Nút xóa — Admin/Censor: bất kỳ bài | User: bài của mình */}
        {/* {canDelete && (
          <button
            className={`pc-delete ${deleting ? "pc-delete--loading" : ""}`}
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Xóa bài đăng"
            title={
              isAdmin ? "Xóa bài (Admin)" :
                isCensor ? "Xóa bài (Censor)" :
                  "Xóa bài của tôi"
            }
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )} */}
      </div>

      {/* Body */}
      <div className="pc-body">
        <h3 className="pc-title">{post.title}</h3>

        <div className="pc-price-row">{renderPrice(post)}</div>
        {/* <div className="pc-status-text">
          {post.status}
        </div> */}
        {post.shortDescription && (
          <p className="pc-desc" dangerouslySetInnerHTML={{ __html: post.shortDescription }} />
        )}

        <div className="pc-footer">
          {post.address && (
            <div className="pc-meta">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{post.address}</span>
            </div>
          )}
          <div className="pc-meta-row">
            {post.userName && (
              <div className="pc-meta">
                <FontAwesomeIcon icon={faUser} />
                <span>{post.userName}</span>
              </div>
            )}
            <div className="pc-meta">
              <FontAwesomeIcon icon={faEye} />
              <span>{post.viewCount ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

    </Link>
  );
}