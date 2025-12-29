import { Link } from "react-router-dom";
import "../App.css"
function Header() {
    return (
        <header className="menu">
            <nav className="navbar navbar-expand-sm">
                <ul className="navbar-nav w-100 d-flex align-items-center justify-content-between pe-3">
                    <Link to="/" className="navbar-brand">Chợ rẻeeee</Link>
                    <li className="nav-item"><Link to='/login' className="nav-link">Login</Link></li>
                </ul>
            </nav>
        </header>
    )
}
export default Header;