import { Link, Outlet, useLocation } from "react-router-dom";

function HelpLayout() {

    const location = useLocation();

    const menu = [
        { name: "Giới thiệu", path: "/about" },
        { name: "Liên hệ", path: "/contact" },
        { name: "Trung tâm trợ giúp", path: "/helpcenter" },
        { name: "Phương thức thanh toán", path: "/payment" },
        { name: "Điều khoản sử dụng", path: "/terms" },
        { name: "Chính sách bảo mật", path: "/privacy" },
        { name: "Chính sách đổi trả", path: "/return" },
        { name: "Giải quyết tranh chấp", path: "/ds" }
    ];

    return (
        <div style={styles.page}>

            <div style={styles.container}>

                {/* Sidebar */}
                <aside style={styles.sidebar}>

                    <div style={styles.sidebarTitle}>
                        Quy định chung
                    </div>

                    <div style={styles.menu}>
                        {menu.map(item => {

                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        ...styles.menuItem,
                                        color: isActive ? "#00873d" : "#333",
                                        fontWeight: isActive ? "600" : "400"
                                    }}
                                >
                                    {item.name}
                                </Link>
                            );

                        })}
                    </div>

                </aside>


                {/* Content */}
                <main style={styles.content}>
                    <Outlet />
                </main>

            </div>

        </div>
    );
}


const styles = {

    // nền xám giống Chợ Tốt
    page: {
        background: "#f4f4f4",
        minHeight: "100vh",
        paddingTop: "30px",
        paddingBottom: "50px"
    },

    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        gap: "60px",
        alignItems: "flex-start",
        padding: "30px 40px"
    },

    // sidebar KHÔNG border box
    sidebar: {
        width: "260px",
        background: "#fff",     // nền trắng toàn sidebar
        padding: "20px 20px",
    },

    // title sidebar
    sidebarTitle: {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "15px",
        color: "#333",
    },

    // menu có line bên trái nhẹ
    menu: {
        borderLeft: "2px solid #eee",
        paddingLeft: "15px",
        background: "#fff"
    },

    menuItem: {
        display: "block",
        padding: "8px 0",
        textDecoration: "none",
        fontSize: "15px",
        transition: "0.15s"
    },

    // content KHÔNG border
    content: {
        flex: 1,
        maxWidth: "800px"
    }

};

export default HelpLayout;