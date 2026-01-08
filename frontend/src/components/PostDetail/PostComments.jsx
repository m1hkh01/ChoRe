import { useEffect, useState } from "react";
import api from "@/api";

function PostComments({ postId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    const isLogin = !!localStorage.getItem("token");

    const loadComments = () => {
        api.get(`/api/comments/post/${postId}`)
            .then(res => setComments(res.data));
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const submitComment = () => {
        if (!content.trim()) return;

        api.post("/api/comments", {
            postId,
            content
        }).then(() => {
            setContent("");
            loadComments();
        }).catch(err => {
            alert(err.response?.data || "Không thể bình luận");
        });
    };

    return (
        <div className="card p-3 mt-4">
            <h5 className="fw-bold mb-3">Bình luận</h5>

            {/* FORM */}
            {isLogin ? (
                <div className="mb-3">
                    <textarea
                        className="form-control mb-2"
                        rows={3}
                        placeholder="Viết bình luận..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={submitComment}
                    >
                        Gửi bình luận
                    </button>
                </div>
            ) : (
                <div className="text-muted mb-3">
                    Đăng nhập để bình luận
                </div>
            )}

            {/* LIST */}
            {comments.length === 0 && (
                <div className="text-muted">Chưa có bình luận nào</div>
            )}

            {comments.map(c => (
                <div key={c.cmtId} className="border-top pt-2 mt-2">
                    <div className="fw-bold">{c.user.fullName}</div>
                    <div className="text-muted small">
                        {new Date(c.createAt).toLocaleString()}
                    </div>
                    <div>{c.content}</div>
                </div>
            ))}
        </div>
    );
}

export default PostComments;
