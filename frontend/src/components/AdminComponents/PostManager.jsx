import "@/assets/admin.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX, faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PostPreviewModal from "./PostPreviewModal";
import api from "../../api";
function PostManager() {
    const [posts, setPosts] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [rejectReason, setRejectReason] = useState(false);
    const [cancelPostId, setCancelPostId] = useState('');
    const [showRejectReason, setShowRejectReason] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";

        // ép ISO có timezone
        const iso = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";

        const date = new Date(iso);

        return date.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const formatPrice = (price) => Number(price).toLocaleString('vi-VN', { style: "currency", currency: "VND" })

    const AcceptPost = async (id) => {
        try {
            console.log("Post ID: ", id);
            api.post(`/accept-post/${id}`);
            setPosts((prev) => prev.filter(post => post.postId != id));
            selectedPost(null);
        }
        catch (err) {
            if (err.response && err.response.status == 404) {
                alert(err.response.data.error);
            }
            console.log("Loi khi duyet/tu choi bai viet: ", err);
        }
    }
    const CancelPost = async () => {
        try {
            // const result = confirm("bạn có chắc muốn từ chối bài này không");
            if (!rejectReason) return;
            api.post(`/cancel-post/${cancelPostId}`, rejectReason, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setPosts((prev) => prev.filter(post => post.postId != cancelPostId));
            setShowRejectReason(false);
            selectedPost(null);
        }
        catch (err) {
            if (err.response && err.response.status == 404) {
                alert(err.response.data.error);
            }
            console.log("Loi khi duyet/tu choi bai viet: ", err);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const res = await api.get("/admin-posts")
            console.log("Danh sach bai viet can duyet: ", res.data);
            setPosts(res.data);
        }
        fetchData();
    }, [])
    return (
        <>
            <div className="post-container">
                <div className="title">
                    <span>Quản lý bài viết</span>
                </div>
                <div className="header">
                    <h4>Danh sách bài viết cần duyệt</h4>
                    <input type="text" placeholder="Tìm bài viết theo tên" />
                </div>
                <div className="list-post">
                    {
                        posts?.length > 0 ? (
                            <table className="post-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tiêu đề</th>
                                        <th>Người đăng</th>
                                        <th>Ngày đăng</th>
                                        <th>Giá bán</th>
                                        <th>Địa chỉ</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        posts.map(post => {
                                            return (
                                                <tr key={post.postId}>
                                                    <td>{post.postId}</td>
                                                    <td>{post.title}</td>
                                                    <td>{post.user.userName}</td>
                                                    <td>{formatDate(post.createdAt)}</td>
                                                    <td>{formatPrice(post.price)}</td>
                                                    <td>{post.description}</td>
                                                    <td>
                                                        <div className="actions">
                                                            <button className="btn-preview" onClick={() => setSelectedPost(post)}><FontAwesomeIcon icon={faEye} /></button>
                                                            <button className="btn-accept" onClick={() => AcceptPost(post.postId)}><FontAwesomeIcon icon={faCheck} /></button>
                                                            <button className="btn-cancel" onClick={() => {
                                                                setCancelPostId(post.postId); setShowRejectReason(true)
                                                            }
                                                            }>
                                                                <FontAwesomeIcon icon={faX} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        ) : (
                            <h4 className="text-center mt-3">Không có bài viết nào cần dc duyệt</h4>
                        )
                    }

                </div>
            </div >
            {
                selectedPost ? (
                    <PostPreviewModal
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)
                        }
                        onApprove={(id) => AcceptPost(id)}
                        onReject={(id) => { setCancelPostId(id); setShowRejectReason(true) }}
                        // onViewDetail={(id) => { setCancelPostId(id); setShowRejectReason(true) }}
                    />
                ) : ""
            }
            {
                showRejectReason ? (
                    <div className="modal d-block" style={{zIndex: 1800}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Lý do từ chối</h4>
                                    <button className="btn-close" onClick={()=>setShowRejectReason(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mt-3">
                                        <select id="reject-reason" onChange={(e) => setRejectReason(e.target.value)} className="form-select">
                                            <option value="">----Chọn lý do từ chối----</option>
                                            <option value="Vi phạm quy định">Vi phạm quy định</option>
                                            <option value="Ảnh sản phẩm không hợp lệ">Ảnh sản phẩm không hợp lệ</option>
                                            <option value="Sản phẩm bị cấm">Sản phẩm bị cấm</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn-accept" onClick={() => CancelPost()}>Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ""
            }
        </>

    );
}
export default PostManager;