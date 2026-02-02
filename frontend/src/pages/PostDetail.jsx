import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import "@/assets/PostDetails.css";

import PostImages from "@/components/PostDetail/PostImages";
import PostInfo from "@/components/PostDetail/PostInfo";
import PostSpecs from "@/components/PostDetail/PostSpecs";
import PostSeller from "@/components/PostDetail/PostSeller";
import PostComments from "@/components/PostDetail/PostComments";
import PostDetailsDr from "@/components/PostDetail/PostDetailsDr";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
        <div className="post-detail-page py-3">
            <div className="container-lg post-detail-container">

                {/* ===== KHUNG TRÊN ===== */}
                <div className="bg-white rounded shadow-sm p-3 mb-3">
                    <div className="row g-3">

                        {/* IMAGES */}
                        <div className="col-md-6">
                            <PostImages images={post.images} />
                        </div>

                        {/* INFO + SELLER */}
                        <div className="col-md-6">
                            <PostInfo post={post} />
                            <PostSeller user={post.user} postId={post.postId} />
                        </div>

                    </div>
                </div>

                {/* ===== KHUNG DƯỚI ===== */}
                <div className="row g-4">

                    {/* LEFT */}
                    <div className="col-md-8">
                        <div className="bg-white rounded shadow-sm p-3 mb-4">
                            <PostDetailsDr post={post} />
                        </div>

                        <div className="bg-white rounded shadow-sm p-3">
                            <PostSpecs specs={post.specifications} />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-md-4">
                        <div className="bg-white rounded shadow-sm p-3">
                            <PostComments postId={post.postId} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PostDetail;
