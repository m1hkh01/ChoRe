import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import "@/assets/ProfileComments.css";

export default function ProfileComments({ userId }) {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);

    const load = async (p, reset) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/profile/${userId}/comments`, {
                params: { page: p, pageSize: 10 },
            });
            setComments(prev => reset ? res.data.items : [...prev, ...res.data.items]);
            setHasNext(res.data.hasNext);
            setTotal(res.data.total);
            setPage(p);
        } catch (err) {
            console.error("Load comments error:", err);
        } finally {
            setLoading(false);
        }
    };
    const toggleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };
    const deleteComment = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

        try {
            await api.delete(`/api/comments/${id}`);
            setComments(prev => prev.filter(c => c.cmtId !== id));
            setTotal(prev => prev - 1);
        } catch (err) {
            console.error("Delete comment error:", err);
        }
    };
    const deleteSelected = async () => {
        if (selected.length === 0) return;

        if (!confirm("Xóa các bình luận đã chọn?")) return;

        try {
            await Promise.all(selected.map(id => api.delete(`/api/comments/${id}`)));

            setComments(prev => prev.filter(c => !selected.includes(c.cmtId)));
            setTotal(prev => prev - selected.length);
            setSelected([]);
        } catch (err) {
            console.error("Delete multiple comments error:", err);
        }
    };

    useEffect(() => { load(1, true); }, [userId]);

    return (
        <div className="pf-comments">
            <p className="pf-count">{total} bình luận</p>

            {!loading && comments.length === 0 && (
                <div className="pf-empty">
                    <div className="pf-empty-icon">💬</div>
                    <p>Chưa có bình luận nào</p>
                </div>
            )}

            {selected.length > 0 && (
                <button className="pf-delete-selected" onClick={deleteSelected}>
                    Xóa {selected.length} bình luận
                </button>
            )}

            <div className="pf-comments-list">
                {comments.map(c => (
                    <div key={c.cmtId} className="pf-comment-item">

                        <input
                            type="checkbox"
                            checked={selected.includes(c.cmtId)}
                            onChange={() => toggleSelect(c.cmtId)}
                        />

                        <div className="pf-comment-left">
                            <img
                                src={c.user?.avatar
                                    ? `http://localhost:5121/uploads/${c.user.avatar}`
                                    : "/default-avatar.png"}
                                alt={c.user?.fullName}
                                className="pf-commenter-avatar"
                            />

                            <div className="pf-comment-body">
                                <div className="pf-comment-text">
                                    <b>{c.user.fullName}</b> đã bình luận về bài viết{" "}
                                    <b>{c.post.title}</b>
                                </div>

                                <div className="pf-comment-content">
                                    <b>Nội dung:</b> {c.content}
                                </div>

                                <div className="pf-comment-date">
                                    {new Date(c.createAt).toLocaleDateString("vi-VN")}
                                </div>
                            </div>
                        </div>

                        <div className="pf-comment-actions">
                            <Link
                                to={`/posts/${c.post.postId}`}
                                className="pf-comment-view"
                            >
                                Xem
                            </Link>

                            <button
                                className="pf-comment-delete"
                                onClick={() => deleteComment(c.cmtId)}
                            >
                                Xóa
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {hasNext && (
                <div className="pf-load-more">
                    <button
                        className="pf-load-btn"
                        onClick={() => load(page + 1, false)}
                        disabled={loading}
                    >
                        {loading ? "Đang tải..." : "Xem thêm"}
                    </button>
                </div>
            )}
        </div>
    );
}
