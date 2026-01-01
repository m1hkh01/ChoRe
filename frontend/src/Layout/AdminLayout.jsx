import { Link, Outlet } from "react-router-dom"
import "../assets/admin.css"
function AdminLayout() {
    return (
        <div className="admin-container">
            <aside className="sidebar">
                <h3>Dashboard</h3>
                <div className="admin-info">
                    <img src="http://localhost:5121/uploads/0ad43ca8-9d52-4761-b98a-17fee062759f.png" className="admin-avatar" alt="" />
                    <span className="admin-name">Nguyen Van A</span>
                </div>
                <nav className="menu">
                    <Link to="post-manager" className="menu-item">Quản lý bài viết</Link>
                    <Link to="post-manager" className="menu-item">Quản lý bài viết</Link>
                    <Link to="post-manager" className="menu-item">Quản lý bài viết</Link>
                    <Link to="post-manager" className="menu-item">Quản lý bài viết</Link>
                    <Link to="post-manager" className="menu-item">Quản lý bài viết</Link>
                    <Link to="post-manager" className="menu-item">Quản lý bài viết</Link>
                </nav>
            </aside>
            <main className="main-content">
                <div className="content">
                    <Outlet></Outlet>
                </div>
            </main>
        </div>
    )
}
export default AdminLayout