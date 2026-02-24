import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import PostCard from "@/components/Post/PostCard";

/* ===== STATUS FILTER TABS ===== */
const STATUS_TABS = [
    { key: null, label: "Tất cả"         },
    { key: 2,    label: "Đang hiển thị"  },
    { key: 1,    label: "Chờ duyệt"      },
    { key: 3,    label: "Từ chối"        },
    { key: 4,    label: "Đang bán"       },
    { key: 5,    label: "Đã bán"         },
    { key: 6,    label: "Đã ẩn"          },
];

export default function ProfilePosts({ userId, isOwner }) {
    const [posts,    setPosts]   = useState([]);
    const [statusId, setStatusId] = useState(null);
    const [page,     setPage]    = useState(1);
    const [hasNext,  setHasNext] = useState(false);
    const [total,    setTotal]   = useState(0);
    const [loading,  setLoading] = useState(false);

    const loadPosts = async (pageNumber, selectedStatus, reset) => {
        setLoading(true);
        try {
            const params = { page: pageNumber, pageSize: 12 };
            if (selectedStatus !== null) params.statusId = selectedStatus;

            const res = await api.get(`/api/profile/${userId}/posts`, { params });

            setPosts(prev => reset ? res.data.items : [...prev, ...res.data.items]);
            setTotal(res.data.total);
            setHasNext(res.data.hasNext);
            setPage(pageNumber);
        } catch (err) {
            console.error("Load posts error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPosts(1, statusId, true); }, [userId, statusId]);

    return (
        <div className="pf-posts">

            {/* ── Filter bar (owner only) ── */}
            {isOwner && (
                <div className="pf-filter-bar">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key ?? "all"}
                            className={`pf-chip ${statusId === tab.key ? "pf-chip--active" : ""}`}
                            onClick={() => setStatusId(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Count ── */}
            <p className="pf-count">{total} bài đăng</p>

            {/* ── Empty ── */}
            {!loading && posts.length === 0 && (
                <div className="pf-empty">
                    <div className="pf-empty-icon">📭</div>
                    <p>Chưa có bài đăng nào</p>
                    {isOwner && (
                        <Link to="/post/create" className="pf-create-btn">
                            + Đăng tin ngay
                        </Link>
                    )}
                </div>
            )}

            {/* ── Skeleton ── */}
            {loading && posts.length === 0 && (
                <div className="pf-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="pf-skeleton" />
                    ))}
                </div>
            )}

            {/* ── Grid dùng PostCard ── */}
            {posts.length > 0 && (
                <>
                    <div className="pf-grid">
                        {posts.map(post => (
                            <PostCard key={post.postId} post={post} />
                        ))}
                    </div>

                    {hasNext && (
                        <div className="pf-load-more">
                            <button
                                className="pf-load-btn"
                                onClick={() => loadPosts(page + 1, statusId, false)}
                                disabled={loading}
                            >
                                {loading ? "Đang tải..." : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}