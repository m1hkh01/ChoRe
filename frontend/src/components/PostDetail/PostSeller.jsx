import { useState } from "react";
import api from "@/api";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";

function PostSeller({ user, postId }) {
     console.log("PostSeller user:", user);
    const [showPhone, setShowPhone] = useState(false);
    const { user: buyer } = useAuthStore();
    const navigate = useNavigate();

    const CreateChat = async () => {
        try {
            await api.post("/api/chat", {
                buyerId: buyer.userId,
                sellerId: user.userId,
                postId: postId
            });
            navigate("/chat");
        } catch (error) {
            console.error("Lỗi tạo phòng chat:", error);
        }
    };

    const maskPhone = (phone) => {
        if (!phone) return "";
        return phone.slice(0, 5) + "*".repeat(phone.length - 5);
    };

    return (
        <div className="mt-3">
            {/* LABEL */}
            <div className="fw-bold mb-2">Người bán</div>

            {/* AVATAR + NAME */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <img
                    src={
                        user.avatar
                            ? `http://localhost:5121/uploads/${user.avatar}`
                            : "/default-avatar.png"
                    }
                    alt="avatar"
                    width={42}
                    height={42}
                    className="rounded-circle object-fit-cover"
                />

                <span className="fw-semibold" style={{ fontSize: "14px" }}>
                    {user.fullName}
                </span>
            </div>

            {/* ACTIONS */}
            <div className="d-flex gap-2">
                <button
                    type="button"
                    onClick={CreateChat}
                    className="flex-fill py-2 rounded border-0 fw-bold text-white"
                    style={{ backgroundColor: "#22c55e" }}
                >
                    Chat
                </button>

                {!showPhone ? (
                    <button
                        className="flex-fill py-2 rounded bg-light border fw-semibold"
                        onClick={() => setShowPhone(true)}
                    >
                        {maskPhone(user.phoneNumber)}
                    </button>
                ) : (
                    <a
                        href={`tel:${user.phoneNumber}`}
                        className="flex-fill py-2 rounded btn btn-outline-success fw-semibold d-flex align-items-center justify-content-center"
                    >
                        {user.phoneNumber}
                    </a>
                )}
            </div>
        </div>
    );
}

export default PostSeller;
