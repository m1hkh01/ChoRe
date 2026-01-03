import { Link, Outlet } from "react-router-dom";
import "@/assets/admin.css";

function AdminLayout() {
    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <a href="/"><h3 className="sidebar-title">ADMIN PANEL</h3></a>

                {/* ADMIN INFO */}
                <div className="admin-info">
                    {/* <img
                        src="http://localhost:5121/uploads/default-avatar.png"
                        className="admin-avatar"
                        alt="Admin Avatar"
                    /> */}
                    <span className="admin-name">Administrator</span>
                </div>

                {/* MENU */}
                <nav className="menu">
                    <Link to="/admin/post-manager" className="menu-item">
                        Quản lý bài viết
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
