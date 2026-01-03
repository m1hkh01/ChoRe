import { Link, Outlet } from "react-router-dom";
import "@/assets/censor.css";

function CensorLayout() {
    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <a href="/"><h3 className="sidebar-title">CENSOR PANEL</h3></a>

                <div className="admin-info">
                    {/* <img
                        src="http://localhost:5121/uploads/default-avatar.png"
                        className="admin-avatar"
                        alt="Censor Avatar"
                    /> */}
                    <span className="admin-name">Censor</span>
                </div>

                <nav className="menu">
                    <Link to="/censor/post-censor" className="menu-item">
                        Duyệt bài viết
                    </Link>
                </nav>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default CensorLayout;
