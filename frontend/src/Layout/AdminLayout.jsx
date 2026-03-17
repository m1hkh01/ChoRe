import { Link, Outlet, useNavigate } from "react-router-dom";
import "@/assets/admin.css";
import { useAuthStore } from "../store/auth";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileLines,
    faUsers,
    faBox,
    faSignOutAlt,
    faChevronDown,
    faBars,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import api from "../api";

function AdminLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState({});

    const menuSections = [
        {
            id: "content",
            title: "Quản lý Nội dung",
            icon: faFileLines,
            items: [
                { path: "/admin/post-manager", label: "Quản lý bài viết" },
                { path: "/admin/category-manager", label: "Quản lý phân loại" },
                { path: "/admin/specification-manager", label: "Cấu hình phân loại" },
                { path: "/admin/brand-manager", label: "Quản lý hãng" },
                { path: "/admin/brand-category-manager", label: "Phân loại hãng" }
            ]
        },
        {
            id: "users",
            title: "Quản lý Người dùng",
            icon: faUsers,
            items: [
                { path: "/admin/user-manager", label: "Quản lý người dùng" },
                { path: "/admin/user-subscriptions", label: "Quản lý gói dịch vụ" }
            ]
        },
        {
            id: "services",
            title: "Quản lý Dịch vụ",
            icon: faBox,
            items: [
                { path: "/admin/sub-manager", label: "Quản lý gói dịch vụ" },
                { path: "/admin/transaction-manager", label: "Giao dịch trung gian" }
            ]
        }
    ];

    const toggleMenu = (menuId) => {
        setExpandedMenu(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleLogout = async () => {
        try {
            await api.post("/account/revoke-token");
        } catch {
            // noop
        }
        logout();
        navigate("/");
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="admin-layout">
            {/* MOBILE HEADER */}
            <header className="mobile-header">
                <button
                    className="menu-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
                </button>
                <Link to="/" className="mobile-logo">
                    <img src="/logodenrmvbg.png" alt="Logo" />
                </Link>
                <div className="user-name-mobile">{user.fullName}</div>
            </header>

            {/* OVERLAY */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar} />
            )}

            {/* SIDEBAR */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                {/* ADMIN INFO */}
                <div className="admin-info">
                    <Link to="/" className="logo-link">
                        <img src="/logodenrmvbg.png" alt="Logo" />
                    </Link>
                    <h3 className="admin-name">{user.fullName}</h3>
                </div>

                {/* NAVIGATION MENU */}
                <nav className="navigation">
                    {menuSections.map(section => (
                        <div key={section.id} className="menu-section">
                            <button
                                className={`menu-toggle-btn ${expandedMenu[section.id] ? "expanded" : ""}`}
                                onClick={() => toggleMenu(section.id)}
                                aria-expanded={expandedMenu[section.id]}
                            >
                                <div className="menu-toggle-content">
                                    <FontAwesomeIcon icon={section.icon} className="menu-icon" />
                                    <span className="menu-title">{section.title}</span>
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="chevron-icon"
                                />
                            </button>

                            {expandedMenu[section.id] && (
                                <div className="submenu">
                                    {section.items.map(item => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="submenu-link"
                                            onClick={closeSidebar}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* FOOTER */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
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
