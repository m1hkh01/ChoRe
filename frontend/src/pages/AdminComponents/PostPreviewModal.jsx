import api from "@/api";
import "@/assets/postPreviewModal.css";

function PostPreviewModal({ post, onClose, onApprove, onReject }) {
    if (!post) return null;
    console.log(post);
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const iso = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
        return new Date(iso).toLocaleString("vi-VN");
    };
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
                        <div className="modal-info">
                            <div className="modal-row">
                                <p><b>Tiêu đề:</b> {post.title}</p>
                                <p><b>Người đăng:</b> {post.user.userName}</p>
                            </div>
                            <div className="modal-row">
                                <p><b>Giá:</b> {post.price.toLocaleString("vi-VN")} đ</p>
                                <p><b>Ngày đăng:</b> { formatDate(post.createdAt) }</p>
                                <p><b>Mô tả:</b> {post.description}</p>
                            </div>
                        </div>
                        <div className="modal-img">
                            <p><b>Hình ảnh:</b></p>
                            <div className="preview-images">
                                {post.postImages?.map((img, index) => (
                                    <img
                                        key={img.postImageId ?? index}
                                        src={`${baseURL}/uploads/${img.postImage1}`}
                                        alt={post.title}
                                        className="preview-image"
                                    />
                                ))}

                            </div>
                        </div>
                        <div className="modal-spec">
                            <p className="my-1"><b>Cấu hình:</b></p>
                            <div className="table-spec">
                                <table>
                                    <tbody>
                                        {post.postSpecificationsDto.map((ps, index) => {
                                            return (
                                                <tr key={index} className="spec-item">
                                                    <td className="spec-name">{ps.specName}</td>
                                                    <td className="spec-value">{ps.specValue}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={() => onReject(post.postId)}>Từ chối</button>
                        <button className="btn-accept" onClick={() => onApprove(post.postId)}>Duyệt</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PostPreviewModal;
