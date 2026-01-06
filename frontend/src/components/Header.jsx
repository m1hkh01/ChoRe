import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import "./Header.css";

function Header() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const renderDashboardLink = () => {
        if (!user) return null;

        if (user.role === "Admin") {
            return (
                <Link to="/admin/post-manager" className="dropdown-item">
                    Trang quản trị Admin
                </Link>
            );
        }

        if (user.role === "Censor") {
            return (
                <Link to="/censor/post-censor" className="dropdown-item">
                    Trang kiểm duyệt
                </Link>
            );
        }

        return null;
    };

    return (
        <header className="site-header">
            {/* LOGO */}
            <Link to="/" className="logo">
                <div className="logo-text">
                    Chó<span>Rẻ</span>
                </div>
            </Link>

            {/* NAV */}
            <nav className="main-nav">
                <Link to="#">Điện thoại</Link>
                <Link to="#">Laptop</Link>
                <Link to="#">Phụ kiện</Link>
                <Link to="#">Khuyến mãi</Link>
            </nav>

            {/* SEARCH */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm đồ công nghệ giá hời..."
                />
            </div>

            {/* ACTIONS */}
            <div className="actions">
                {/* USER ĐƯỢC ĐĂNG TIN */}
                {user && user.role === "User" && (
                    <Link
                        to="/post/create"
                        className="login-btn"
                    >
                        + Đăng tin
                    </Link>
                )}

                {/* GIỎ HÀNG */}
                <button className="cart-btn">
                    Giỏ hàng <span>0</span>
                </button>

                {/* AUTH */}
                {!user ? (
                    <div className="auth-buttons">
                        <Link to="/login" className="login-btn">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="register-btn">
                            Đăng ký
                        </Link>
                    </div>
                ) : (
                    <div className="dropdown">
                        <span
                            className="login-btn dropdown-toggle"
                            data-bs-toggle="dropdown"
                            role="button"
                        >
                            {user.userName}
                        </span>

                        <div className="dropdown-menu dropdown-menu-end">
                            <Link className="dropdown-item" to="/profile">
                                Trang cá nhân
                            </Link>

                            {renderDashboardLink()}

                            <div className="dropdown-divider"></div>

                            <span
                                className="dropdown-item text-danger"
                                role="button"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
