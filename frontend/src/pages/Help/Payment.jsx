function Payment() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Phương thức thanh toán</h1>

            <p style={styles.description}>
                Người mua và người bán có thể thỏa thuận các phương thức thanh toán phù hợp.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Các phương thức phổ biến</h3>

                <ul style={styles.list}>

                    <li style={styles.listItem}>
                        Thanh toán khi nhận hàng (COD)
                    </li>

                    <li style={styles.listItem}>
                        Chuyển khoản ngân hàng
                    </li>

                    <li style={styles.listItem}>
                        Thanh toán trực tiếp khi gặp mặt
                    </li>

                </ul>

            </div>

            <div style={styles.note}>
                Khuyến nghị: Luôn kiểm tra sản phẩm trước khi thanh toán.
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

    list: {
        paddingLeft: "20px"
    },

    listItem: {
        marginBottom: "10px",
        fontSize: "16px"
    },

    note: {
        fontSize: "14px",
        color: "#777"
    }

};

export default Payment;