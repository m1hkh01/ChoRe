function PostInfo({ post }) {
    // ✅ Hàm render giá theo kiểu
    const renderPrice = () => {
        if (!post.priceType) {
            return <div className="text-muted fs-5 fw-semibold mb-3">Liên hệ</div>;
        }

        switch (post.priceType) {
            case "NEGOTIABLE":
                return (
                    <div className="mb-3">
                        <div className="text-warning fs-4 fw-bold">
                            Giá thương lượng
                        </div>
                        <small className="text-muted">Liên hệ người bán để thỏa thuận giá</small>
                    </div>
                );
            
            case "FIXED":
                return (
                    <div className="mb-3">
                        <div className="text-danger fs-4 fw-bold">
                            {post.price?.toLocaleString('vi-VN')} đ
                        </div>
                        <small className="text-muted">Giá cố định</small>
                    </div>
                );
            
            case "RANGE":
                return (
                    <div className="mb-3">
                        <div className="text-primary fs-4 fw-bold">
                            {post.minPrice?.toLocaleString('vi-VN')} đ
                            <span className="mx-2">-</span>
                            {post.maxPrice?.toLocaleString('vi-VN')} đ
                        </div>
                        <small className="text-muted">Khoảng giá có thể thương lượng</small>
                    </div>
                );
            
            default:
                return <div className="text-muted fs-5 fw-semibold mb-3">Liên hệ</div>;
        }
    };

    return (
        <div className="post-info">
            <h4 className="fw-bold mb-3 fs-4">{post.title}</h4>

            {/* ✅ Hiển thị giá theo kiểu */}
            {renderPrice()}

            {post.brand && (
                <div className="mb-2">
                    <strong>Hãng:</strong> {post.brand.brandName}
                </div>
            )}

            <div className="mb-2">
                <strong>Danh mục:</strong>{" "}
                {post.categories?.map(c => c.cateName).join(" / ") || "Chưa phân loại"}
            </div>

            <div className="mb-2">
                <strong>Địa chỉ:</strong> {post.address}
            </div>
        </div>
    );
}

export default PostInfo;