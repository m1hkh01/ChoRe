function Helpcenter() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Trung tâm trợ giúp</h1>

            <p style={styles.description}>
                Trung tâm trợ giúp cung cấp thông tin và hướng dẫn giúp bạn sử dụng hệ thống
                một cách hiệu quả.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Các bước mua hàng</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Tìm kiếm và chọn sản phẩm bạn muốn mua
                    </li>

                    <li style={styles.listItem}>
                        Liên hệ trực tiếp với người bán
                    </li>

                    <li style={styles.listItem}>
                        Thỏa thuận và tiến hành giao dịch
                    </li>

                    <li style={styles.listItem}>
                        Nhận sản phẩm và hoàn tất giao dịch
                    </li>
                </ul>

            </div>

        </div>
    );
}

const styles = {

    container: {
        maxWidth: "800px"
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
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "6px",
        border: "1px solid #eee"
    },

    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "10px"
    },

    list: {
        paddingLeft: "20px"
    },

    listItem: {
        marginBottom: "10px",
        fontSize: "16px",
        color: "#444"
    }

};

export default Helpcenter;