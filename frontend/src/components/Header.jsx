import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown, faSearch, faMobileScreen, faAngleRight,
    faList, faBars, faTimes, faPlus, faChevronRight,
    faLayerGroup, faShieldHalved, faRightFromBracket,
    faUser, faCreditCard, faClockRotateLeft, faGauge
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faBell, faHeart, faBookmark } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import "@/assets/Header.css";
import useFetch from "../Hooks/useFetch";
import { useSignalR } from "../signalr/SignalRContext";
import api from "../api";
import ReviewForm from "./Review/ReviewForm";

const CATEGORIES = [
    { label: "Điện thoại", icon: "" },
    { label: "Laptop", icon: "" },
    { label: "Bàn phím", icon: "" },
    { label: "PC, Màn hình", icon: "" },
    { label: "Âm thanh, mic thu âm", icon: "" },
    { label: "Phụ kiện", icon: "" },
    { label: "Đồng hồ thông minh", icon: "" },
];

function Header() {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { data, loading, error } = useFetch(`/api/notifications/${user?.userId || 0}`);
    const [notificationsData, setNotificationData] = useState([]);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const [filterType, setFilterType] = useState("All");
    const [reviewChatRoomId, setReviewChatRoomId] = useState(null);
    const connectionRef = useSignalR();
    const isSearchPage = location.pathname === "/search";

    useEffect(() => { if (data) setNotificationData(data); }, [data]);

    useEffect(() => {
        if (!connectionRef?.current) return;
        const connection = connectionRef.current;
        const handler = (notification) => {
            setNotificationData(prev => {
                if (prev.some(n => n.id === notification.id)) return prev;
                return [notification, ...prev];
            });
        };
        connection.off("ReceiveNotification");
        connection.on("ReceiveNotification", handler);
        return () => { connection.off("ReceiveNotification", handler); };
    }, [connectionRef?.current]);

    useEffect(() => {
        if (isSearchPage) setSearchKeyword(searchParams.get("keyword") || "");
    }, [isSearchPage]);

    const handleCreatePost = () => {
        if (!user) navigate("/login", { state: { redirectTo: "/post/create" } });
        else navigate("/post/create");
    };

    const doSearch = () => {
        const q = searchKeyword.trim();
        if (isSearchPage) setSearchParams(q ? { keyword: q } : {});
        else navigate(q ? `/search?keyword=${encodeURIComponent(q)}` : "/search");
    };

    const handleKeyDown = (e) => { if (e.key === "Enter") doSearch(); };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
            if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotificationOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") { setOpen(false); setMobileMenuOpen(false); setNotificationOpen(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleLogout = async () => {
        try { await api.post("/account/revoke-token"); } catch (err) { console.log("Error revoking token:", err); }
        logout();
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const renderDashboardLink = () => {
        if (!user) return null;
        if (user.role === "Admin") return (
            <Link to="/admin/post-manager" className="hdr-profile-item" onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}>
                <FontAwesomeIcon icon={faGauge} className="hdr-profile-item-icon" />
                Trang quản trị Admin
            </Link>
        );
        if (user.role === "Censor") return (
            <Link to="/censor/post-censor" className="hdr-profile-item" onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}>
                <FontAwesomeIcon icon={faShieldHalved} className="hdr-profile-item-icon" />
                Trang kiểm duyệt
            </Link>
        );
        return null;
    };

    const handleNotificationClick = async (notification) => {
        await api.post(`/api/notifications/${notification.id}/read`);
        setNotificationOpen(false);
        setNotificationData(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
        switch (notification.type) {
            case "Transaction":
            case "PendingPayment": navigate(`/pay/transaction/${notification.relatedId}`); break;
            case "PendingPaymentPackage": navigate(`/pay/package/${notification.relatedId}`); break;
            case "PostApproved":
            case "PostRejected": navigate(`/profile`); break;
            case "Confirming":
            case "AwaitingEvidence": navigate(`/user-transactions`); break;
            case "ReviewReminder": setReviewChatRoomId(notification.relatedId); break;
            default: navigate("/"); break;
        }
    };

    const filteredNotifications = notificationsData?.filter(n => {
        if (filterType === "All") return true;
        if (filterType === "Post") return ["PostApproved", "PostRejected"].includes(n.type);
        if (filterType === "Transaction") return ["Transaction", "PendingPayment", "PaymentReceived", "AwaitingEvidence"].includes(n.type);
        return true;
    });

    const formatNotificationDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMinutes < 60) return `${diffMinutes || 1} phút`;
        if (diffHours < 24) return `${diffHours} giờ`;
        if (diffDays === 1) return "Hôm qua";
        if (diffDays <= 3) return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
        if (diffDays <= 30) return `${diffDays} ngày`;
        return date.toLocaleDateString("vi-VN");
    };

    const unreadCount = notificationsData?.filter(n => !n.isRead).length || 0;

    return (
        <>
            <header className="hdr">
                <div className="hdr-inner">

                    {/* ── LOGO ── */}
                    <Link to="/" className="hdr-logo">
                        <img src="/logodenrmvbg.png" alt="ChoRe" />
                    </Link>

                    {/* ── CATEGORY ── */}
                    <div className="hdr-category" ref={dropdownRef}>
                        <button
                            className={`hdr-cat-btn ${open ? "hdr-cat-btn--open" : ""}`}
                            onClick={() => setOpen(!open)}
                        >
                            <FontAwesomeIcon icon={faLayerGroup} />
                            <span>Danh mục</span>
                            <FontAwesomeIcon icon={faAngleDown} className="hdr-cat-chevron" />
                        </button>

                        {open && (
                            <div className="hdr-cat-panel">
                                <div className="hdr-cat-panel-header">Danh mục sản phẩm</div>
                                {CATEGORIES.map((item) => (
                                    <button key={item.label} className="hdr-cat-item" onClick={() => setOpen(false)}>
                                        <span className="hdr-cat-emoji">{item.icon}</span>
                                        <span className="hdr-cat-label">{item.label}</span>
                                        <FontAwesomeIcon icon={faChevronRight} className="hdr-cat-arrow" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── SEARCH ── */}
                    <div className={`hdr-search ${searchFocused ? "hdr-search--focused" : ""}`}>
                        <button className="hdr-search-icon-btn" onClick={doSearch} aria-label="Tìm kiếm">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm, danh mục, thương hiệu..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                        {searchKeyword && (
                            <button
                                className="hdr-search-clear"
                                onClick={() => { setSearchKeyword(""); if (isSearchPage) setSearchParams({}); }}
                                aria-label="Xóa"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                        <button className="hdr-search-submit" onClick={doSearch}>Tìm</button>
                    </div>

                    {/* ── RIGHT ACTIONS ── */}
                    <div className="hdr-actions">

                        {/* Chat */}
                        <Link to="/chat" className="hdr-icon-btn" title="Nhắn tin">
                            <FontAwesomeIcon icon={faComment} />
                        </Link>

                        {/* Favourites */}
                        <Link to="/favorites" className="hdr-icon-btn hdr-icon-btn--heart" title="Yêu thích">
                            <FontAwesomeIcon icon={faHeart} />
                        </Link>

                        {/* Notifications */}
                        <div className="hdr-notif-wrap" ref={notificationRef}>
                            <button
                                className={`hdr-icon-btn ${notificationOpen ? "hdr-icon-btn--active" : ""}`}
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                title="Thông báo"
                            >
                                <FontAwesomeIcon icon={faBell} />
                                {unreadCount > 0 && (
                                    <span className="hdr-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                                )}
                            </button>

                            {notificationOpen && (
                                <div className="hdr-notif-panel">
                                    <div className="hdr-notif-head">
                                        <span className="hdr-notif-title">Thông báo</span>
                                        {unreadCount > 0 && (
                                            <span className="hdr-notif-count">{unreadCount} chưa đọc</span>
                                        )}
                                    </div>

                                    <div className="hdr-notif-tabs">
                                        {[
                                            { key: "All", label: "Tất cả" },
                                            { key: "Post", label: "Bài đăng" },
                                            { key: "Transaction", label: "Giao dịch" },
                                        ].map(tab => (
                                            <button
                                                key={tab.key}
                                                className={`hdr-notif-tab ${filterType === tab.key ? "hdr-notif-tab--active" : ""}`}
                                                onClick={() => setFilterType(tab.key)}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="hdr-notif-list">
                                        {!filteredNotifications?.length ? (
                                            <div className="hdr-notif-empty">
                                                <FontAwesomeIcon icon={faBell} />
                                                <p>Không có thông báo</p>
                                            </div>
                                        ) : (
                                            filteredNotifications.map(item => (
                                                <button
                                                    key={item.id}
                                                    className={`hdr-notif-item ${!item.isRead ? "hdr-notif-item--unread" : ""}`}
                                                    onClick={() => handleNotificationClick(item)}
                                                >
                                                    {!item.isRead && <span className="hdr-notif-dot" />}
                                                    <div className="hdr-notif-body">
                                                        <div className="hdr-notif-row">
                                                            <span className="hdr-notif-name">{item.title}</span>
                                                            <span className="hdr-notif-time">{formatNotificationDate(item.createdAt)}</span>
                                                        </div>
                                                        <p className="hdr-notif-msg">{item.message}</p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="hdr-divider" />

                        {/* PRO */}
                        <Link to="/service-package" className="hdr-pro-link">
                            {/* Gói <span className="hdr-pro-badge">PRO</span> */}
                            Mua <span className="hdr-pro-badge">GÓI</span>
                        </Link>

                        {/* Create post */}
                        <button onClick={handleCreatePost} className="hdr-create-btn">
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Đăng tin</span>
                        </button>

                        {/* Auth */}
                        {!user ? (
                            <Link to="/login" className="hdr-login-btn">Đăng nhập</Link>
                        ) : (
                            <div className="hdr-profile-wrap" ref={profileRef}>
                                <button
                                    className={`hdr-avatar-btn ${profileOpen ? "hdr-avatar-btn--open" : ""}`}
                                    onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                                >
                                    <img src={`https://api.chore123.cloud/uploads/${user.avatar}`} alt="avatar" />
                                    <span className="hdr-avatar-name">{user.fullName?.split(" ").pop()}</span>
                                    <FontAwesomeIcon icon={faAngleDown} className="hdr-avatar-chevron" />
                                </button>

                                {profileOpen && (
                                    <div className="hdr-profile-panel">
                                        <div className="hdr-profile-header">
                                            <img
                                                src={`https://api.chore123.cloud/uploads/${user.avatar}`}
                                                alt="avatar"
                                                className="hdr-profile-avatar"
                                            />
                                            <div>
                                                <div className="hdr-profile-name">{user.fullName}</div>
                                                <div className="hdr-profile-role">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="hdr-profile-links">
                                            <Link to="/profile" className="hdr-profile-item" onClick={() => setProfileOpen(false)}>
                                                <FontAwesomeIcon icon={faUser} className="hdr-profile-item-icon" />
                                                Trang cá nhân
                                            </Link>
                                            <Link to="/service-package-manager" className="hdr-profile-item" onClick={() => setProfileOpen(false)}>
                                                <FontAwesomeIcon icon={faLayerGroup} className="hdr-profile-item-icon" />
                                                Quản lý Gói
                                            </Link>
                                            <Link to="/user-transactions" className="hdr-profile-item" onClick={() => setProfileOpen(false)}>
                                                <FontAwesomeIcon icon={faClockRotateLeft} className="hdr-profile-item-icon" />
                                                Quản lý giao dịch
                                            </Link>
                                            {renderDashboardLink()}
                                        </div>
                                        <div className="hdr-profile-footer">
                                            <button onClick={handleLogout} className="hdr-logout-btn">
                                                <FontAwesomeIcon icon={faRightFromBracket} />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── MOBILE HAMBURGER ── */}
                    <button
                        className="hdr-mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
                    </button>
                </div>

                {/* ── MOBILE SEARCH ROW ── */}
                <div className="hdr-mobile-search-row">
                    <button className="hdr-mobile-cat-btn" onClick={() => setOpen(!open)}>
                        <FontAwesomeIcon icon={faLayerGroup} />
                        <span>Danh mục</span>
                    </button>
                    <div className="hdr-mobile-search-divider" />
                    <div className="hdr-mobile-search-input">
                        <FontAwesomeIcon icon={faSearch} onClick={doSearch} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                {/* ── MOBILE CATEGORY PANEL ── */}
                {open && (
                    <>
                        <div className="hdr-mobile-backdrop" onClick={() => setOpen(false)} />
                        <div className="hdr-mobile-cat-panel" onClick={(e) => e.stopPropagation()}>
                            <div className="hdr-cat-panel-header">Danh mục</div>
                            {CATEGORIES.map(item => (
                                <button key={item.label} className="hdr-cat-item" onClick={() => setOpen(false)}>
                                    <span className="hdr-cat-emoji">{item.icon}</span>
                                    <span className="hdr-cat-label">{item.label}</span>
                                    <FontAwesomeIcon icon={faChevronRight} className="hdr-cat-arrow" />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* ── MOBILE DRAWER ── */}
                {mobileMenuOpen && (
                    <>
                        <button className="hdr-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
                        <div className="hdr-drawer">
                            <div className="hdr-drawer-header">
                                {user ? (
                                    <div className="hdr-drawer-user">
                                        <img
                                            src={`https://api.chore123.cloud/uploads/${user.avatar}`}
                                            alt="avatar"
                                            className="hdr-drawer-avatar"
                                        />
                                        <div>
                                            <div className="hdr-drawer-name">{user.fullName}</div>
                                            <div className="hdr-drawer-email">{user.email}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hdr-drawer-guest">
                                        <Link to="/login" className="hdr-create-btn" onClick={() => setMobileMenuOpen(false)}>
                                            Đăng nhập
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <nav className="hdr-drawer-nav">
                                {user && (
                                    <>
                                        <Link to="/profile" className="hdr-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                                            <FontAwesomeIcon icon={faUser} /> Trang cá nhân
                                        </Link>
                                        <Link to="/service-package-manager" className="hdr-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                                            <FontAwesomeIcon icon={faLayerGroup} /> Quản lý Gói
                                        </Link>
                                        <Link to="/user-transactions" className="hdr-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                                            <FontAwesomeIcon icon={faClockRotateLeft} /> Giao dịch
                                        </Link>
                                    </>
                                )}
                                <Link to="/service-package" className="hdr-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FontAwesomeIcon icon={faCreditCard} /> Gói
                                </Link>
                                <Link to="/chat" className="hdr-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FontAwesomeIcon icon={faComment} /> Nhắn tin
                                </Link>
                                <Link to="/favorites" className="hdr-drawer-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FontAwesomeIcon icon={faHeart} /> Yêu thích
                                </Link>
                            </nav>
                            {user && (
                                <div className="hdr-drawer-footer">
                                    <button onClick={handleLogout} className="hdr-drawer-logout">
                                        <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </header>

            {/* ── MOBILE BOTTOM NAV ── */}
            <nav className="hdr-bottom-nav" role="navigation" aria-label="Mobile navigation">
                <Link to="/" className="hdr-bottom-item">
                    <span className="hdr-bottom-icon"></span>
                    <span className="hdr-bottom-label">Trang chủ</span>
                </Link>
                <Link to="/manage-posts" className="hdr-bottom-item">
                    <span className="hdr-bottom-icon"></span>
                    <span className="hdr-bottom-label">Tin của tôi</span>
                </Link>
                <button onClick={handleCreatePost} className="hdr-bottom-create">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <Link to="/chat" className="hdr-bottom-item">
                    <span className="hdr-bottom-icon"></span>
                    <span className="hdr-bottom-label">Nhắn tin</span>
                </Link>
                <Link to="/profile" className="hdr-bottom-item">
                    <span className="hdr-bottom-icon"></span>
                    <span className="hdr-bottom-label">Tài khoản</span>
                </Link>
            </nav>

            {/* ── REVIEW FORM MODAL ── */}
            {reviewChatRoomId && (
                <ReviewForm
                    chatRoomId={reviewChatRoomId}
                    userId={user.userId}
                    onClose={() => setReviewChatRoomId(null)}
                    reload={() => navigate(0)}
                />
            )}
        </>
    );
}

export default Header;