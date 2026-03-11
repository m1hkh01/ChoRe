import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import "./FavoriteItem.css";

function FavoriteItem({ post, onRemove }) {

    const isInactive =
        post.postStatusId === 5 ||   // Đã bán
        post.postStatusId === 6;


    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(post.postId);
    };

    // format giá
    const renderPrice = () => {

        if (post.priceType === "NEGOTIABLE")
            return "Thương lượng";

        if (post.priceType === "FIXED")
            return post.price?.toLocaleString("vi-VN") + " đ";

        if (post.priceType === "RANGE")
            return `${post.minPrice?.toLocaleString("vi-VN")} - ${post.maxPrice?.toLocaleString("vi-VN")} đ`;

        return "Liên hệ";
    };

    // format trạng thái
    const renderStatus = () => {
        if (post.postStatusId === 5) {
            return (
                <div className="favorite-status sold">
                    Sản phẩm đã được bán
                </div>
            );
        }

        if (post.postStatusId === 6) {
            return (
                <div className="favorite-status hidden">
                    Tin đăng đã bị ẩn
                </div>
            );
        }

        return null;
    };

    // format thời gian giống Chợ Tốt
    const formatDate = (dateString) => {

        if (!dateString) return "";

        const date = new Date(dateString);
        const now = new Date();

        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60)
            return `${diffMinutes || 1} phút trước`;

        if (diffHours < 24)
            return `${diffHours} giờ trước`;

        if (diffDays === 1)
            return "Hôm qua";

        if (diffDays <= 7)
            return `${diffDays} ngày trước`;

        return date.toLocaleDateString("vi-VN");
    };

    return (

        <Link
            to={isInactive ? "#" : `/posts/${post.postId}`}
            onClick={(e) => {
                if (isInactive) e.preventDefault();
            }}
            className={`favorite-item ${isInactive ? "inactive" : ""}`}
        >

            {/* IMAGE */}
            <img
                src={
                    post.thumbnail
                        ? `https://api.chore123.cloud/uploads/${post.thumbnail}`
                        : "/no-image.png"
                }
                className="favorite-image"
            />

            {/* INFO */}
            <div className="favorite-info">

                {/* TITLE */}
                <div className="favorite-title">
                    {post.title}
                </div>

                {/* PRICE */}
                {!isInactive && (
                    <>
                        <div className="favorite-price">
                            {renderPrice()}
                        </div>

                        <div className="favorite-meta">

                            {post.userName && (
                                <span>{post.userName}</span>
                            )}

                            {post.createdAt && (
                                <>
                                    {post.userName && " • "}
                                    <span>{formatDate(post.createdAt)}</span>
                                </>
                            )}

                            {post.address && (
                                <>
                                    {(post.userName || post.createdAt) && " • "}
                                    <span>{post.address}</span>
                                </>
                            )}

                        </div>
                    </>
                )}

                {/* STATUS */}
                {isInactive && renderStatus()}

            </div>

            {/* ACTIONS */}
            <div className="favorite-actions">

                <button
                    className="chat-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // mở trang chat giống Header
                        window.location.href = `/chat?postId=${post.postId}&userId=${post.userId}`;
                    }}
                >
                    Chat
                </button>

                <button
                    className="heart-btn active"
                    onClick={handleRemove}
                >
                    <FontAwesomeIcon icon={faHeart} />
                </button>

            </div>

        </Link>

    );
}

export default FavoriteItem;