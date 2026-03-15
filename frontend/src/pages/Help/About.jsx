// ─── Data ─────────────────────────────────────────────────────────────────────

const MEMBERS = [
  { name: "Nguyễn Minh Khôi",       role: "Team Leader, FE / BE / DB / Deploy" },
  { name: "Nguyễn Cự Nhật",         role: "FE / BE / DB / Deploy" },
  { name: "Nguyễn Đình Toàn",       role: "Basic FE / BE" },
  { name: "Hồ Minh Quân",           role: "Test Team Leader, QA" },
  { name: "Đoàn Nguyễn Đoan Trang", role: "Tester, Product Improvement Feedback" },
  { name: "Ngô Thụy Kim Ngân",      role: "Tester, User Experience Feedback" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .ab { line-height: 1.7; }

  .ab-title {
    font-size: 26px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 20px;
  }

  .ab-text {
    font-size: 15px;
    color: #475569;
    margin: 0 0 14px;
  }

  .ab-section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 36px 0 8px;
  }

  .ab-section-desc {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 20px;
    line-height: 1.7;
  }

  /* ── Member grid ── */
  .ab-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .ab-card {
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
    text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ab-card:hover { border-color: #22c55e; box-shadow: 0 2px 8px rgba(34,197,94,0.1); }

  .ab-name { font-size: 14px; font-weight: 600; color: #111827; }
  .ab-role { font-size: 12px; color: #94a3b8; margin-top: 4px; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .ab-title        { font-size: 20px; }
    .ab-section-title { font-size: 16px; }
    .ab-grid         { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  }

  @media (max-width: 400px) {
    .ab-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <>
      <style>{CSS}</style>
      <div className="ab">

        <h1 className="ab-title">Giới thiệu</h1>

        <p className="ab-text">
          Chúng tôi xây dựng một nền tảng mua bán trực tuyến nhằm kết nối người mua
          và người bán trên toàn quốc. Hệ thống được thiết kế với mục tiêu mang đến
          trải nghiệm giao dịch nhanh chóng, thuận tiện và an toàn cho người dùng.
        </p>

        <p className="ab-text">
          Thông qua nền tảng, người dùng có thể dễ dàng đăng tin bán sản phẩm,
          tìm kiếm sản phẩm phù hợp với nhu cầu và liên hệ trực tiếp với người bán.
          Hệ thống hướng tới việc đơn giản hóa quá trình giao dịch và tạo ra
          một môi trường mua bán hiệu quả.
        </p>

        <p className="ab-text">
          Mục tiêu của dự án là xây dựng một môi trường giao dịch minh bạch,
          đáng tin cậy và dễ tiếp cận, đồng thời liên tục cải tiến hệ thống
          dựa trên phản hồi và trải nghiệm thực tế của người dùng.
        </p>

        <h2 className="ab-section-title">Thành viên dự án</h2>

        <p className="ab-section-desc">
          Dự án được thực hiện bởi nhóm sinh viên với các vai trò khác nhau.
          Ngoài việc kiểm thử chức năng hệ thống, các thành viên Tester còn
          tích cực đóng góp ý kiến nhằm cải thiện trải nghiệm người dùng
          và đề xuất các hướng phát triển cho dự án.
        </p>

        <div className="ab-grid">
          {MEMBERS.map((m, i) => (
            <div key={i} className="ab-card">
              <div className="ab-name">{m.name}</div>
              <div className="ab-role">{m.role}</div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}