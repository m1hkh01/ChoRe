function Ds() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Giải quyết tranh chấp</h1>

            <p style={styles.description}>
                Chúng tôi luôn khuyến khích người mua và người bán tự thỏa thuận để giải quyết
                các vấn đề phát sinh trong quá trình giao dịch.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Quy trình giải quyết tranh chấp</h3>

                <ul style={styles.list}>

                    <li style={styles.listItem}>
                        Người mua liên hệ trực tiếp với người bán để trao đổi vấn đề
                    </li>

                    <li style={styles.listItem}>
                        Hai bên cung cấp thông tin và bằng chứng liên quan
                    </li>

                    <li style={styles.listItem}>
                        Thỏa thuận phương án giải quyết phù hợp
                    </li>

                    <li style={styles.listItem}>
                        Trong trường hợp cần thiết, hệ thống sẽ hỗ trợ xử lý
                    </li>

                </ul>

            </div>

            <div style={styles.note}>
                Lưu ý: Chúng tôi đóng vai trò là nền tảng trung gian kết nối người mua và người bán.
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
        color: "#555",
        marginBottom: "20px"
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

export default Ds;