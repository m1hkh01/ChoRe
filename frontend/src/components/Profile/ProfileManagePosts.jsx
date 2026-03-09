import { useEffect, useState } from "react";
import api from "@/api";
// import PostCard from "@/components/Post/PostCard";
import "@/assets/ProfileManagePosts.css";
// import EditPostModal from "@/components/Post/EditPostModal";
import { useNavigate } from "react-router-dom";

const STATUS = {
    ALL: null,
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    SELLING: 2,
    SOLD: 5,
    HIDDEN: 6
};

const STATUS_TABS = [
    { key: STATUS.ALL, label: "Tất cả" },
    { key: STATUS.PENDING, label: "Chờ duyệt" },
    { key: STATUS.SELLING, label: "Đang bán" },
    { key: STATUS.REJECTED, label: "Từ chối" },
    { key: STATUS.SOLD, label: "Đã bán" },
    { key: STATUS.HIDDEN, label: "Đã ẩn" },
];

export default function ProfileManagePosts({ userId }) {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ================= LOAD POSTS ================= */

    const loadPosts = async () => {

        setLoading(true);

        try {

            const params = {};

            if (statusId !== null)
                params.statusId = statusId;

            const res = await api.get(
                `/api/profile/${userId}/posts`,
                { params }
            );

            setPosts(res.data.items);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPosts();

    }, [statusId, userId]);


    /* ================= ACTIONS ================= */

    // XÓA
    const deletePost = async (postId) => {

        if (!confirm("Bạn có chắc muốn xóa tin này?")) return;

        try {

            await api.delete(`/api/profile/${postId}`);

            // update UI ngay
            setPosts(prev =>
                prev.filter(p => p.postId !== postId)
            );

        }
        catch {
            alert("Xóa thất bại");
        }

    };

    const unhidePost = async (postId) => {

        try {

            await api.put(`/api/profile/${postId}/unhide`);

            setPosts(prev =>
                prev.map(p =>
                    p.postId === postId
                        ? { ...p, postStatusId: STATUS.APPROVED }
                        : p
                )
            );

        }
        catch {
            alert("Bỏ ẩn thất bại");
        }

    };


    // SỬA
    const editPost = (postId) => {
        navigate(`/profile/edit/${postId}`);
    };


    // ĐÃ BÁN
    const markAsSold = async (postId) => {
        
        try {
            console.log(`Marking post ${postId} as sold...`);
            await api.put(`/api/profile/${postId}/mark-sold`);

            setPosts(prev =>
                prev.map(p =>
                    p.postId === postId
                        ? { ...p, postStatusId: STATUS.SOLD }
                        : p
                )
            );

        }
        catch {
            alert("Cập nhật thất bại");
        }

    };


    // ẨN TIN
    const hidePost = async (postId) => {

        try {

            await api.put(`/api/profile/${postId}/hide`);

            setPosts(prev =>
                prev.map(p =>
                    p.postId === postId
                        ? { ...p, postStatusId: STATUS.HIDDEN }
                        : p
                )
            );

        }
        catch {
            alert("Ẩn tin thất bại");
        }

    };


    /* ================= RENDER BUTTONS ================= */

    const renderActions = (post) => {

        switch (post.postStatusId) {

            // CHỜ DUYỆT / TỪ CHỐI
            case STATUS.PENDING:
                return (
                    <>
                        <button
                            className="pf-btn pf-btn-edit"
                            onClick={() => editPost(post.postId)}
                        >
                            Sửa tin
                        </button>

                        <button
                            className="pf-btn pf-btn-delete"
                            onClick={() => deletePost(post.postId)}
                        >
                            Xóa tin
                        </button>
                    </>
                );

                case STATUS.REJECTED:
                return (
                    <>
                        <button
                            className="pf-btn pf-btn-delete"
                            onClick={() => deletePost(post.postId)}
                        >
                             Xóa tin
                        </button>
                    </>
                );


            // ĐANG HIỂN THỊ / ĐANG BÁN
            case STATUS.APPROVED:
                return (
                    <>
                        <button
                            className="pf-btn pf-btn-sold"
                            onClick={() => markAsSold(post.postId)}
                        >
                            Đã bán
                        </button>

                        <button
                            className="pf-btn pf-btn-hide"
                            onClick={() => hidePost(post.postId)}
                        >
                            Ẩn tin
                        </button>

                        <button
                            className="pf-btn pf-btn-delete"
                            onClick={() => deletePost(post.postId)}
                        >
                             Xóa tin
                        </button>
                    </>
                );


            // ĐÃ ẨN
            case STATUS.HIDDEN:
                return (
                    <>
                        <button
                            className="pf-btn pf-btn-unhide"
                            onClick={() => unhidePost(post.postId)}
                        >
                            👁 Hiển thị lại
                        </button>

                        <button
                            className="pf-btn pf-btn-delete"
                            onClick={() => deletePost(post.postId)}
                        >
                             Xóa tin
                        </button>
                    </>
                );


            // ĐÃ BÁN
            case STATUS.SOLD:
                return (
                    <>
                        <button
                            className="pf-btn pf-btn-delete"
                            onClick={() => deletePost(post.postId)}
                        >
                             Xóa tin
                        </button>
                    </>
                );


            default:
                return null;
        }

    };

    const renderPrice = (post) => {

        switch (post.priceType) {

            case "NEGOTIABLE":
                return (
                    <span className="pf-price pf-price-negotiable">
                        Thương lượng
                    </span>
                );

            case "FIXED":
                return (
                    <span className="pf-price pf-price-fixed">
                        {post.price
                            ? post.price.toLocaleString("vi-VN") + " ₫"
                            : "Liên hệ"}
                    </span>
                );

            case "RANGE":
                return (
                    <span className="pf-price pf-price-range">
                        {post.minPrice?.toLocaleString("vi-VN")} -{" "}
                        {post.maxPrice?.toLocaleString("vi-VN")} ₫
                    </span>
                );

            default:
                return (
                    <span className="pf-price pf-price-contact">
                        Liên hệ
                    </span>
                );
        }

    };

    const getStatusText = (statusId) => {

        switch (statusId) {

            case STATUS.PENDING:
                return "Chờ duyệt";

            case STATUS.APPROVED:
            case STATUS.SELLING:
                return "Đang hiển thị";

            case STATUS.REJECTED:
                return "Bị từ chối";

            case STATUS.SOLD:
                return "Đã bán";

            case STATUS.HIDDEN:
                return "Đã ẩn";

            default:
                return "";
        }

    };

    /* ================= UI ================= */

    return (

        <div>

            {/* FILTER */}
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


            {/* EMPTY */}
            {!loading && posts.length === 0 && (

                <div className="pf-empty">

                    <div className="pf-empty-icon">📄</div>

                    <p>Không có tin đăng nào</p>

                </div>

            )}


            {/* LIST */}
            <div className="pf-list">

                {posts.map(post => (

                    <div key={post.postId} className="pf-row-card">

                        {/* IMAGE */}
                        <img
                            src={
                                post.thumbnail
                                    ? `http://localhost:5121/uploads/${post.thumbnail}`
                                    : "/no-image.png"
                            }
                            className="pf-row-image"
                            alt=""
                        />

                        {/* INFO */}
                        <div className="pf-row-info">

                            <div className="pf-row-title">
                                {post.title}
                            </div>

                            <div className="pf-row-meta">
                                Ngày đăng: {new Date(post.createdAt).toLocaleString()}
                            </div>

                            <div className="pf-row-status">
                                Trạng thái: {getStatusText(post.postStatusId)}
                            </div>

                            <div className="pf-row-price">
                                {renderPrice(post)}
                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="pf-row-actions">

                            {renderActions(post)}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}