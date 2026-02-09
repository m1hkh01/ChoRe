import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import "./PostCard.css";

function PostCard({ post }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const renderPrice = () => {
        if (!post.priceType) {
            return <span className="price-text price-contact">Liên hệ</span>;
        }

        switch (post.priceType) {
            case "NEGOTIABLE":
                return <span className="price-text price-negotiable">Thương lượng</span>;
            case "FIXED":
                return (
                    <span className="price-text price-fixed">
                        {post.price ? post.price.toLocaleString('vi-VN') + " ₫" : "Liên hệ"}
                    </span>
                );
            case "RANGE":
                return (
                    <span className="price-text price-range">
                        {post.minPrice?.toLocaleString('vi-VN')} - {post.maxPrice?.toLocaleString('vi-VN')} ₫
                    </span>
                );
            default:
                return <span className="price-text price-contact">Liên hệ</span>;
        }
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="post-card-container">
            <Link to={`/posts/${post.postId}`} className="post-card">
                {/* Image Section */}
                <div className="post-card-image-wrapper">
                    <img
                        src={post.thumbnail ? `http://localhost:5121/uploads/${post.thumbnail}` : "/no-image.png"}
                        alt={post.title}
                        className="post-card-image"
                        loading="lazy"
                    />
                    
                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteClick}
                        className="favorite-btn"
                        aria-label="Add to favorites"
                    >
                        <FontAwesomeIcon 
                            icon={isFavorite ? faHeart : faHeartRegular} 
                            className={isFavorite ? "favorite-active" : ""}
                        />
                    </button>
                </div>

                {/* Content Section */}
                <div className="post-card-body">
                    {/* Title */}
                    <h3 className="post-title">{post.title}</h3>

                    {/* Price */}
                    <div className="post-price">
                        {renderPrice()}
                    </div>

                    {/* Description */}
                    {post.shortDescription && (
                        <p 
                            className="post-description"
                            dangerouslySetInnerHTML={{ __html: post.shortDescription }}
                        />
                    )}

                    {/* Footer Info */}
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