function Terms() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Điều khoản sử dụng</h1>

            <p style={styles.description}>
                Khi sử dụng hệ thống, bạn đồng ý tuân thủ các điều khoản và quy định sau.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Quy định chung</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>Không đăng nội dung vi phạm pháp luật</li>
                    <li style={styles.listItem}>Không sử dụng hệ thống cho mục đích gian lận</li>
                    <li style={styles.listItem}>Chịu trách nhiệm về nội dung đã đăng</li>
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
        border: "1px solid #eee"
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

export default Terms;