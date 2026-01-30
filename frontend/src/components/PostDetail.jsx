import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";

import PostImages from "@/components/PostDetail/PostImages";
import PostInfo from "@/components/PostDetail/PostInfo";
import PostSpecs from "@/components/PostDetail/PostSpecs";
import PostSeller from "@/components/PostDetail/PostSeller";
import PostComments from "@/components/PostDetail/PostComments";

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        api.get(`/api/posts/${id}`).then(res => {
            setPost(res.data);
        });
    }, [id]);

    if (!post) return <div className="text-center py-5">Đang tải...</div>;

    return (
        <div className="container my-4">
            <div className="row g-4">
                {/* LEFT */}
                <div className="col-md-7">
                    <PostImages images={post.images} />
                    <PostInfo post={post} />
                    <PostSpecs specs={post.specifications} />
                </div>

                {/* RIGHT */}
                <div className="col-md-5">
                    <PostSeller user={post.user} postId={post.postId} />
                    <PostComments postId={post.postId} />
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
