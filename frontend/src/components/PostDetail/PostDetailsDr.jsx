function PostDetailsDr({ post }) {
    return (
        <div className="post-description">
            <h5 className="fw-bold mb-2">Mô tả chi tiết</h5>

            <div
                className="text-secondary"
                style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
            >
                {post.description}
            </div>
        </div>
    );
}

export default PostDetailsDr;
