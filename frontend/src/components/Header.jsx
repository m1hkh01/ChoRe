import { Link } from "react-router-dom";
import "../App.css";
import { useAuthStore } from "../store/auth";

function Header() {
    const { user, logout } = useAuthStore();

    return (
        <header className="menu">
            <nav className="navbar navbar-expand-sm">
                <ul className="navbar-nav w-100 d-flex align-items-center justify-content-between pe-3">
                    
                    {/* Logo */}
                    <Link to="/" className="navbar-brand">
                        Chợ <span>Rẻ</span>
                    </Link>

                    {/* Right menu */}
                    <div className="d-flex align-items-center gap-3">

                        {/* ✅ Nút đăng tin - chỉ khi đã login */}
                        {user && (
                            <Link
                                to="/post/create"
                                className="btn btn-warning fw-bold"
                            >
                                + Đăng tin
                            </Link>
                        )}

                        {/* Account */}
                        {user ? (
                            <li className="Account dropdown list-unstyled">
                                <a
                                    href="#"
                                    data-bs-toggle="dropdown"
                                    className="dropdown-toggle text-decoration-none"
                                >
                                    Welcome {user.userName}
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            Trang cá nhân
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li
                                        onClick={logout}
                                        className="dropdown-item text-danger"
                                        role="button"
                                    >
                                        Đăng xuất
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item list-unstyled">
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                            </li>
                        )}
                    </div>

                </ul>
            </nav>
        </header>
    );
}

export default Header;

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
