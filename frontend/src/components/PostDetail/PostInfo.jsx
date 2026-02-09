import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faBuilding, faLayerGroup, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "@/assets/PostInfo.css";

function PostInfo({ post }) {
    const renderPrice = () => {
        if (!post.priceType) {
            return (
                <div className="price-section">
                    <div className="price-value price-contact">Liên hệ</div>
                </div>
            );
        }

        switch (post.priceType) {
            case "NEGOTIABLE":
                return (
                    <div className="price-section">
                        <div className="price-value price-negotiable">Giá thương lượng</div>
                        <div className="price-label">Liên hệ người bán để thỏa thuận</div>
                    </div>
                );
            
            case "FIXED":
                return (
                    <div className="price-section">
                        <div className="price-value price-fixed">
                            {post.price?.toLocaleString('vi-VN')} ₫
                        </div>
                        <div className="price-label">Giá cố định</div>
                    </div>
                );
            
            case "RANGE":
                return (
                    <div className="price-section">
                        <div className="price-value price-range">
                            {post.minPrice?.toLocaleString('vi-VN')} ₫ - {post.maxPrice?.toLocaleString('vi-VN')} ₫
                        </div>
                        <div className="price-label">Khoảng giá có thể thương lượng</div>
                    </div>
                );
            
            default:
                return (
                    <div className="price-section">
                        <div className="price-value price-contact">Liên hệ</div>
                    </div>
                );
        }
    };

    return (
        <div className="post-info-card">
            {/* Title */}
            <h1 className="post-info-title">{post.title}</h1>

            {/* Price Section */}
            {renderPrice()}

            {/* Divider */}
            <div className="info-divider"></div>

            {/* Info List */}
            <div className="info-list">
                {post.brand && (
                    <div className="info-item">
                        {/* <div className="info-icon">
                            <FontAwesomeIcon icon={faBuilding} />
                        </div> */}
                        <div className="info-content">
                            <span className="info-label">Thương hiệu</span>
                            <span className="info-value">{post.brand.brandName}</span>
                        </div>
                    </div>
                )}

                <div className="info-item">
                    {/* <div className="info-icon">
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </div> */}
                    <div className="info-content">
                        <span className="info-label">Danh mục</span>
                        <span className="info-value">
                            {post.categories?.map(c => c.cateName).join(" / ") || "Chưa phân loại"}
                        </span>
                    </div>
                </div>

                <div className="info-item">
                    {/* <div className="info-icon">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div> */}
                    <div className="info-content">
                        <span className="info-label">Địa chỉ</span>
                        <span className="info-value">{post.address}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostInfo;