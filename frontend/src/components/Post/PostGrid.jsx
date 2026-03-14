import PostCard from "./PostCard";
import "./PostGrid.css";

function PostGrid({ posts }) {
    if (!posts || posts.length === 0) {
        return (
            <div className="post-grid-empty">
                <span className="post-grid-empty-icon">🔍</span>
                <p>Không tìm thấy sản phẩm nào phù hợp</p>
            </div>
        );
    }

    return (
        <div className="post-grid">
            {posts.map(post => (
                <PostCard key={post.postId} post={post} />
            ))}
        </div>
    );
}

export default PostGrid;