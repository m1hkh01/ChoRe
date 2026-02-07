import { Link } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
    // ✅ Hàm hiển thị giá theo kiểu
    const renderPrice = () => {
        if (!post.priceType) {
            return <span className="price text-muted">Liên hệ</span>;
        }

        switch (post.priceType) {
            case "NEGOTIABLE":
                return (
                    <span className="price" style={{ color: "#ff9800" }}>
                        Thương lượng
                    </span>
                );

            case "FIXED":
                return (
                    <span className="price">
                        {post.price ? post.price.toLocaleString('vi-VN') + " ₫" : "Liên hệ"}
                    </span>
                );

            case "RANGE":
                return (
                    <span className="price" style={{ color: "#2196f3" }}>
                        {post.minPrice?.toLocaleString('vi-VN')} ₫ - {post.maxPrice?.toLocaleString('vi-VN')} ₫
                    </span>
                );

            default:
                return <span className="price text-muted">Liên hệ</span>;
        }
    };

    return (
        <div className="post-card h-100">
            <Link to={`/posts/${post.postId}`} className="text-decoration-none">

                {/* IMAGE */}
                <div className="post-thumb">
                    <img
                        src={
                            post.thumbnail
                                ? `http://localhost:5121/uploads/${post.thumbnail}`
                                : "/no-image.png"
                        }
                        alt={post.title}
                    />
                </div>

                {/* BODY */}
                <div className="post-body">
                    <h6 className="post-title" title={post.title}>
                        {post.title}
                    </h6>

                    {/* CKEDITOR PREVIEW (SHORT) */}
                    <div
                        className="post-desc ckeditor-preview"
                        dangerouslySetInnerHTML={{
                            __html: post.shortDescription + "..."
                        }}
                    />

                    <div className="post-meta">
                        {/* ✅ SỬA DỤNG HÀM RENDER AN TOÀN */}
                        {renderPrice()}

                        <span className="address">
                            {post.address}
                        </span>
                    </div>

                    <div className="post-user">
                        👤 {post.userName}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PostCard;