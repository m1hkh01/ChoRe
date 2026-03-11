import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch, faMobileScreen, faAngleRight, faList, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faComment, faBell, faHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@/assets/Header.css";
import useFetch from "../Hooks/useFetch";
import { Toast } from "../utils/toast";
import { useSignalR } from "../signalr/SignalRContext";
import api from "../api";
import ReviewForm from "./Review/ReviewForm";

function Header() {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
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


    if (loading) {
        console.log("Loading notifications...");
    } else if (error) {
        // Toast.fire({
        //     icon: "error",
        //     title: "Không thể tải thông báo"
        // })
        console.error("Failed to load notifications:", error);
    }
    useEffect(() => {
        if (data) {
            setNotificationData(data);
        }
    }, [data]);
    useEffect(() => {
        if (!connectionRef?.current) return;

        const connection = connectionRef.current;
        const handler = (notification) => {
            console.log("Get Notification:", notification);
            setNotificationData(prev => {
                // tránh duplicate theo id
                if (prev.some(n => n.id === notification.id)) return prev;
                return [notification, ...prev];
            });
        };

        connection.off("ReceiveNotification"); // đảm bảo không đăng ký nhiều lần
        connection.on("ReceiveNotification", handler);

        return () => {
            connection.off("ReceiveNotification", handler);
        };
    }, [connectionRef?.current]);
    // Khi vào /search từ trang khác, đồng bộ keyword từ URL vào input
    useEffect(() => {
        if (isSearchPage) {
            setSearchKeyword(searchParams.get("keyword") || "");
        }
    }, [isSearchPage]);

    // Chuyển hướng khi nhấn "Đăng tin"
    const handleCreatePost = () => {
        if (!user) {
            navigate("/login", { state: { redirectTo: "/post/create" } });
        } else {
            navigate("/post/create");
        }
    };

    // Hàm thực hiện tìm kiếm
    const doSearch = () => {
        const q = searchKeyword.trim();
        if (isSearchPage) {
            // Đang ở trang search → chỉ cập nhật URL param, SearchPage tự fetch
            setSearchParams(q ? { keyword: q } : {});
        } else {
            // Trang khác → navigate sang /search
            navigate(q ? `/search?keyword=${encodeURIComponent(q)}` : "/search");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") doSearch();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {

            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {
                setNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {
                setProfileOpen(false);
            }
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                setMobileMenuOpen(false);
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleLogout = async () => {
        try {
            // Call revoke endpoint to invalidate refresh token on server
            await api.post("/account/revoke-token");
        } catch (err) {
            console.log("Error revoking token:", err);
        }
        // Clear user session locally
        logout();
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const renderDashboardLink = () => {
        if (!user) return null;
        if (user.role === "Admin") {
            return (
                <Link
                    to="/admin/post-manager"
                    className="header-dropdown-item"
                    onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}
                >
                    Trang quản trị Admin
                </Link>
            );
        }
        if (user.role === "Censor") {
            return (
                <Link
                    to="/censor/post-censor"
                    className="header-dropdown-item"
                    onClick={() => { setProfileOpen(false); setMobileMenuOpen(false); }}
                >
                    Trang kiểm duyệt
                </Link>
            );
        }
        return null;
    };

    // Hàm xử lý hành động khi click vào thông báo
    const handleNotificationClick = async (notification) => {

        // mark as read (optional)
        await api.put(`/api/notifications/${notification.id}/read`);
        setNotificationOpen(false);
        setNotificationData(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));

        switch (notification.type) {
            case "Transaction":
            case "PendingPayment":
                navigate(`/pay/transaction/${notification.relatedId}`);
                break;

            case "PendingPaymentPackage":
                navigate(`/pay/package/${notification.relatedId}`);
                break;

            case "PostApproved":
            case "PostRejected":
                navigate(`/profile`);
                break;

            // case "PaymentReceived":
            //     navigate(`/user-transactions`);
            //     break;
            case "Confirming":
            case "AwaitingEvidence":
                navigate(`/user-transactions`);
                break;

            case "ReviewReminder":
                setReviewChatRoomId(notification.relatedId);
                break;

            default:
                navigate("/");
                break;
        }
    };
    // Hàm xử lý lọc thông báo
    const filteredNotifications = notificationsData?.filter(n => {
        if (filterType === "All") return true;

        if (filterType === "Post") {
            return ["PostApproved", "PostRejected"].includes(n.type);
        }

        if (filterType === "Transaction") {
            return [
                "Transaction",
                "PendingPayment",
                "PaymentReceived",
                "AwaitingEvidence"
            ].includes(n.type);
        }

        return true;
    });
    // Hàm format date thông báo
    const formatNotificationDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // 🔹 Trong 1 giờ → X phút trước
        if (diffMinutes < 60) {
            return `${diffMinutes || 1} phút trước`;
        }

        // 🔹 Trong 24h → X giờ trước
        if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        }

        // 🔹 Hôm qua
        if (diffDays === 1) {
            return "Hôm qua";
        }

        // 🔹 ≤ 3 ngày → Thứ X
        if (diffDays <= 3) {
            const weekdayMap = [
                "Chủ nhật",
                "Thứ 2",
                "Thứ 3",
                "Thứ 4",
                "Thứ 5",
                "Thứ 6",
                "Thứ 7"
            ];
            return weekdayMap[date.getDay()];
        }

        // 🔹 > 3 ngày → X ngày trước
        if (diffDays <= 30) {
            return `${diffDays} ngày trước`;
        }

        // 🔹 Quá lâu → dd/MM/yyyy
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* LOGO (desktop) */}
                <Link to="/" className="header-logo desktop-only">
                    <img src="/logodenrmvbg.png" alt="LogoChoRe" />
                </Link>

                {/* MOBILE TOP */}
                <div className="mobile-top mobile-only">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Open menu"
                    >
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
                    </button>

                    <Link to="/" className="mobile-logo">
                        <img src="/logodenrmvbg.png" alt="LogoChoRe" />
                    </Link>

                    <div className="mobile-top-actions">
                        <Link to="/favorites" className="action-icon" title="Tin yêu thích">
                            <FontAwesomeIcon icon={faHeart} />
                        </Link>
                        <Link to="/notifications" className="action-icon" title="Thông báo">
                            <FontAwesomeIcon icon={faBell} />
                        </Link>
                    </div>
                </div>

                {/* CATEGORY DROPDOWN - Desktop */}
                <div className="header-category desktop-only" ref={dropdownRef}>
                    <button className="category-btn" onClick={() => setOpen(!open)}>
                        <FontAwesomeIcon icon={faList} />
                        <span>Danh mục</span>
                        <FontAwesomeIcon icon={faAngleDown} className={open ? "open" : ""} />
                    </button>

                    {open && (
                        <div className="category-dropdown">
                            {["Điện thoại", "Laptop", "Bàn phím", "PC, Màn hình", "Âm thanh, mic thu âm", "Phụ kiện", "Đồng hồ thông minh"].map((item) => (
                                <div key={item} className="category-item">
                                    <FontAwesomeIcon icon={faMobileScreen} />
                                    <span>{item}</span>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SEARCH BAR - Desktop (luôn hiện) */}
                <div className="header-search desktop-only">
                    <FontAwesomeIcon
                        icon={faSearch}
                        style={{ cursor: "pointer" }}
                        onClick={doSearch}
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm, danh mục hay thương hiệu..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchKeyword && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            style={{ cursor: "pointer", color: "#bbb", fontSize: "13px" }}
                            onClick={() => {
                                setSearchKeyword("");
                                if (isSearchPage) setSearchParams({});
                            }}
                        />
                    )}
                </div>

                {/* ACTIONS - Desktop */}
                <div className="header-actions desktop-only">
                    <Link to="/chat" className="action-icon" title="Nhắn tin">
                        <FontAwesomeIcon icon={faComment} />
                    </Link>

                    <Link to="/favorites" className="action-icon" title="Tin yêu thích">

                        <FontAwesomeIcon icon={faHeart} />
                    </Link>

                    {/* Thông báo */}
                    <div className="relative action-icon" ref={notificationRef}>
                        <button
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            className="relative p-2 rounded-full!"
                        >
                            <FontAwesomeIcon icon={faBell} className="text-lg" />

                            {notificationsData && notificationsData.filter(n => !n.isRead).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5! py-0.5! rounded-full">
                                    {notificationsData.filter(n => !n.isRead).length}
                                </span>
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="absolute top-9 right-0 mt-2 w-80 bg-white shadow-xl border rounded-xl overflow-hidden z-50">

                                {/* Header */}
                                <div className="p-2 font-semibold">
                                    Thông báo
                                </div>

                                {/* FILTER TABS */}
                                <div className="flex text-xs">
                                    {["All", "Post", "Transaction"].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={`flex-1 py-2 transition ${filterType === type
                                                ? "bg-white font-semibold text-green-600 border-b-2 border-green-500"
                                                : "text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {type === "All" && "Tất cả"}
                                            {type === "Post" && "Bài đăng"}
                                            {type === "Transaction" && "Giao dịch"}
                                        </button>
                                    ))}
                                </div>

                                {/* LIST */}
                                <div className="max-h-96 overflow-y-auto">
                                    {!filteredNotifications || filteredNotifications?.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Không có thông báo
                                        </div>
                                    ) : (
                                        filteredNotifications?.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleNotificationClick(item)}
                                                className={`p-3 cursor-pointer transition hover:bg-gray-50 ${!item.isRead
                                                    ? "bg-green-100 font-medium"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                <div className="text-sm flex justify-between">
                                                    <span>{item.title}</span>
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        {formatNotificationDate(item.createdAt)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {item.message}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/service-package" className="action-text">
                        Gói <span className="pro-badge">PRO</span>
                    </Link>

                    <button onClick={handleCreatePost} className="action-btn-create">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Đăng tin</span>
                    </button>

                    {!user ? (
                        <Link to="/login" className="action-btn-login">Đăng nhập</Link>
                    ) : (
                        <div className="profile-dropdown-wrapper" ref={profileRef}>
                            <button
                                className="profile-avatar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProfileOpen(!profileOpen);
                                }}
                            >
                                <img src={`https://api.chore123.cloud/uploads/${user.avatar}`} alt="Profile" />
                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown">
                                    <Link to="/profile" className="header-dropdown-item" onClick={() => setProfileOpen(false)}>
                                        Trang cá nhân
                                    </Link>
                                    <Link to="/service-package-manager" className="header-dropdown-item" onClick={() => setProfileOpen(false)}>
                                        Quản lý Gói
                                    </Link>
                                    <Link to="/user-transactions" className="header-dropdown-item" onClick={() => setProfileOpen(false)}>
                                        Quản lý các giao dịch
                                    </Link>
                                    {renderDashboardLink()}
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="header-dropdown-item logout-btn">
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE SEARCH ROW (luôn hiện) */}
            <div className="mobile-search-row mobile-only">

                <div className="mobile-search-box">

                    {/* Danh mục */}
                    <button
                        className="mobile-category-btn"
                        onClick={() => setOpen(!open)}
                    >
                        <FontAwesomeIcon icon={faList} />
                        <span>Danh mục</span>
                    </button>

                    {/* Divider */}
                    <div className="mobile-divider"></div>

                    {/* Search input */}
                    <div className="mobile-search-input-wrapper">

                        <button onClick={doSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>

                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />


                    </div>

                </div>

            </div>

            {/* MOBILE CATEGORY DROPDOWN */}
            {open && (
                <>
                    <div className="mobile-backdrop mobile-only" onClick={() => setOpen(false)} />
                    <div className="mobile-category-panel mobile-only" onClick={(e) => e.stopPropagation()}>
                        {["Điện thoại", "Laptop", "Bàn phím", "PC, Màn hình", "Âm thanh, mic thu âm", "Phụ kiện", "Đồng hồ thông minh"].map((item) => (
                            <div key={item} className="category-item">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span>{item}</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* BOTTOM NAV - Mobile */}
            <nav className="mobile-bottom-nav mobile-only" role="navigation" aria-label="Mobile bottom navigation">
                <Link to="/" className="bottom-nav-item">
                    <span className="icon"></span>
                    <span className="label">Trang chủ</span>
                </Link>
                <Link to="/manage-posts" className="bottom-nav-item">
                    <span className="icon"></span>
                    <span className="label">Quản lý tin</span>
                </Link>
                <Link to="/post/create" className="bottom-nav-item create-btn">
                    <span className="plus">+</span>
                </Link>
                <Link to="/chat" className="bottom-nav-item">
                    <span className="icon"></span>
                    <span className="label">Liên hệ</span>
                </Link>
                <Link to="/profile" className="bottom-nav-item">
                    <span className="icon"></span>
                    <span className="label">Tài khoản</span>
                </Link>
            </nav>
            {/* Review Form Modal */}
            {reviewChatRoomId && (
                <ReviewForm
                    chatRoomId={reviewChatRoomId}
                    userId={user.userId}
                    onClose={() => setReviewChatRoomId(null)}
                    reload={() => navigate(0)}
                ></ReviewForm>
            )}
        </header>
    );
}

export default Header;