import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "@/api";
import "./SavePost.css";

function SavePost({ postId }) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    // check đã lưu hay chưa
    useEffect(() => {
        api.get(`/api/saved-posts/check/${postId}`)
            .then(res => setSaved(res.data.saved))
            .catch(() => {});
    }, [postId]);

    const handleToggleSave = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (saved) {
                await api.delete(`/api/saved-posts/${postId}`);
                setSaved(false);
            } else {
                await api.post(`/api/saved-posts/${postId}`);
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
