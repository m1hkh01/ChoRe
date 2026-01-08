import { Link, Outlet } from "react-router-dom";
import "@/assets/admin.css";
import { useAuthStore } from "../store/auth";

function AdminLayout() {
    const { user } = useAuthStore();
    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <Link to="/">
                    <img src="/logo.png" alt="logo" className="sidebar-logo" />
                </Link>
                

                {/* ADMIN INFO */}
                <div className="admin-info">
                    <h3 className="admin-name">{ user.fullName }</h3>
                    {/* <img
                        src="http://localhost:5121/uploads/default-avatar.png"
                        className="admin-avatar"
                        alt="Admin Avatar"
                    /> */}
                    <span className="admin-role">Administrator</span>
                </div>

                {/* MENU */}
                <nav className="menu">
                    <Link to="/admin/post-manager" className="menu-item">
                        Quản lý bài viết
                    </Link>
                    <Link to="/admin/brand-manager" className="menu-item">
                        Quản lý hãng
                    </Link>
                    <Link to="/admin/category-manager" className="menu-item">
                        Quản lý phân loại
                    </Link>
                    <Link to="/admin/brand-category-manager" className="menu-item">
                        Quản lý phân loại hãng
                    </Link>
                    <Link to="/admin/specification-manager" className="menu-item">
                        Quản lý cấu hình phân loại
                    </Link>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
