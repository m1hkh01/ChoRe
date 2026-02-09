import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import "@/assets/PostDetailsDr.css";

function PostDetailsDr({ post }) {
    if (!post?.description) return null;

    return (
        <div className="post-details-card">
            {/* Header */}
            <div className="details-header">
                {/* <div className="details-icon">
                    <FontAwesomeIcon icon={faAlignLeft} />
                </div> */}
                <h2 className="details-title">Mô tả chi tiết</h2>
            </div>

            {/* Divider */}
            <div className="details-divider"></div>

            {/* Content */}
            <div
                className="details-content"
                dangerouslySetInnerHTML={{ __html: post.description }}
            />
        </div>
    );
}

export default PostDetailsDr;