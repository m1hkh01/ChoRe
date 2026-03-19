import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen, faTrash, faEyeSlash, faEye,
  faTag, faFileAlt, faCheckCircle, faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";
import { Toast } from "@/utils/toast"
import { icon } from "@fortawesome/fontawesome-svg-core";

// ─── CSS ─────────────────────────────────────────────────────────────────────
// (không thay đổi — giữ nguyên design cũ)

const CSS = `
  .pm { display: flex; flex-direction: column; gap: 16px; }
  .pm-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
  .pm-tab {
    padding: 5px 14px; border-radius: 999px; border: 1px solid #e2e8f0;
    background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b;
    cursor: pointer; white-space: nowrap; transition: all 0.15s;
  }
  .pm-tab:hover { border-color: #22c55e; color: #16a34a; background: rgba(34,197,94,0.05); }
  .pm-tab.on    { background: #22c55e; border-color: #22c55e; color: #fff; }
  .pm-count { font-size: 13px; color: #64748b; margin: 0; }
  .pm-card {
    display: grid; grid-template-columns: 96px 1fr auto;
    align-items: center; gap: 14px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 14px; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .pm-card:hover { border-color: #cbd5e1; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
  .pm-thumb { width: 96px; height: 96px; border-radius: 8px; object-fit: cover; background: #f1f5f9; flex-shrink: 0; }
  .pm-info { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .pm-title { font-size: 14px; font-weight: 600; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pm-date { font-size: 11px; color: #94a3b8; }
  .pm-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 2px 9px; width: fit-content; }
  .pm-badge-pending  { background: #fef9c3; color: #854d0e; }
  .pm-badge-approved { background: #dcfce7; color: #166534; }
  .pm-badge-rejected { background: #fee2e2; color: #991b1b; }
  .pm-badge-sold     { background: #f1f5f9; color: #475569; }
  .pm-badge-hidden   { background: #f3f4f6; color: #6b7280; }
  .pm-price         { font-size: 15px; font-weight: 700; color: #dc2626; }
  .pm-price-deal    { font-size: 14px; font-weight: 600; color: #f59e0b; }
  .pm-price-contact { font-size: 12px; font-weight: 500; color: #94a3b8; }
  .pm-actions { display: flex; flex-direction: column; gap: 6px; align-items: stretch; min-width: 90px; }
  .pm-btn {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 6px 10px; border-radius: 7px; border: 1px solid #e2e8f0;
    background: #fff; font-size: 12px; font-weight: 600; color: #475569;
    cursor: pointer; white-space: nowrap; transition: all 0.15s;
  }
  .pm-btn:hover      { border-color: #22c55e; color: #16a34a; background: #f0fdf4; }
  .pm-btn-del:hover  { border-color: #ef4444; color: #dc2626; background: #fff5f5; }
  .pm-btn-sold:hover { border-color: #64748b; color: #1e293b; background: #f8fafc; }
  .pm-empty {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 64px 20px; background: #fff; border: 1px solid #e2e8f0;
    border-radius: 12px; text-align: center;
  }
  .pm-empty svg { font-size: 40px; color: #e2e8f0; }
  .pm-empty p   { margin: 0; font-size: 14px; font-weight: 500; color: #475569; }
  .pm-cta {
    padding: 9px 22px; background: #22c55e; color: #fff; border-radius: 9px;
    font-size: 13px; font-weight: 700; text-decoration: none; transition: background 0.15s;
  }
  .pm-cta:hover { background: #16a34a; }
  .pm-skeleton {
    height: 124px; border-radius: 12px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%; animation: pmSk 1.4s infinite;
  }
  @keyframes pmSk { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @media (max-width: 640px) {
    .pm-card { grid-template-columns: 76px 1fr; grid-template-rows: auto auto; }
    .pm-thumb { width: 76px; height: 76px; }
    .pm-actions { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; min-width: 0; }
    .pm-btn { flex: 1; min-width: 70px; font-size: 11px; padding: 5px 8px; }
    .pm-title { font-size: 13px; }
    .pm-price { font-size: 14px; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const S = {
  ALL:            null,
  PENDING:        1,
  APPROVED:       2,
  REJECTED:       3,
  SOLD:           5,
  HIDDEN:         6,
  PENDINGPAYMENT: 7,
};

const TABS = [
  { key: S.ALL,            label: "Tất cả"          },
  { key: S.APPROVED,       label: "Đang bán"         },
  { key: S.PENDING,        label: "Chờ duyệt"        },
  { key: S.REJECTED,       label: "Từ chối"          },
  { key: S.SOLD,           label: "Đã bán"           },
  { key: S.HIDDEN,         label: "Đã ẩn"            },
  { key: S.PENDINGPAYMENT, label: "Chờ thanh toán"   },
];

const BADGE_MAP = {
  [S.PENDING]:        { cls: "pm-badge-pending",  text: "Chờ duyệt"       },
  [S.APPROVED]:       { cls: "pm-badge-approved", text: "Đang hiển thị"   },
  [S.REJECTED]:       { cls: "pm-badge-rejected", text: "Bị từ chối"      },
  [S.SOLD]:           { cls: "pm-badge-sold",     text: "Đã bán"          },
  [S.HIDDEN]:         { cls: "pm-badge-hidden",   text: "Đã ẩn"           },
  [S.PENDINGPAYMENT]: { cls: "pm-badge-hidden",   text: "Chờ thanh toán"  },
};

const UPLOADS = "https://api.chore123.cloud/uploads/";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Price({ post }) {
  if (post.priceType === "NEGOTIABLE")
    return <span className="pm-price-deal">Thương lượng</span>;
  if (post.priceType === "FIXED")
    return <span className="pm-price">{post.price ? post.price.toLocaleString("vi-VN") + " ₫" : "Liên hệ"}</span>;
  if (post.priceType === "RANGE")
    return <span className="pm-price">{post.minPrice?.toLocaleString("vi-VN")} – {post.maxPrice?.toLocaleString("vi-VN")} ₫</span>;
  return <span className="pm-price-contact">Liên hệ</span>;
}

function CardActions({ post, onEdit, onDel, onHide, onUnhide, onSold, onPay }) {
  const { postId, postStatusId: sid } = post;
  return (
    <div className="pm-actions">
      {sid === S.PENDING && (
        <button className="pm-btn" onClick={() => onEdit(postId)}>
          <FontAwesomeIcon icon={faPen} /> Sửa
        </button>
      )}
      {sid === S.PENDINGPAYMENT && (
        <button className="pm-btn" onClick={() => onPay(postId)}>
          <FontAwesomeIcon icon={faMoneyBill} /> Thanh toán
        </button>
      )}
      {sid === S.APPROVED && (
        <>
          <button className="pm-btn pm-btn-sold" onClick={() => onSold(postId)}>
            <FontAwesomeIcon icon={faCheckCircle} /> Đã bán
          </button>
          <button className="pm-btn" onClick={() => onHide(postId)}>
            <FontAwesomeIcon icon={faEyeSlash} /> Ẩn tin
          </button>
        </>
      )}
      {sid === S.HIDDEN && (
        <button className="pm-btn" onClick={() => onUnhide(postId)}>
          <FontAwesomeIcon icon={faEye} /> Hiện lại
        </button>
      )}
      <button className="pm-btn pm-btn-del" onClick={() => onDel(postId)}>
        <FontAwesomeIcon icon={faTrash} /> Xóa
      </button>
    </div>
  );
}

// ─── ProfileManagePosts ───────────────────────────────────────────────────────

export default function ProfileManagePosts({ userId }) {
  const navigate = useNavigate();
  const [posts,    setPosts]    = useState([]);
  const [statusId, setStatusId] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = async (sid) => {
    setLoading(true);
    try {
      const params = { page: 1, pageSize: 50 };
      if (sid !== null) params.statusId = sid;

      // ✅ Route mới: /api/profile/users/{userId}/posts
      const { data } = await api.get(`/api/profile/users/${userId}/posts`, { params });
      setPosts(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(statusId); }, [userId, statusId]);

  // ── Optimistic helpers ────────────────────────────────────────────────────

  const patchStatus = (id, newSid) =>
    setPosts((p) => p.map((x) => (x.postId === id ? { ...x, postStatusId: newSid } : x)));

  const dropPost = (id) => {
    setPosts((p) => p.filter((x) => x.postId !== id));
    setTotal((t) => t - 1);
  };

  // ── Actions (routes mới, tất cả đều có prefix /posts/) ───────────────────

  const handleDel = async (id) => {
    if (!window.confirm("Xóa tin này?")) return;
    try {
      // ✅ DELETE /api/profile/posts/{postId}
      const res = await api.post(`/api/profile/posts/delete/${id}`);
      Toast.fire({
        icon: "success",
        title: res.data.message ?? "Đã xóa thành công"
      })
      dropPost(id);
    } catch {
      Toast.fire({
        icon: "error",
        title: "Xóa thất bại"
      })
    }
  };

  const handleHide = async (id) => {
    try {
      // ✅ POST /api/profile/posts/{postId}/hide
      await api.post(`/api/profile/posts/${id}/hide`);
      patchStatus(id, S.HIDDEN);
    } catch {
      alert("Ẩn tin thất bại");
    }
  };

  const handleUnhide = async (id) => {
    try {
      // ✅ POST /api/profile/posts/{postId}/unhide
      await api.post(`/api/profile/posts/${id}/unhide`);
      patchStatus(id, S.APPROVED);
    } catch {
      alert("Bỏ ẩn thất bại");
    }
  };

  const handleSold = async (id) => {
    try {
      // ✅ POST /api/profile/posts/{postId}/mark-sold
      await api.post(`/api/profile/posts/${id}/mark-sold`);
      patchStatus(id, S.SOLD);
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  const handlePay  = (id) => navigate(`/pay/post/${id}`);
  const handleEdit = (id) => navigate(`/profile/edit/${id}`);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div className="pm">

        {/* Tabs */}
        <div className="pm-tabs">
          {TABS.map((tab) => (
            <button
              key={String(tab.key)}
              className={`pm-tab${statusId === tab.key ? " on" : ""}`}
              onClick={() => setStatusId(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="pm-count">{total} tin đăng</p>

        {/* Skeleton */}
        {loading && posts.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="pm-skeleton" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && (
          <div className="pm-empty">
            <FontAwesomeIcon icon={faFileAlt} />
            <p>Không có tin đăng nào</p>
            <Link to="/post/create" className="pm-cta">+ Đăng tin ngay</Link>
          </div>
        )}

        {/* List */}
        {posts.map((post) => {
          const badge = BADGE_MAP[post.postStatusId];
          return (
            <div key={post.postId} className="pm-card">
              <img
                src={post.thumbnail ? `${UPLOADS}${post.thumbnail}` : "http://localhost:5121"}
                className="pm-thumb"
                alt={post.title}
                onError={(e) => { e.target.src = ""; }}
              />

              <div className="pm-info">
                <div className="pm-title">{post.title}</div>
                <span className="pm-date">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </span>
                {badge && <span className={`pm-badge ${badge.cls}`}>{badge.text}</span>}
                <Price post={post} />
              </div>

              <CardActions
                post={post}
                onEdit={handleEdit}
                onDel={handleDel}
                onHide={handleHide}
                onUnhide={handleUnhide}
                onSold={handleSold}
                onPay={handlePay}
              />
            </div>
          );
        })}

      </div>
    </>
  );
}