import { Link } from "react-router-dom";
// import "@/assets/Footer.css";
function Footer() {
    return (
        <footer className="bg-gray-900 mt-100" style={{}}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    {/* Về chúng tôi */}
                    <div style={styles.column}>
                        <h3 style={styles.title}>Về chúng tôi</h3>
                        <p style={styles.description}>
                            Nền tảng mua bán đồ điện tử cũ trực tuyến, kết nối người mua và người bán
                            một cách nhanh chóng, an toàn và tiện lợi.
                        </p>
                        {/* <div style={styles.socialLinks}>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" style={styles.socialIcon}>
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div> */}
                    </div>

                    {/* Hỗ trợ khách hàng */}
                    <div style={styles.column}>
                        <h3 style={styles.title}>Hỗ trợ khách hàng</h3>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <Link to="/about" style={styles.link}>Giới thiệu</Link>
                            </li>
                            <li style={styles.listItem}>
                                <Link to="/contact" style={styles.link}>Liên hệ</Link>
                            </li>
                            <li style={styles.listItem}>
                                <Link to="/helpcenter" style={styles.link}>Trung tâm trợ giúp</Link>
                            </li>
                            <li style={styles.listItem}>
                                <Link to="/payment" style={styles.link}>Phương thức thanh toán</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Chính sách */}
                    <div style={styles.column}>
                        <h3 style={styles.title}>Chính sách</h3>
                        <ul style={styles.list}>
                            <li style={styles.listItem}>
                                <Link to="/terms" style={styles.link}>Điều khoản sử dụng</Link>
                            </li>
                            <li style={styles.listItem}>
                                <Link to="/privacy" style={styles.link}>Chính sách bảo mật</Link>
                            </li>
                            <li style={styles.listItem}>
                                <Link to="/return" style={styles.link}>Chính sách đổi trả</Link>
                            </li>
                            <li style={styles.listItem}>
                                <Link to="/ds" style={styles.link}>Giải quyết tranh chấp</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div style={styles.column}>
                        <h3 style={styles.title}>Liên hệ</h3>
                        <ul style={styles.list}>
                            <li style={styles.contactItem}>
                                <i className="fas fa-map-marker-alt" style={styles.icon}></i>
                                <span>Phường Tân Triều, Tỉnh Đồng Nai, Việt Nam</span>
                            </li>
                            <li style={styles.contactItem}>
                                <i className="fas fa-phone" style={styles.icon}></i>
                                <span>0836 044 008</span>
                            </li>
                            <li style={styles.contactItem}>
                                <i className="fas fa-envelope" style={styles.icon}></i>
                                <span>ng.minhkhoi2912@gmail.com</span>
                            </li>
                            <li style={styles.contactItem}>
                                <i className="fas fa-clock" style={styles.icon}></i>
                                <span>8:00 - 22:00 (Hàng ngày)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div style={styles.copyright}>
                    <p style={styles.copyrightText}>
                        © {new Date().getFullYear()} Chợ Rẻ. All rights reserved.
                    </p>
                    <p style={{ ...styles.copyrightText, marginTop: "6px", fontSize: "12px" }}>
                        Academic project – Graduation Thesis, FPT Polytechnic.
                    </p>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: "white",
        color: "#ffffff",
        marginTop: "100px",
        paddingTop: "50px",
        paddingBottom: "20px"
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        marginBottom: "40px"
    },
    column: {
        display: "flex",
        flexDirection: "column"
    },
    title: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "20px",
        color: "#ffffff"
    },
    description: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#b0b0b0",
        marginBottom: "20px"
    },
    socialLinks: {
        display: "flex",
        gap: "15px"
    },
    socialIcon: {
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        backgroundColor: "#2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        textDecoration: "none",
        transition: "all 0.3s ease",
        cursor: "pointer"
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0
    },
    listItem: {
        marginBottom: "12px"
    },
    link: {
        color: "#b0b0b0",
        textDecoration: "none",
        fontSize: "14px",
        transition: "color 0.3s ease"
    },
    contactItem: {
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "12px",
        fontSize: "14px",
        color: "#b0b0b0",
        gap: "10px"
    },
    icon: {
        marginTop: "2px",
        minWidth: "16px",
        color: "#4CAF50"
    },
    copyright: {
        borderTop: "1px solid #2a2a2a",
        paddingTop: "20px",
        textAlign: "center"
    },
    copyrightText: {
        fontSize: "14px",
        color: "#808080",
        margin: 0
    }
};

export default Footer;