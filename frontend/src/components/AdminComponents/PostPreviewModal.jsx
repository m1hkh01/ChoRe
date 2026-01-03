import api from "../../api";
import "@/assets/postPreviewModal.css";

function PostPreviewModal({ post, onClose, onApprove, onReject }) {
    if (!post) return null;

    const baseURL = api.defaults.baseURL;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-preview">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Xem trước bài viết</h3>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="preview-images">
                            {post.postImages?.map((img, index) => (
                                <img
                                    key={img.postImageId ?? index}
                                    src={`${baseURL}/uploads/${img.postImage1}`}
                                    alt={post.title}
                                />
                            ))}

                        </div>

                        <p><b>Tiêu đề:</b> {post.title}</p>
                        <p><b>Giá:</b> {post.price.toLocaleString("vi-VN")} đ</p>
                        <p><b>Người đăng:</b> {post.user.userName}</p>
                        <p><b>Mô tả:</b> {post.description}</p>
                    </div>

                    <div className="modal-footer">
                        <button onClick={() => onReject(post.postId)}>Từ chối</button>
                        <button onClick={() => onApprove(post.postId)}>Duyệt</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostPreviewModal;
