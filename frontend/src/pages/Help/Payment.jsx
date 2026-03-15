function Payment() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Chính sách thanh toán</h1>

            <p style={styles.description}>
                Nền tảng hỗ trợ kết nối người mua và người bán. Hai bên có thể tự
                thỏa thuận phương thức thanh toán phù hợp trong quá trình giao dịch.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Các phương thức thanh toán</h3>

                <ul style={styles.list}>

                    <li style={styles.listItem}>
                        Thanh toán chuyển khoản ngân hàng khi giao dịch thông qua hệ thống.
                    </li>

                    <li style={styles.listItem}>
                        Thanh toán tiền mặt trực tiếp khi người mua và người bán gặp mặt.
                    </li>

                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Lưu ý khi thanh toán</h3>

                <ul style={styles.list}>

                    <li style={styles.listItem}>
                        Người mua nên kiểm tra kỹ thông tin sản phẩm trước khi thực hiện thanh toán.
                    </li>

                    <li style={styles.listItem}>
                        Chỉ thực hiện thanh toán khi đã xác nhận rõ thông tin người bán
                        và điều kiện giao dịch.
                    </li>

                    <li style={styles.listItem}>
                        Trong trường hợp phát sinh tranh chấp, người dùng có thể gửi
                        yêu cầu hỗ trợ để hệ thống xem xét và xử lý theo quy định.
                    </li>

                </ul>

            </div>

            <div style={styles.note}>
                Lưu ý: Nền tảng đóng vai trò trung gian kết nối người mua và người bán,
                chỉ trực tiếp thực hiện hoặc giữ tiền thanh toán giữa các bên nếu chọn 
                giao dịch trung gian qua hệ thống.
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

export default Payment;