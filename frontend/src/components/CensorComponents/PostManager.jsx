import "@/assets/censor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX, faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PostPreviewModal from "./PostPreviewModal";
import api from "../../api";

function PostManager() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [cancelPostId, setCancelPostId] = useState(null);
    const [showRejectReason, setShowRejectReason] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const iso = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
        return new Date(iso).toLocaleString("vi-VN");
    };

    const formatPrice = (price) =>
        Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    // ✅ DUYỆT BÀI
    const acceptPost = async (id) => {
        try {
            await api.post(`/api/censor/posts/${id}/accept`);
            setPosts(prev => prev.filter(p => p.postId !== id));
            setSelectedPost(null);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi duyệt bài");
        }
    };

    // ❌ TỪ CHỐI BÀI
    const rejectPost = async () => {
        if (!rejectReason || !cancelPostId) return;

        try {
            await api.post(
                `/api/censor/posts/${cancelPostId}/reject`,
                { RejectReason: rejectReason }  // ✅ Đúng: khớp với backend
            );

            setPosts(prev => prev.filter(p => p.postId !== cancelPostId));
            setShowRejectReason(false);
            setRejectReason("");
            setSelectedPost(null);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi từ chối bài");
        }
    };

    // 📥 LOAD DATA
    useEffect(() => {
        async function fetchData() {
            const res = await api.get("/api/censor/posts");
            setPosts(res.data);
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="post-container">
                <div className="title">
                    <span>Quản lý bài viết</span>
                </div>

                <div className="list-post">
                    {posts.length > 0 ? (
                        <table className="post-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tiêu đề</th>
                                    <th>Người đăng</th>
                                    <th>Ngày đăng</th>
                                    <th>Giá</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.postId}>
                                        <td>{post.postId}</td>
                                        <td>{post.title}</td>
                                        <td>{post.user.userName}</td>
                                        <td>{formatDate(post.createdAt)}</td>
                                        <td>{formatPrice(post.price)}</td>
                                        <td>
                                            <button onClick={() => setSelectedPost(post)}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button onClick={() => acceptPost(post.postId)}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button onClick={() => {
                                                setCancelPostId(post.postId);
                                                setShowRejectReason(true);
                                            }}>
                                                <FontAwesomeIcon icon={faX} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h4>Không có bài cần duyệt</h4>
                    )}
                </div>
            </div>

            {selectedPost && (
                <PostPreviewModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onApprove={acceptPost}
                    onReject={(id) => {
                        setCancelPostId(id);
                        setShowRejectReason(true);
                    }}
                />
            )}

            {showRejectReason && (
                <div className="modal d-block" style={{ zIndex: 1800 }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>Lý do từ chối</h4>
                                <button className="btn-close" onClick={() => setShowRejectReason(false)} />
                            </div>
                            <div className="modal-body">
                                <select
                                    className="form-select"
                                    value={rejectReason}  
                                    onChange={(e) => setRejectReason(e.target.value)}
                                >
                                    <option value="">-- Chọn lý do --</option>
                                    <option value="Vi phạm quy định">Vi phạm quy định</option>
                                    <option value="Ảnh không hợp lệ">Ảnh không hợp lệ</option>
                                    <option value="Sản phẩm bị cấm">Sản phẩm bị cấm</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={rejectPost}>
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostManager;
