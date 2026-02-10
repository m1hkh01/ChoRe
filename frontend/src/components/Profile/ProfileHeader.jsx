import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCamera, faPen,
    faMapMarkerAlt, faCalendarAlt,
    faEnvelope, faPhone,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

export default function ProfileHeader({ profile, isOwner, onEditClick, onAvatarUpdated }) {
    const fileRef       = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleAvatar = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const form = new FormData();
        form.append("file", file);
        setUploading(true);
        try {
            await api.post("/api/profile/me/avatar", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onAvatarUpdated();
        } catch (err) {
            alert(err.response?.data || "Không thể cập nhật ảnh");
        } finally {
            setUploading(false);
        }
    };

    const avatarSrc = profile.avatar
        ? `http://localhost:5121/uploads/${profile.avatar}`
        : "/default-avatar.png";

    const joinDate = new Date(profile.createAt).toLocaleDateString("vi-VN", {
        month: "long", year: "numeric",
    });

    return (
        <div className="pf-header">
            {/* Cover */}
            <div className="pf-cover">
                <div className="pf-cover-shine" />
            </div>

            {/* Identity row */}
            <div className="pf-identity">
                {/* Avatar */}
                <div className="pf-avatar-wrap">
                    <img
                        src={avatarSrc}
                        alt={profile.fullName}
                        className={`pf-avatar-img ${uploading ? "pf-avatar-loading" : ""}`}
                    />
                    {isOwner && (
                        <>
                            <button
                                className="pf-avatar-cam"
                                onClick={() => fileRef.current?.click()}
                                title="Đổi ảnh đại diện"
                            >
                                <FontAwesomeIcon icon={faCamera} />
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatar}
                            />
                        </>
                    )}
                </div>

                {/* Info */}
                <div className="pf-identity-info">
                    <div className="pf-name-row">
                        <h1 className="pf-fullname">{profile.fullName}</h1>
                        <span className="pf-username">@{profile.userName}</span>
                    </div>

                    <div className="pf-meta">
                        {profile.address && (
                            <span className="pf-meta-item">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                {profile.address}
                            </span>
                        )}
                        <span className="pf-meta-item">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            Tham gia {joinDate}
                        </span>
                        {isOwner && profile.email && (
                            <span className="pf-meta-item">
                                <FontAwesomeIcon icon={faEnvelope} />
                                {profile.email}
                            </span>
                        )}
                        {isOwner && profile.phoneNumber && (
                            <span className="pf-meta-item">
                                <FontAwesomeIcon icon={faPhone} />
                                {profile.phoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Edit button */}
                {isOwner && (
                    <button className="pf-edit-btn" onClick={onEditClick}>
                        <FontAwesomeIcon icon={faPen} />
                        <span>Chỉnh sửa</span>
                    </button>
                )}
            </div>
        </div>
    );
}