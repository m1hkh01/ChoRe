import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";
import api from "@/api";
import "@/assets/PostComments.css";

function PostComments({ postId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLogin = !!localStorage.getItem("token");

    const loadComments = () => {
        api.get(`/api/comments/post/${postId}`)
            .then(res => setComments(res.data))
            .catch(err => console.error("Error loading comments:", err));
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const submitComment = async () => {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await api.post("/api/comments", { postId, content });
            setContent("");
            loadComments();
        } catch (err) {
            alert(err.response?.data || "Không thể bình luận");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitComment();
        }
    };

    return (
        <div className="comments-card">
            {/* Header */}
            <div className="comments-header">
                {/* <div className="comments-icon">
                    <FontAwesomeIcon icon={faComments} />
                </div> */}
                <h2 className="comments-title">
                    Bình luận ({comments.length})
                </h2>
            </div>

            <div className="comments-divider"></div>

            {/* Comment Form */}
            {isLogin ? (
                <div className="comment-form">
                    <textarea
                        className="comment-input"
                        rows={3}
                        placeholder="Viết bình luận của bạn..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                        <span className="comment-hint">
                            Nhấn Enter để gửi, Shift + Enter để xuống dòng
                        </span>
                    <div className="comment-form-footer">
                        <button
                            className="comment-submit-btn"
                            onClick={submitComment}
                            disabled={!content.trim() || isSubmitting}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <span>{isSubmitting ? "Đang gửi..." : "Gửi"}</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="comment-login-prompt">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Vui lòng đăng nhập để bình luận</span>
                </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="comments-empty">
                        <FontAwesomeIcon icon={faComments} />
                        <p>Chưa có bình luận nào</p>
                        <span>Hãy là người đầu tiên bình luận về sản phẩm này</span>
                    </div>
                ) : (
                    comments.map(c => (
                        <div key={c.cmtId} className="comment-item">
                            <div className="comment-avatar">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="comment-content">
                                <div className="comment-author">{c.user.fullName}</div>
                                <div className="comment-time">
                                    {new Date(c.createAt).toLocaleString('vi-VN')}
                                </div>
                                <div className="comment-text">{c.content}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PostComments;