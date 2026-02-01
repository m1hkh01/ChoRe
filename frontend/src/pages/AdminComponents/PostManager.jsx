import "@/assets/admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX, faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PostPreviewModal from "./PostPreviewModal";
import { useAuthStore } from "@/store/auth";
import api from "@/api";

function PostManager() {
    const [posts, setPosts] = useState([]);
    const [postsFilter, setPostsFilter] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [cancelPostId, setCancelPostId] = useState(null);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const { user } = useAuthStore();
    const role = user?.role.toLowerCase() || "";

    function debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }


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
            await api.post(`/api/${role}/posts/${id}/accept`);
            setPosts(prev => prev.filter(p => p.postId !== id));
            setSelectedPost(null);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi duyệt bài");
        }
    };

    const searchByUserName = (search) => {
        setPostsFilter(posts.filter(item=>item.user.userName.includes(search)))
    }
    const debounceSearch = debounce(searchByUserName, 500);

    // ❌ TỪ CHỐI BÀI
    const rejectPost = async () => {
        if (!rejectReason || !cancelPostId) return;

        try {
            await api.post(
                `/api/${role}/posts/${cancelPostId}/reject`,
                JSON.stringify(rejectReason),
                { headers: { "Content-Type": "application/json" } }
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
            const res = await api.get(`/api/${role}/posts`);
            setPosts(res.data);
            setPostsFilter(res.data);
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="post-container">
                <div className="title">
                    <span>Quản lý bài viết</span>
                </div>
                <div className="header">
                    <h4>Danh sách bài viết cần duyệt</h4>
                    <div className="d-flex">
                        {/* <div className="filter">
                            <button className="btn-filter">Lọc</button>
                            <div className="filter-box">

                            </div>
                        </div> */}
                        <input type="text" placeholder="Tìm kiếm theo tên người dùng ..." onChange={(e)=>debounceSearch(e.target.value)} />
                    </div>
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
                                { postsFilter.length > 0 ?  postsFilter.map(post => (
                                    <tr key={post.postId}>
                                        <td>{post.postId}</td>
                                        <td>{post.title}</td>
                                        <td>{post.user.userName}</td>
                                        <td>{formatDate(post.createdAt)}</td>
                                        <td>{formatPrice(post.price)}</td>
                                        <td className="actions">
                                            <button className="btn-preview" onClick={() => setSelectedPost(post)}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button className="btn-accept" onClick={() => acceptPost(post.postId)}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button className="btn-cancel" onClick={() => {
                                                setCancelPostId(post.postId);
                                                setShowRejectReason(true);
                                            }}>
                                                <FontAwesomeIcon icon={faX} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <h4 className="text-center mt-3">Không có bài viết nào phù hợp</h4>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    ) : (
                        <h4 className="text-center mt-3">Không có bài cần duyệt</h4>
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
