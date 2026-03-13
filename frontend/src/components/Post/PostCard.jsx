import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useAuthStore } from "@/store/auth";
import { useState, useEffect } from "react";
import "./PostCard.css";
import api from "../../api";
import { Toast } from "../../utils/toast";
import { faEye } from "@fortawesome/free-solid-svg-icons";


const STATUS_LABEL = {
    1: "Chờ duyệt",
    2: "Đã duyệt",
    3: "Bị từ chối",
    4: "Đang bán",
    5: "Đã bán",
    6: "Đã ẩn"
};

function PostCard({ post }) {

    const { user } = useAuthStore();

    const postId = post.postId;

    const [isFavorite, setIsFavorite] = useState(false);

    // ✅ Load trạng thái favorite khi component mount
    useEffect(() => {

        if (!user) {
            setIsFavorite(false);
            return;
        }

        //const favorites =
        // JSON.parse(localStorage.getItem(`favorites_${user.userId}`)) || [];

        const exists = post.isSaved || false;
        console.log(`Post ${postId} isSaved:`, post);
        setIsFavorite(exists);

    }, [postId, user]);


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
    const handleFavoriteClick = async (e) => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm yêu thích");
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let favorites =
            JSON.parse(localStorage.getItem(`favorites_${user.userId}`)) || [];

        const exists = favorites.includes(postId);
        if (isFavorite) {
            try {
                const res = await api.delete(`api/save-posts/${postId}`);
                Toast.fire({
                    icon: "success",
                    title: res.data?.message || "Đã xóa khỏi yêu thích!"
                });
                setIsFavorite(false);
                favorites = favorites.filter(id => id !== postId);
            } catch (error) {
                console.error("Error removing favorite:", error);
                Toast.fire({
                    icon: "error",
                    title: "Lỗi khi xóa khỏi yêu thích!"
                });
                return;
            }
        } else {
            try {
                const res = await api.post("api/save-posts", { PostId: postId });
                Toast.fire({
                    icon: "success",
                    title: res.data?.message || "Đã thêm vào yêu thích!"
                });
                favorites.unshift(postId);
                setIsFavorite(true);
            } catch (error) {
                console.error("Error adding favorite:", error);
                Toast.fire({
                    icon: "error",
                    title: "Lỗi khi thêm vào yêu thích!"
                });
                return;
            }
        }

        localStorage.setItem(
            `favorites_${user.userId}`,
            JSON.stringify(favorites)
        );

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
                                ? `https://api.chore123.cloud/uploads/${post.thumbnail}`
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

                        <div className="post-bottom">

                            {post.userName && (
                                <div className="post-info">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>{post.userName}</span>
                                </div>
                            )}

                            <div className="post-info">
                                <FontAwesomeIcon icon={faEye} />
                                <span>{post.viewCount || 0}</span>
                            </div>

                        </div>

                    </div>

                </div>

            </Link>

        </div>

    );

}

export default PostCard;