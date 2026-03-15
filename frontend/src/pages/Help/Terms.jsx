function Terms() {
    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Điều khoản sử dụng</h1>

            <p style={styles.description}>
                Khi truy cập và sử dụng hệ thống, người dùng đồng ý tuân thủ các điều khoản
                và quy định được nêu dưới đây. Các điều khoản này nhằm đảm bảo môi trường
                giao dịch minh bạch, an toàn và lành mạnh cho tất cả người dùng.
            </p>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>1. Quy định chung</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Người dùng phải cung cấp thông tin chính xác khi đăng ký và sử dụng hệ thống.
                    </li>
                    <li style={styles.listItem}>
                        Không đăng tải nội dung vi phạm pháp luật, nội dung lừa đảo hoặc gây hiểu nhầm.
                    </li>
                    <li style={styles.listItem}>
                        Không sử dụng hệ thống cho mục đích gian lận, spam hoặc gây ảnh hưởng đến hệ thống và người dùng khác.
                    </li>
                    <li style={styles.listItem}>
                        Người dùng chịu trách nhiệm hoàn toàn về nội dung, sản phẩm hoặc thông tin đã đăng tải.
                    </li>
                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>2. Trách nhiệm của người dùng</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Tự kiểm tra và xác nhận thông tin sản phẩm trước khi thực hiện giao dịch.
                    </li>
                    <li style={styles.listItem}>
                        Tôn trọng các quy định của hệ thống và hợp tác trong trường hợp cần xử lý tranh chấp.
                    </li>
                    <li style={styles.listItem}>
                        Không sử dụng tài khoản của người khác hoặc thực hiện hành vi gây ảnh hưởng đến hệ thống.
                    </li>
                </ul>

            </div>

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>3. Quyền của hệ thống</h3>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Hệ thống có quyền kiểm tra, chỉnh sửa hoặc gỡ bỏ các nội dung vi phạm quy định.
                    </li>
                    <li style={styles.listItem}>
                        Hệ thống có quyền tạm khóa hoặc chấm dứt tài khoản đối với các trường hợp vi phạm điều khoản sử dụng.
                    </li>
                    <li style={styles.listItem}>
                        Trong trường hợp cần thiết, hệ thống có thể hỗ trợ xử lý tranh chấp giữa người mua và người bán.
                    </li>
                </ul>

            </div>

            <div style={styles.note}>
                Lưu ý: Các điều khoản này có thể được cập nhật hoặc điều chỉnh nhằm phù hợp
                với quy định của hệ thống và pháp luật hiện hành.
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

export default Terms;