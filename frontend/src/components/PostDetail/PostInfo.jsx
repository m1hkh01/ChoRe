function PostInfo({ post }) {
    return (
        <div className="card p-3 mb-3">
            <h4 className="fw-bold">{post.title}</h4>

            <div className="text-danger fs-5 fw-bold mb-2">
                {post.price.toLocaleString()} đ
            </div>

            {/* BRAND */}
            {post.brand && (
                <div className="mb-2">
                    <strong>Hãng:</strong> {post.brand.brandName}
                </div>
            )}

            {/* CATEGORY */}
            <div className="mb-2">
                <strong>Danh mục:</strong>{" "}
                {post.categories.map(c => c.cateName).join(" / ")}
            </div>

            <div className="mb-2">
                <strong>Địa chỉ:</strong> {post.address}
            </div>

            <p className="mt-3">{post.description}</p>
        </div>
    );
}

export default PostInfo;
