function PostInfo({ post }) {
    return (
        <div className="post-info">
            <h4 className="fw-bold mb-2 fs-4">{post.title}</h4>

            <div className="text-danger fs-4 pd fw-bold mb-3">
                {post.price.toLocaleString()} đ
            </div>

            {post.brand && (
                <div className="mb-2">
                    <strong>Hãng:</strong> {post.brand.brandName}
                </div>
            )}

            <div className="mb-2">
                <strong>Danh mục:</strong>{" "}
                {post.categories.map(c => c.cateName).join(" / ")}
            </div>

            <div className="mb-2">
                <strong>Địa chỉ:</strong> {post.address}
            </div>
        </div>
    );
}

export default PostInfo;
