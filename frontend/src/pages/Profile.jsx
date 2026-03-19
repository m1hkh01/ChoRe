import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import api from "@/api";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfilePosts from "@/components/Profile/ProfilePosts";
import ProfileRatings from "@/components/Profile/ProfileRatings";
import ProfileComments from "@/components/Profile/ProfileComments";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import ProfileManagePosts from "@/components/Profile/ProfileManagePosts";
import "@/assets/Profile.css";

const TABS = [
    { key: "posts",    label: "Bài đăng"           },
    { key: "ratings",  label: "Đánh giá"            },
    { key: "comments", label: "Lịch sử bình luận"   },
    { key: "manage",   label: "Quản lý tin đăng"    },
];

export default function ProfilePage() {
    const { userId } = useParams();
    const { user: me } = useAuthStore();
    const navigate = useNavigate();

    const targetId = userId ? parseInt(userId) : me?.userId;
    const isOwner  = !userId || parseInt(userId) === me?.userId;

    const [profile,       setProfile]       = useState(null);
    const [activeTab,     setActiveTab]     = useState("posts");
    const [loading,       setLoading]       = useState(true);
    const [postsTotal,    setPostsTotal]    = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);

    // ── Load profile ──────────────────────────────────────────────────────

    const loadProfile = async () => {
        setLoading(true);
        try {
            // ✅ Route mới: /api/profile/users/{userId}
            const res = await api.get(`/api/profile/users/${targetId}`);
            setProfile(res.data);
        } catch {
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    // ── Load posts total (chỉ để hiển thị số đếm ở stats bar) ────────────

    const loadPostsTotal = async () => {
        try {
            // ✅ Route mới: /api/profile/users/{userId}/posts
            const res = await api.get(`/api/profile/users/${targetId}/posts`, {
                params: { page: 1, pageSize: 1 },
            });
            setPostsTotal(res.data.total ?? 0);
        } catch (err) {
            console.error("Load posts total error:", err);
        }
    };

    // ── Effects ───────────────────────────────────────────────────────────

    useEffect(() => {
        if (!targetId) { navigate("/login"); return; }
        loadProfile();
        loadPostsTotal();
    }, [targetId]);

    // ── Render ────────────────────────────────────────────────────────────

    if (loading) return (
        <div className="pf-loading">
            <div className="pf-spinner" />
        </div>
    );

    if (!profile) return null;

    return (
        <div className="pf-page">

            {/* ── Header ── */}
            <ProfileHeader
                profile={profile}
                isOwner={isOwner}
                onEditClick={() => setShowEditModal(true)}
                onAvatarUpdated={loadProfile}
            />

            {/* ── Stats Bar ── */}
            <div className="pf-stats">
                <div className="pf-stat">
                    <span className="pf-stat-val">{postsTotal}</span>
                    <span className="pf-stat-lbl">Bài đăng</span>
                </div>
                <div className="pf-stat-sep" />
                <div className="pf-stat">
                    <span className="pf-stat-val">
                        {profile.avgRating > 0 ? profile.avgRating : "—"}
                    </span>
                    <span className="pf-stat-lbl">Đánh giá TB</span>
                </div>
                <div className="pf-stat-sep" />
                <div className="pf-stat">
                    <span className="pf-stat-val">{profile.totalRatings}</span>
                    <span className="pf-stat-lbl">Lượt đánh giá</span>
                </div>
            </div>

            {/* ── Tabs Nav ── */}
            <div className="pf-tabs-bar">
                <div className="pf-tabs-inner">
                    {TABS
                        .filter(t => t.key !== "manage" || isOwner)
                        .map(t => (
                            <button
                                key={t.key}
                                className={`pf-tab${activeTab === t.key ? " pf-tab--active" : ""}`}
                                onClick={() => setActiveTab(t.key)}
                            >
                                {t.label}
                            </button>
                        ))
                    }
                </div>
            </div>

            {/* ── Tab Content ── */}
            <div className="pf-content">
                {activeTab === "posts"    && <ProfilePosts    userId={targetId} isOwner={isOwner} />}
                {activeTab === "ratings"  && <ProfileRatings  userId={targetId} />}
                {activeTab === "comments" && <ProfileComments userId={targetId} />}
                {activeTab === "manage"   && isOwner && <ProfileManagePosts userId={targetId} />}
            </div>

            {/* ── Edit Modal ── */}
            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onSaved={() => { setShowEditModal(false); loadProfile(); }}
                />
            )}
        </div>
    );
}