import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import "./PostCard.css";

const STATUS_LABEL = {
    1: "Chờ duyệt",
    2: "Đang hiển thị",
    3: "Từ chối",
    4: "Đang bán",
    5: "Đã bán",
    6: "Đã ẩn",
};

function PostCard({ post }) {

    const postId = post.postId;

    const [isFavorite, setIsFavorite] = useState(false);

    // ✅ Load trạng thái favorite khi component mount
    useEffect(() => {

        const favorites =
            JSON.parse(localStorage.getItem("favorites")) || [];

        const exists = favorites.some(p => p.postId === postId);

        setIsFavorite(exists);

    }, [postId]);


    const renderPrice = () => {

        switch (post.priceType) {

            case "NEGOTIABLE":
                return <span className="price-text price-negotiable">Thương lượng</span>;

            case "FIXED":
                return (
                    <span className="price-text price-fixed">
                        {post.price
                            ? post.price.toLocaleString("vi-VN") + " ₫"
                            : "Liên hệ"}
                    </span>
                );

            case "RANGE":
                return (
                    <span className="price-text price-range">
                        {post.minPrice?.toLocaleString("vi-VN")} -{" "}
                        {post.maxPrice?.toLocaleString("vi-VN")} ₫
                    </span>
                );

            default:
                return <span className="price-text price-contact">Liên hệ</span>;
        }

    };


    // ❤️ CLICK FAVORITE
    const handleFavoriteClick = (e) => {

        e.preventDefault();
        e.stopPropagation();

        let favorites =
            JSON.parse(localStorage.getItem("favorites")) || [];

        const exists = favorites.find(p => p.postId === postId);

        if (exists) {

            // remove
            favorites = favorites.filter(p => p.postId !== postId);

            setIsFavorite(false);

        } else {

            // add
            favorites.unshift(post);

            setIsFavorite(true);

        }

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        // optional: emit event để sync trang khác
        window.dispatchEvent(new Event("favoritesUpdated"));

    };


    return (

        <div className="post-card-container">

            <Link to={`/posts/${post.postId}`} className="post-card">

                {/* IMAGE */}
                <div className="post-card-image-wrapper">

                    <img
                        src={
                            post.thumbnail
                                ? `http://localhost:5121/uploads/${post.thumbnail}`
                                : "/no-image.png"
                        }
                        alt={post.title}
                        className="post-card-image"
                        loading="lazy"
                    />

                    {/* STATUS */}
                    {post.postStatusId && (

                        <span className={`post-status status-${post.postStatusId}`}>

                            {STATUS_LABEL[post.postStatusId]}

                        </span>

                    )}

                    {/* FAVORITE */}
                    <button
                        onClick={handleFavoriteClick}
                        className="favorite-btn"
                    >

                        <FontAwesomeIcon
                            icon={isFavorite ? faHeart : faHeartRegular}
                            className={isFavorite ? "favorite-active" : ""}
                        />

                    </button>

                </div>


                {/* BODY */}
                <div className="post-card-body">

                    <h3 className="post-title">{post.title}</h3>

                    <div className="post-price">
                        {renderPrice()}
                    </div>

                    {post.shortDescription && (

                        <p
                            className="post-description"
                            dangerouslySetInnerHTML={{
                                __html: post.shortDescription,
                            }}
                        />

                    )}

                    <div className="post-footer">

                        {post.address && (

                            <div className="post-info">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                <span>{post.address}</span>
                            </div>

                        )}

                        {post.userName && (

                            <div className="post-info">
                                <FontAwesomeIcon icon={faUser} />
                                <span>{post.userName}</span>
                            </div>

                        )}

                    </div>

                </div>

            </Link>

        </div>

    );

}

export default PostCard;