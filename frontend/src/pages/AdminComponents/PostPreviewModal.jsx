import api from "@/api";
import "@/assets/postPreviewModal.css";

function PostPreviewModal({ post, onClose, onApprove, onReject }) {
    if (!post) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const iso = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
        return new Date(iso).toLocaleString("vi-VN");
    };

    const baseURL = api.defaults.baseURL;

    return (
        <>
            <div className="ppm-overlay" onClick={onClose}></div>

            <div className="ppm-modal">
                {/* HEADER */}
                <div className="ppm-header">
                    <h2>Xem trước bài viết</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* BODY */}
                <div className="ppm-body">
                    {/* LEFT */}
                    <div className="ppm-left">
                        <div className="ppm-section">
                            <h3>{post.title}</h3>
                            <div className="ppm-meta">
                                <span>👤 {post.user.userName}</span>
                                <span>🕒 {formatDate(post.createdAt)}</span>
                                <span className="price">
                                    {post.price.toLocaleString("vi-VN")} đ
                                </span>
                            </div>
                        </div>

                        <div className="ppm-section">
                            <h4>Mô tả</h4>
                            <div
                                className="ckeditor-preview"
                                dangerouslySetInnerHTML={{ __html: post.description }}
                            />
                        </div>

                        <div className="ppm-section">
                            <h4>Cấu hình chi tiết</h4>
                            <table className="spec-table">
                                <tbody>
                                    {post.postSpecificationsDto.map((ps, index) => (
                                        <tr key={index}>
                                            <td>{ps.specName}</td>
                                            <td>{ps.specValue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="ppm-right">
                        <h4>Hình ảnh</h4>
                        <div className="image-grid">
                            {post.postImages?.map((img, index) => (
                                <img
                                    key={img.postImageId ?? index}
                                    src={`${baseURL}/uploads/${img.postImage1}`}
                                    alt={post.title}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="ppm-footer">
                    <button
                        className="btn reject"
                        onClick={() => onReject(post.postId)}
                    >
                        Từ chối
                    </button>
                    <button
                        className="btn approve"
                        onClick={() => onApprove(post.postId)}
                    >
                        Duyệt bài
                    </button>
                </div>
            </div>
        </>
    );
}

export default PostPreviewModal;
