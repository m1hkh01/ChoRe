// ─── ProfileSaved.jsx ─────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import api from "@/api";
import PostCard from "@/components/Post/PostCard";

export function ProfileSaved() {
    const [posts, setPosts]     = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage]       = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [total, setTotal]     = useState(0);

    const load = async (p = 1, reset = false) => {
        setLoading(true);
        try {
            const res = await api.get("/api/save-posts");
            setPosts(res.data);
            setHasNext(false);
            setTotal(res.data.length);
            setPage(p);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(1, true); }, []);

    return (
        <div className="profile-posts">
            <div className="posts-count">{total} bài đã lưu</div>

            {posts.length === 0 && !loading ? (
                <div className="posts-empty">
                    <div className="posts-empty-icon">🔖</div>
                    <p>Chưa có bài đăng nào được lưu</p>
                </div>
            ) : (
                <>
                    <div className="posts-grid">
                        {posts.map(post => (
                            <div key={post.postId} className="posts-grid-item">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>

                    {hasNext && (
                        <div className="load-more-wrap">
                            <button
                                className="load-more-btn"
                                onClick={() => load(page + 1)}
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

export default ProfileSaved;