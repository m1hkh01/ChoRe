import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "@/api";
import "./SavePost.css";

function SavePost({ postId }) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    // check đã lưu hay chưa
    useEffect(() => {
        api.get(`/api/save-posts/check/${postId}`)
            .then(res => setSaved(res.data.isSaved))
            .catch(() => {});
    }, [postId]);

    const handleToggleSave = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (saved) {
                await api.delete(`/api/save-posts/${postId}`);
                setSaved(false);
            } else {
                await api.post(`/api/save-posts`, { PostId: postId });
                setSaved(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`save-btn ${saved ? "saved" : ""}`}
            onClick={handleToggleSave}
        >
            <Heart size={18} />
            <span>{saved ? "Đã lưu" : "Lưu"}</span>
        </button>
    );
}

export default SavePost;
