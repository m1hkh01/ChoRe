function Contact() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Liên hệ</h1>

            <p style={styles.description}>
                Nếu bạn cần hỗ trợ hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi
                qua các thông tin dưới đây:
            </p>

            <div style={styles.box}>

                <div style={styles.row}>
                    <span style={styles.label}>Email:</span>
                    <span style={styles.value}>support@gmail.com</span>
                </div>

                <div style={styles.row}>
                    <span style={styles.label}>Điện thoại:</span>
                    <span style={styles.value}>1900 xxxx</span>
                </div>

                <div style={styles.row}>
                    <span style={styles.label}>Địa chỉ:</span>
                    <span style={styles.value}>Biên Hòa, Đồng Nai, Việt Nam</span>
                </div>

                <div style={styles.row}>
                    <span style={styles.label}>Giờ làm việc:</span>
                    <span style={styles.value}>08:00 - 22:00 (Hàng ngày)</span>
                </div>

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

    box: {
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "6px",
        border: "1px solid #eee"
    },

    row: {
        marginBottom: "12px",
        fontSize: "16px"
    },

    label: {
        fontWeight: "600",
        marginRight: "8px",
        color: "#333"
    },

    value: {
        color: "#555"
    }

};

export default Contact;