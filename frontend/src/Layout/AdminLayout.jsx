import { Link, Outlet } from "react-router-dom";
import "@/assets/admin.css";
import { useAuthStore } from "../store/auth";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileLines,
    faUsers,
    faBox,
    faNewspaper,
    faTags,
    faCog,
    faStore,
    faUser,
    faGift,
    faMoneyBill,
    faBars,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

function AdminLayout() {
    const { user } = useAuthStore();
    const [expandedMenu, setExpandedMenu] = useState({
        content: false,
        users: false,
        services: false
    });

    const toggleMenu = (menuName) => {
        setExpandedMenu(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };
    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                {/* ADMIN INFO */}
                <div className="admin-info">
                    <Link to="/" className="header-logo desktop-only">
                        <img
                            src="/logodenrmvbg.png"
                            alt="LogoChoRe"
                            className="h-8 w-10 object-contain"
                        />
                    </Link>

                    <h3 className="admin-name">Hi, {user.fullName}</h3>
                </div>

                {/* MENU */}
                <nav className="menu">
                    {/* QUẢN LÝ NỘI DUNG */}
                    <div className="menu-group">
                        <button
                            className="menu-group-toggle"
                            onClick={() => toggleMenu("content")}
                        >
                            <span className="menu-label">
                                <FontAwesomeIcon icon={faFileLines} />
                                <span>Quản lý Nội dung</span>
                            </span>
                            <span className={`arrow ${expandedMenu.content ? "open" : ""}`}>
                                <FontAwesomeIcon icon={expandedMenu.content ? faBars : faBars} style={{ transform: 'rotate(-90deg)' }} />
                            </span>
                        </button>
                        <div className={`menu-submenu ${expandedMenu.content ? "show" : ""}`}>
                            <Link to="/admin/post-manager" className="submenu-item">
                                Quản lý bài viết
                            </Link>
                            <Link to="/admin/category-manager" className="submenu-item">
                                Quản lý phân loại
                            </Link>
                            <Link to="/admin/specification-manager" className="submenu-item">
                                Cấu hình phân loại
                            </Link>
                            <Link to="/admin/brand-manager" className="submenu-item">
                                Quản lý hãng
                            </Link>
                            <Link to="/admin/brand-category-manager" className="submenu-item">
                                Phân loại hãng
                            </Link>
                        </div>
                    </div>

                    {/* QUẢN LÝ NGƯỜI DÙNG */}
                    <div className="menu-group">
                        <button
                            className="menu-group-toggle"
                            onClick={() => toggleMenu("users")}
                        >
                            <span className="menu-label">
                                <FontAwesomeIcon icon={faUsers} />
                                <span>Quản lý Người dùng</span>
                            </span>
                            <span className={`arrow ${expandedMenu.users ? "open" : ""}`}>
                                <FontAwesomeIcon icon={faBars} style={{ transform: 'rotate(-90deg)' }} />
                            </span>
                        </button>
                        <div className={`menu-submenu ${expandedMenu.users ? "show" : ""}`}>
                            <Link to="/admin/user-manager" className="submenu-item">
                                Quản lý người dùng
                            </Link>
                            <Link to="/admin/user-subscriptions" className="submenu-item">
                                Quản lý gói dịch vụ
                            </Link>
                        </div>
                    </div>

                    {/* QUẢN LÝ DỊCH VỤ */}
                    <div className="menu-group">
                        <button
                            className="menu-group-toggle"
                            onClick={() => toggleMenu("services")}
                        >
                            <span className="menu-label">
                                <FontAwesomeIcon icon={faBox} />
                                <span>Quản lý Dịch vụ</span>
                            </span>
                            <span className={`arrow ${expandedMenu.services ? "open" : ""}`}>
                                <FontAwesomeIcon icon={faBars} style={{ transform: 'rotate(-90deg)' }} />
                            </span>
                        </button>
                        <div className={`menu-submenu ${expandedMenu.services ? "show" : ""}`}>
                            <Link to="/admin/sub-manager" className="submenu-item">
                                Quản lý gói dịch vụ
                            </Link>
                            <Link to="/admin/transaction-manager" className="submenu-item">
                                Giao dịch trung gian
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* FOOTER SECTION */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => { }}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
