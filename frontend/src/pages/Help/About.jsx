function About() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Giới thiệu</h1>

            <p style={styles.text}>
                Chúng tôi là nền tảng mua bán trực tuyến giúp kết nối người mua và người bán
                trên toàn quốc. Hệ thống được xây dựng nhằm mang đến trải nghiệm giao dịch
                nhanh chóng, an toàn và tiện lợi.
            </p>

            <p style={styles.text}>
                Người dùng có thể dễ dàng đăng tin bán sản phẩm, tìm kiếm sản phẩm theo nhu cầu
                và liên hệ trực tiếp với người bán thông qua hệ thống.
            </p>

            <p style={styles.text}>
                Mục tiêu của chúng tôi là tạo ra một môi trường giao dịch minh bạch, hiệu quả
                và đáng tin cậy cho tất cả mọi người.
            </p>

        </div>
    );
}

const styles = {

    container: {
        maxWidth: "800px",
        lineHeight: "1.6"
    },

    title: {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "20px",
        color: "#222"
    },

    text: {
        fontSize: "16px",
        color: "#444",
        marginBottom: "16px"
    }

};

export default About;