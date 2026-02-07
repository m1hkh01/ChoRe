    import { Link } from "react-router-dom";
    import "./PostCard.css";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faMapMarkerAlt, faStore } from "@fortawesome/free-solid-svg-icons";

    function PostCard({ post }) {
        // ✅ Hàm hiển thị giá theo kiểu
        const renderPrice = () => {
            if (!post.priceType) {
                return <span className="card-price">Liên hệ</span>;
            }

            switch (post.priceType) {
                case "NEGOTIABLE":
                    return (
                        <span className="card-price negotiable">
                            Thương lượng
                        </span>
                    );

                case "FIXED":
                    return (
                        <span className="card-price fixed">
                            {post.price ? post.price.toLocaleString('vi-VN') + " ₫" : "Liên hệ"}
                        </span>
                    );

                case "RANGE":
                    return (
                        <span className="card-price range">
                            {post.minPrice?.toLocaleString('vi-VN')} - {post.maxPrice?.toLocaleString('vi-VN')} ₫
                        </span>
                    );

                default:
                    return <span className="card-price">Liên hệ</span>;
            }
        };

        return (
            <Link to={`/posts/${post.postId}`} className="post-card-link">
                <div className="post-card">
                    {/* THUMBNAIL */}
                    <div className="card-image-wrapper">
                        <img
                            src={
                                post.thumbnail
                                    ? `http://localhost:5121/uploads/${post.thumbnail}`
                                    : "/no-image.png"
                            }
                            alt={post.title}
                            className="card-image"
                        />
                        <div className="card-overlay"></div>
                    </div>

                    {/* CONTENT */}
                    <div className="card-content">
                        {/* TITLE */}
                        <h3 className="card-title" title={post.title}>
                            {post.title}
                        </h3>

                        {/* PRICE - HIGHLIGHT */}
                        <div className="card-price-section">
                            {renderPrice()}
                        </div>

                        {/* DESCRIPTION */}
                        <div
                            className="card-desc"
                            dangerouslySetInnerHTML={{
                                __html: post.shortDescription
                            }}
                        />

                        {/* FOOTER */}
                        <div className="card-footer">
                            {/* ADDRESS */}
                            <div className="card-address">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-small" />
                                <span>{post.address}</span>
                            </div>

                            {/* SELLER */}
                            <div className="card-seller">
                                <FontAwesomeIcon icon={faStore} className="icon-small" />
                                <span>{post.userName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    export default PostCard;