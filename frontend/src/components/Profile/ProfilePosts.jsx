import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import api from "@/api";
import PostCard from "@/components/Post/PostCard";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .pp-wrap { display: flex; flex-direction: column; gap: 16px; }
  .pp-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
  .pp-tab {
    padding: 5px 14px; border-radius: 999px; border: 1px solid #e2e8f0;
    background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b;
    cursor: pointer; white-space: nowrap; transition: all 0.15s;
  }
  .pp-tab:hover { border-color: #22c55e; color: #16a34a; }
  .pp-tab.on { background: #22c55e; border-color: #22c55e; color: #fff; }
  .pp-count { font-size: 13px; color: #64748b; margin: 0; }
  .pp-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px;
  }
  .pp-skeleton {
    height: 280px; border-radius: 14px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%; animation: ppShimmer 1.4s infinite;
  }
  @keyframes ppShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .pp-empty {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 60px 20px; background: #fff; border: 1px solid #e2e8f0;
    border-radius: 12px; text-align: center;
  }
  .pp-empty svg { font-size: 38px; color: #e2e8f0; }
  .pp-empty p   { margin: 0; font-size: 14px; font-weight: 500; color: #475569; }
  .pp-create-btn {
    padding: 9px 22px; background: #22c55e; color: #fff; border-radius: 9px;
    font-size: 13px; font-weight: 700; text-decoration: none; transition: background 0.15s;
  }
  .pp-create-btn:hover { background: #16a34a; }
  .pp-more { display: flex; justify-content: center; }
  .pp-more-btn {
    padding: 8px 24px; border: 1px solid #e2e8f0; border-radius: 8px;
    background: #fff; font-size: 13px; font-weight: 600; color: #475569;
    cursor: pointer; transition: all 0.15s;
  }
  .pp-more-btn:hover    { border-color: #22c55e; color: #16a34a; background: #f0fdf4; }
  .pp-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  @media (max-width: 600px) { .pp-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
  @media (max-width: 400px) { .pp-grid { grid-template-columns: 1fr; } }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: null, label: "Tất cả"   },
  { key: 2,    label: "Đang bán" },
  { key: 1,    label: "Chờ duyệt"},
  { key: 3,    label: "Từ chối"  },
  { key: 5,    label: "Đã bán"   },
  { key: 6,    label: "Đã ẩn"    },
];

const PAGE_SIZE = 12;

// ─── ProfilePosts ─────────────────────────────────────────────────────────────

export default function ProfilePosts({ userId, isOwner }) {
  const [posts,   setPosts]   = useState([]);
  const [statusId,setStatusId]= useState(null);
  const [page,    setPage]    = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (p, sid, reset = false) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize: PAGE_SIZE };
      if (sid !== null) params.statusId = sid;

      // ✅ Route mới: /api/profile/users/{userId}/posts
      const { data } = await api.get(`/api/profile/users/${userId}/posts`, { params });

      setPosts((prev) => reset ? data.items : [...prev, ...data.items]);
      setTotal(data.total);
      setHasNext(data.hasNext);
      setPage(p);
    } catch (e) {
      console.error("Load posts error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, statusId, true); }, [userId, statusId]);

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-wrap">

        {isOwner && (
          <div className="pp-tabs">
            {TABS.map((tab) => (
              <button
                key={String(tab.key)}
                className={`pp-tab${statusId === tab.key ? " on" : ""}`}
                onClick={() => setStatusId(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <p className="pp-count">{total} bài đăng</p>

        {loading && posts.length === 0 && (
          <div className="pp-grid">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="pp-skeleton" />)}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="pp-empty">
            <FontAwesomeIcon icon={faFileAlt} />
            <p>Chưa có bài đăng nào</p>
            {isOwner && (
              <Link to="/post/create" className="pp-create-btn">+ Đăng tin ngay</Link>
            )}
          </div>
        )}

        {posts.length > 0 && (
          <>
            <div className="pp-grid">
              {posts.map((post) => <PostCard key={post.postId} post={post} />)}
            </div>

            {hasNext && (
              <div className="pp-more">
                <button
                  className="pp-more-btn"
                  onClick={() => load(page + 1, statusId)}
                  disabled={loading}
                >
                  {loading ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}