function Privacy() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Chính sách bảo mật</h1>

            <p style={styles.description}>
                Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Thông tin được thu thập</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>Tên và thông tin liên hệ</li>
                    <li style={styles.listItem}>Thông tin tài khoản</li>
                    <li style={styles.listItem}>Thông tin giao dịch</li>
                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Mục đích sử dụng</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>Cung cấp và cải thiện dịch vụ</li>
                    <li style={styles.listItem}>Hỗ trợ người dùng</li>
                    <li style={styles.listItem}>Đảm bảo an toàn hệ thống</li>
                </ul>

            </div>

        </div>
    );
}

const styles = {

    container: { maxWidth: "800px" },

    title: {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "15px"
    },

    description: {
        fontSize: "16px",
        marginBottom: "20px",
        color: "#555"
    },

    section: {
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "6px",
        border: "1px solid #eee",
        marginBottom: "20px"
    },

    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "10px"
    },

    list: { paddingLeft: "20px" },

    listItem: {
        marginBottom: "8px",
        fontSize: "16px"
    }

};

export default Privacy;