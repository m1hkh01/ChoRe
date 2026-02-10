import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import PostCard from "@/components/Post/PostCard";


/* ===== STATUS FILTER TABS ===== */
const STATUS_TABS = [
    { key: null, label: "Tất cả" },

    { key: 2, label: "Đang hiển thị" }, // Approved
    { key: 1, label: "Chờ duyệt" },     // Pending
    { key: 3, label: "Từ chối" },       // Reject

    { key: 4, label: "Đang bán" },
    { key: 5, label: "Đã bán" },
    { key: 6, label: "Đã ẩn" },
];

export default function ProfilePosts({ userId, isOwner }) {
    const [posts, setPosts] = useState([]);

    // ✅ statusId dùng number hoặc null
    const [statusId, setStatusId] = useState(null);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    /* ===== LOAD POSTS FUNCTION ===== */
    const loadPosts = async (pageNumber, selectedStatus, reset) => {
        setLoading(true);

        try {
            const params = {
                page: pageNumber,
                pageSize: 12,
            };

            // ✅ chỉ gửi statusId nếu có chọn filter
            if (selectedStatus !== null) {
                params.statusId = selectedStatus;
            }

            const res = await api.get(
                `/api/profile/${userId}/posts`,
                { params }
            );

            // ✅ reset list khi đổi filter
            setPosts((prev) =>
                reset ? res.data.items : [...prev, ...res.data.items]
            );

            setTotal(res.data.total);
            setHasNext(res.data.hasNext);
            setPage(pageNumber);
        } catch (err) {
            console.error("Load posts error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ===== LOAD WHEN USER OR STATUS CHANGES ===== */
    useEffect(() => {
        loadPosts(1, statusId, true);
    }, [userId, statusId]);

    /* ===== LOAD MORE ===== */
    const handleLoadMore = () => {
        loadPosts(page + 1, statusId, false);
    };

    return (
        <div className="pf-posts">
            {/* ===== FILTER BAR (OWNER ONLY) ===== */}
            {isOwner && (
                <div className="pf-filter-bar">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key ?? "all"}
                            className={`pf-chip ${
                                statusId === tab.key ? "pf-chip--active" : ""
                            }`}
                            onClick={() => setStatusId(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ===== COUNT ===== */}
            <p className="pf-count">{total} bài đăng</p>

            {/* ===== EMPTY STATE ===== */}
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

            {/* ===== LOADING SKELETON ===== */}
            {loading && posts.length === 0 && (
                <div className="pf-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="pf-skeleton" />
                    ))}
                </div>
            )}

            {/* ===== POSTS GRID ===== */}
            {posts.length > 0 && (
                <>
                    <div className="pf-grid">
                        {posts.map((post) => (
                            <PostCard key={post.postId} post={post} />
                        ))}
                    </div>

                    {/* ===== LOAD MORE BUTTON ===== */}
                    {hasNext && (
                        <div className="pf-load-more">
                            <button
                                className="pf-load-btn"
                                onClick={handleLoadMore}
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
