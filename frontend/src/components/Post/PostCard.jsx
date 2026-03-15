import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUser, faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";

import "./PostCard.css";
import api from "../../api";
import { useAuthStore } from "@/store/auth";
import { Toast } from "../../utils/toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABEL = {
  1: { label: "Chờ duyệt",  cls: "pending"  },
  2: { label: "Đã duyệt",   cls: "approved" },
  3: { label: "Từ chối",    cls: "rejected" },
  4: { label: "Đang bán",   cls: "selling"  },
  5: { label: "Đã bán",     cls: "sold"     },
  6: { label: "Đã ẩn",      cls: "hidden"   },
};

const IMG_BASE  = "https://api.chore123.cloud/uploads/";
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostCard({ post }) {
  const { user } = useAuthStore();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(user ? (post.isSaved ?? false) : false);
  }, [post.postId, user]);

  const handleFavClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Vui lòng đăng nhập để thêm yêu thích");
      return;
    }

    const key = `favorites_${user.userId}`;
    let saved = JSON.parse(localStorage.getItem(key)) || [];

    try {
      if (isFav) {
        const res = await api.delete(`api/save-posts/${post.postId}`);
        Toast.fire({ icon: "success", title: res.data?.message || "Đã xóa khỏi yêu thích!" });
        saved = saved.filter(id => id !== post.postId);
        setIsFav(false);
      } else {
        const res = await api.post("api/save-posts", { PostId: post.postId });
        Toast.fire({ icon: "success", title: res.data?.message || "Đã thêm vào yêu thích!" });
        saved.unshift(post.postId);
        setIsFav(true);
      }
      localStorage.setItem(key, JSON.stringify(saved));
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch {
      Toast.fire({ icon: "error", title: isFav ? "Lỗi khi xóa yêu thích!" : "Lỗi khi thêm yêu thích!" });
    }
  };

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

        <button className={`pc-fav ${isFav ? "pc-fav--active" : ""}`} onClick={handleFavClick} aria-label="Yêu thích">
          <FontAwesomeIcon icon={isFav ? faHeart : faHeartOutline} />
        </button>
      </div>

      {/* Body */}
      <div className="pc-body">
        <h3 className="pc-title">{post.title}</h3>

        <div className="pc-price-row">{renderPrice(post)}</div>

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