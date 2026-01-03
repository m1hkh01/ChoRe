import "@/assets/censor.css";
import { useEffect, useState } from "react";
import api from "@/api";
import PostPreviewModal from "@/components/CensorComponents/PostPreviewModal";

function PostCensor() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            const res = await api.get("/censor-posts");
            setPosts(res.data);
        }
        fetchPosts();
    }, []);

    const approvePost = async (id) => {
        await api.post(`/api/censor/posts/${id}/accept`);
        setPosts(prev => prev.filter(p => p.postId !== id));
        setSelectedPost(null);
    };

    const rejectPost = async (id, reason) => {
        await api.post(
            `/api/censor/posts/${id}/reject`,
            {
                rejectReason: reason
            }
        );

        setPosts(prev => prev.filter(p => p.postId !== id));
        setSelectedPost(null);
    };

    return (
        <div className="post-container">
            <h3>Danh sách bài viết cần kiểm duyệt</h3>

            {posts.length === 0 && (
                <p>Không có bài viết cần duyệt</p>
            )}

            {posts.map(post => (
                <div key={post.postId} className="post-row">
                    <span>{post.title}</span>
                    <button onClick={() => setSelectedPost(post)}>
                        Xem
                    </button>
                </div>
            ))}

            {selectedPost && (
                <PostPreviewModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onApprove={approvePost}
                    onReject={rejectPost}
                />
            )}
        </div>
    );
}

export default PostCensor;
