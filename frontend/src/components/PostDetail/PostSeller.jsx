import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faComment, faPhone, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "@/api";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import "@/assets/PostSeller.css";
import { Link } from "react-router-dom";

function PostSeller({ user, postId }) {
    const [showPhone, setShowPhone] = useState(false);
    const { user: buyer } = useAuthStore();
    const navigate = useNavigate();

    const CreateChat = async () => {
        if (!buyer) {
            navigate("/login");
            return;
        }

        try {
            await api.post("/api/chat", {
                buyerId: buyer.userId,
                sellerId: user.userId,
                postId: postId
            });
            navigate("/chat");
        } catch (error) {
            console.error("Lỗi tạo phòng chat:", error);
            alert("Không thể tạo cuộc trò chuyện");
        }
    };

    const maskPhone = (phone) => {
        if (!phone) return "";
        const visiblePart = phone.slice(0, 4);
        const maskedPart = "*".repeat(phone.length - 4);
        return visiblePart + maskedPart;
    };

    return (
        <div className="seller-card" style={{marginTop: 10}}>
            {/* Header */}
            <div className="seller-header">
                {/* <div className="seller-icon">
                    <FontAwesomeIcon icon={faUser} />
                </div> */}
                <h3 className="seller-title">Thông tin người bán</h3>
            </div>

            <div className="seller-divider"></div>

            {/* Seller Info */}
            <Link 
    to={`/profile/${user.userId}`} 
    className="seller-info"
    style={{ textDecoration: "none", color: "inherit" }}
>
    <div className="seller-avatar">
        {user.avatar ? (
            <img
                src={`https://api.chore123.cloud/uploads/${user.avatar}`}
                alt={user.fullName}
            />
        ) : (
            <FontAwesomeIcon icon={faUser} />
        )}
    </div>
    <div className="seller-details">
        <div className="seller-name">{user.fullName}</div>
        <div className="seller-status">Người bán</div>
    </div>
</Link>
            {/* Actions */}
            <div className="seller-actions">
                <button className="action-btn action-btn-primary" onClick={CreateChat}>
                    <FontAwesomeIcon icon={faComment} />
                    <span>Chat ngay</span>
                </button>

                {!showPhone ? (
                    <button
                        className="action-btn action-btn-secondary"
                        onClick={() => setShowPhone(true)}
                    >
                        <FontAwesomeIcon icon={faEye} />
                        <span>{maskPhone(user.phoneNumber)}</span>
                    </button>
                ) : (
                    <a
                        href={`tel:${user.phoneNumber}`}
                        className="action-btn action-btn-phone"
                    >
                        <FontAwesomeIcon icon={faPhone} />
                        <span>{user.phoneNumber}</span>
                    </a>
                )}

            </div>
        </div>
    );
}

export default PostSeller;