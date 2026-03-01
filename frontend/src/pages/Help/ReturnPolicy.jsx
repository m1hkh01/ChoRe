function ReturnPolicy() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Chính sách đổi trả</h1>

            <p style={styles.description}>
                Người mua có thể yêu cầu đổi trả sản phẩm trong trường hợp sản phẩm không đúng mô tả hoặc bị lỗi.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Điều kiện đổi trả</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>Sản phẩm bị lỗi</li>
                    <li style={styles.listItem}>Không đúng mô tả</li>
                    <li style={styles.listItem}>Hai bên đồng ý đổi trả</li>
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

export default ReturnPolicy;