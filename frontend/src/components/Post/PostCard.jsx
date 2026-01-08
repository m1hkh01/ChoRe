import { Link } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
    return (
        <div className="post-card h-100">
            <Link to={`/posts/${post.postId}`} className="text-decoration-none">

                {/* IMAGE */}
                <div className="post-thumb">
                    <img
                        src={
                            post.thumbnail
                                ? `http://localhost:5121/uploads/${post.thumbnail}`
                                : "/no-image.png"
                        }
                        alt={post.title}
                    />
                </div>

                {/* BODY */}
                <div className="post-body">
                    <h6 className="post-title" title={post.title}>
                        {post.title}
                    </h6>

                    <p className="post-desc">
                        {post.shortDescription}
                    </p>

                    <div className="post-meta">
                        <span className="price">
                            {post.price.toLocaleString()} ₫
                        </span>
                        <span className="address">
                            {post.address}
                        </span>
                    </div>

                    <div className="post-user">
                        👤 {post.userName}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PostCard;
