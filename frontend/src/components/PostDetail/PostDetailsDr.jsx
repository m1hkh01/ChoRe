import "@/assets/ckeditor-custom.css";

function PostDetailsDr({ post }) {
    if (!post?.description) return null;

    return (
        <div className="post-description">
            <h5 className="fw-bold mb-2">Mô tả chi tiết</h5>

            <div
                className="ckeditor-preview"
                dangerouslySetInnerHTML={{ __html: post.description }}
            />
        </div>
    );
}

export default PostDetailsDr;
