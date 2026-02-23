import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch, faMobileScreen, faAngleRight, faList, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faComment, faBell, faHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@/assets/Header.css";

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

    const isSearchPage = location.pathname === "/search";

    // Khi vào /search từ trang khác, đồng bộ keyword từ URL vào input
    useEffect(() => {
        if (isSearchPage) {
            setSearchKeyword(searchParams.get("keyword") || "");
        }
    }, [isSearchPage]);

    const handleCreatePost = () => {
        if (!user) {
            navigate("/login", { state: { redirectTo: "/post/create" } });
        } else {
            navigate("/post/create");
        }
    };

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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleLogout = () => {
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

                    <div className="action-icon" title="Tin yêu thích">
                        <FontAwesomeIcon icon={faHeart} />
                    </div>

                    <div className="action-icon" title="Thông báo">
                        <FontAwesomeIcon icon={faBell} />
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
                        <div className="profile-dropdown-wrapper">
                            <button
                                className="profile-avatar"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <img src={`http://localhost:5121/uploads/${user.avatar}`} alt="Profile" />
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
                <button className="mobile-category-btn" onClick={() => setOpen(!open)}>
                    <FontAwesomeIcon icon={faList} />
                    <span>Danh mục</span>
                    <FontAwesomeIcon icon={faAngleDown} className={open ? "open" : ""} />
                </button>

                <div className="mobile-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm, danh mục hay thương hiệu..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="mobile-search-btn" onClick={doSearch}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
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
                    <span className="label">Quản lý</span>
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
        </header>
    );
}

export default Header;