import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useAuthStore } from "../store/auth";

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
                <li>
                    <Link
                        className="dropdown-item"
                        to="/admin/post-manager"
                    >
                        Trang quản trị Admin
                    </Link>
                </li>
            );
        }

        if (user.role === "Censor") {
            return (
                <li>
                    <Link
                        className="dropdown-item"
                        to="/censor/post-censor"
                    >
                        Trang kiểm duyệt
                    </Link>
                </li>
            );
        }

        return null;
    };

    return (
        <header className="menu">
            <nav className="navbar navbar-expand-sm">
                <div className="container-fluid px-3 d-flex justify-content-between align-items-center">

                    {/* LOGO */}
                    <Link to="/" className="navbar-brand fw-bold">
                        Chợ <span style={{ color: "#f39c12" }}>Rẻ</span>
                    </Link>

                    {/* RIGHT MENU */}
                    <div className="d-flex align-items-center gap-3">

                        {/* ĐĂNG TIN */}
                        {user && user.role === "User" && (
                            <Link
                                to="/post/create"
                                className="btn btn-warning fw-bold"
                                style={{
                                    borderRadius: "20px",
                                    padding: "6px 16px"
                                }}
                            >
                                + Đăng tin
                            </Link>
                        )}

                        {/* ACCOUNT */}
                        {user ? (
                            <div className="dropdown Account">
                                <a
                                    href="#"
                                    className="dropdown-toggle text-decoration-none fw-semibold"
                                    data-bs-toggle="dropdown"
                                >
                                    Xin chào, {user.userName}
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            Trang cá nhân
                                        </Link>
                                    </li>

                                    {/* ADMIN / CENSOR */}
                                    {renderDashboardLink()}

                                    <li><hr className="dropdown-divider" /></li>

                                    <li
                                        className="dropdown-item text-danger"
                                        role="button"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link to="/login" className="nav-link">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
