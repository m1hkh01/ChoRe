function Privacy() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Chính sách bảo mật</h1>

            <p style={styles.description}>
                Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng
                khi sử dụng hệ thống. Các thông tin được thu thập sẽ chỉ được sử dụng nhằm
                cung cấp và cải thiện dịch vụ trên nền tảng.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>1. Thông tin được thu thập</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Thông tin cá nhân cơ bản như tên, email hoặc thông tin liên hệ.
                    </li>
                    <li style={styles.listItem}>
                        Thông tin tài khoản và dữ liệu liên quan đến quá trình sử dụng hệ thống.
                    </li>
                    <li style={styles.listItem}>
                        Thông tin giao dịch giữa người mua và người bán.
                    </li>
                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>2. Mục đích sử dụng thông tin</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Cung cấp và vận hành các chức năng của hệ thống.
                    </li>
                    <li style={styles.listItem}>
                        Hỗ trợ người dùng khi phát sinh vấn đề hoặc tranh chấp.
                    </li>
                    <li style={styles.listItem}>
                        Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.
                    </li>
                    <li style={styles.listItem}>
                        Đảm bảo an toàn và bảo mật cho hệ thống.
                    </li>
                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>3. Bảo mật thông tin</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý để bảo vệ
                        dữ liệu người dùng khỏi truy cập trái phép.
                    </li>
                    <li style={styles.listItem}>
                        Thông tin cá nhân của người dùng sẽ không được tiết lộ cho bên
                        thứ ba nếu không có sự đồng ý của người dùng, trừ khi có yêu
                        cầu từ cơ quan có thẩm quyền theo quy định pháp luật.
                    </li>
                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>4. Quyền của người dùng</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Người dùng có quyền kiểm tra và cập nhật thông tin cá nhân của mình.
                    </li>
                    <li style={styles.listItem}>
                        Người dùng có thể yêu cầu hỗ trợ hoặc phản hồi liên quan đến
                        việc bảo mật thông tin.
                    </li>
                </ul>

            </div>

            <div style={styles.note}>
                Lưu ý: Chính sách bảo mật có thể được cập nhật nhằm phù hợp với quy định
                của hệ thống và pháp luật hiện hành.
            </div>

        </div>
    );
}

const styles = {

    container: {
        maxWidth: "850px",
        margin: "0 auto",
        padding: "24px",
        lineHeight: "1.7"
    },

    title: {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "15px",
        color: "#222"
    },

    description: {
        fontSize: "16px",
        marginBottom: "20px",
        color: "#555"
    },

    section: {
        background: "#f9fafb",
        padding: "22px",
        borderRadius: "8px",
        border: "1px solid #eee",
        marginBottom: "20px"
    },

    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "12px"
    },

    list: {
        paddingLeft: "20px"
    },

    listItem: {
        marginBottom: "10px",
        fontSize: "16px",
        color: "#444"
    },

    note: {
        fontSize: "14px",
        color: "#777",
        fontStyle: "italic"
    }

};

export default Privacy;