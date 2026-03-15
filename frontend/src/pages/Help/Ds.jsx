function Ds() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Chính sách giải quyết tranh chấp</h1>

            <p style={styles.description}>
                Khi phát sinh tranh chấp trong quá trình giao dịch, hệ thống khuyến khích
                người mua và người bán chủ động trao đổi để tìm ra phương án giải quyết
                phù hợp. Trong trường hợp hai bên không thể tự thống nhất, hệ thống sẽ
                tiến hành xem xét và xử lý theo quy định.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>Quy trình xử lý tranh chấp</h3>

                <ol style={styles.list}>

                    <li style={styles.listItem}>
                        Người mua và người bán chủ động liên hệ với nhau để trao đổi và
                        thống nhất phương án giải quyết tranh chấp.
                    </li>

                    <li style={styles.listItem}>
                        Trong trường hợp hai bên không đạt được thỏa thuận, tranh chấp
                        có thể được gửi đến hệ thống để được hỗ trợ xử lý.
                    </li>

                    <li style={styles.listItem}>
                        Hai bên cần cung cấp các thông tin, bằng chứng liên quan đến
                        giao dịch (hình ảnh, tin nhắn, nội dung trao đổi,...).
                    </li>

                    <li style={styles.listItem}>
                        Hệ thống sẽ xem xét các quy định hiện hành cùng với các bằng
                        chứng được cung cấp để đánh giá tình huống tranh chấp.
                    </li>

                    <li style={styles.listItem}>
                        Quản trị viên (Admin) sẽ là người đưa ra quyết định cuối cùng
                        dựa trên các thông tin và bằng chứng từ hai bên.
                    </li>

                </ol>

            </div>

            <div style={styles.note}>
                Lưu ý: Nền tảng đóng vai trò là hệ thống trung gian hỗ trợ kết nối và
                giải quyết tranh chấp khi cần thiết. Người mua và người bán cần cung
                cấp thông tin trung thực và hợp tác trong quá trình xử lý.
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
        color: "#555",
        marginBottom: "20px"
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
        marginBottom: "12px",
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