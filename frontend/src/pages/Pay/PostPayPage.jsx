import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import Pay from "./Pay";
import { Toast } from "../../utils/toast";
// import { icon } from "@fortawesome/fontawesome-svg-core";

export default function PostPayPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(
                    `/api/posts/pay/${Number(postId)}`
                );
                setPost(res.data);
            } catch (err) {
                console.error("Error: ", err);
                Toast({
                    icon: 'error',
                    title: err.response.data ?? "Không tìm thấy bài đăng cần thanh toán"
                });
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [postId]);

    if (loading) return <div className="p-6">Đang tải...</div>;
    if (!post) return null;

    return (
        <Pay
            post={post}
            orderCode={post.orderCode}
            paymentType="Post"
            onClose={() => navigate(-1)}
        />
    );
}
