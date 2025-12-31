import { Link } from "react-router-dom";
import "../App.css"
import { useAuthStore } from "../store/auth";
function Header() {
    const { user, logout } = useAuthStore();
    // console.log("User :", user);
    return (
        <header className="menu">
            <nav className="navbar navbar-expand-sm">
                <ul className="navbar-nav w-100 d-flex align-items-center justify-content-between pe-3">
                    <Link to="/" className="navbar-brand">Chợ <span>Rẻ</span></Link>
                    {
                        user ? (
                            <li className="Account dropdown">
                                <a href="#" data-bs-toggle="dropdown" className="dropdown-toggle">Welcome {user.userName}</a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/profile">Trang cá nhân</Link></li>
                                    <li><hr className="dropdown-divider"></hr></li>
                                    <li onClick={logout} className="text-danger dropdown-item">Đăng xuất</li>
                                </ul>
                            </li>
                        ) : (
                                <li className="nav-item"><Link to='/login' className="nav-link">Login</Link></li>
                        )
                    }
                </ul>
            </nav>
        </header>
    )
}
export default Header;