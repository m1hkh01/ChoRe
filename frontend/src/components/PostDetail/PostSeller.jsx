import { useState } from "react";
import api from "../../api";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";

function PostSeller({ user ,postId}) {
    const [showPhone, setShowPhone] = useState(false);
    const { user: buyer } = useAuthStore();
    const navigate = useNavigate();


    const CreateChat = async () => {
        try {            
            const res = await api.post("/api/chat", {
                buyerId: buyer.userId,
                sellerId: user.userId,
                postId: postId
            });
            console.log(res.data);
            navigate("/chat");
        }
        catch (error) {
            console.error("Lỗi tạo phòng chat:", error);
        }
    }

    return (
        <div className="card p-3">
            <h5 className="fw-bold mb-2">Người bán</h5>

            <div className="mb-2">
                <strong>{user.fullName}</strong>
            </div>
            <button onClick={CreateChat} className="w-auto h-auto py-1 mb-2  rounded-4 bg-green-600 text-white font-bold">
                Chat
            </button>
            {!showPhone ? (
                <button
                    className="w-auto h-auto py-1 mb-2  rounded-4 bg-green-600 text-white font-bold"
                    onClick={() => setShowPhone(true)}
                >
                    Hiện số điện thoại
                </button>
            ) : (
                <a
                    href={`tel:${user.phoneNumber}`}
                    className="btn btn-outline-success w-100"
                >
                    {user.phoneNumber}
                </a>
            )}
        </div>
    );
}

export default PostSeller;
