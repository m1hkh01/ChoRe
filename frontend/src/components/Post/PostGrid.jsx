import PostCard from "./PostCard";

function PostGrid({ posts }) {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                Không tìm thấy sản phẩm nào phù hợp
            </div>
        );
    }

    return (
        <div className="row g-4">
            {posts.map(post => (
                <div
                    key={post.postId}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                    <PostCard post={post} />
                </div>
            ))}
        </div>
    );
}

export default PostGrid;
