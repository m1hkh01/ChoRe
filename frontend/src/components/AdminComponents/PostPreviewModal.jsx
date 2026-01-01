import "@/assets/postPreviewModal.css";

function PostPreviewModal({ post, onClose, onApprove, onReject, onViewDetail }) {
    if (!post) return null;

    const categoryNames =
        post.postCates && post.postCates.length > 0
            ? post.postCates.map(c => c.cateName).join(", ")
            : "Chưa phân loại";
    
    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-preview">
                <div className="modal-content">
                    {/* HEADER */}
                    <div className="modal-header">
                        <h3>Xem trước bài viết</h3>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">
                        <h4>Ảnh bài viết</h4>
                        <div className="preview-images">
                            {
                                post.postImages.map(img => (
                                    <img
                                        src={"http://localhost:5121/uploads/" + img.postImage1}
                                        alt={post.title}
                                        className="preview-image"
                                    />
                                ))
                            }
                        </div>

                        <div className="preview-right">
                            <h4>{post.title}</h4>

                            <p className="price">
                                {post.price.toLocaleString("vi-VN")} đ
                            </p>

                            <p><b>Danh mục:</b> {categoryNames}</p>
                            <p><b>Hãng:</b> {post.brand?.brandName}</p>
                            <p><b>Người đăng:</b> {post.user?.userName}</p>
                            <p><b>Địa chỉ:</b> {post.address}</p>

                            <p className="short-desc">
                                <b>Mô tả:</b> {post.description}
                            </p>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button
                            className="reject"
                            onClick={() => onReject(post.postId)}
                        >
                            Từ chối
                        </button>

                        <button
                            className="approve"
                            onClick={() => onApprove(post.postId)}
                        >
                            Duyệt
                        </button>

                        <button
                            className="detail"
                            onClick={() => onViewDetail(post.postId)}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostPreviewModal;
