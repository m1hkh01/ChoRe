import { useNavigate } from "react-router-dom";
import { CircleAlert, Zap, FileText, RefreshCw, Star } from "lucide-react";
import { useAuthStore } from "../../store/auth";
import useFetch from "../../Hooks/useFetch";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .spm {
    min-height: 100vh;
    background: #f1f5f9;
    padding: 40px 20px 60px;
  }

  .spm-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── Header ── */
  .spm-header { text-align: center; }

  .spm-title {
    font-size: 30px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
  }

  .spm-sub {
    font-size: 15px;
    color: #94a3b8;
    margin: 0;
  }

  /* ── Main grid ── */
  .spm-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── Plan card ── */
  .spm-plan {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
  }

  .spm-plan-head {
    background: linear-gradient(135deg, #16a34a, #22c55e);
    padding: 20px;
    position: relative;
  }

  .spm-plan-name {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 4px;
  }

  .spm-plan-price {
    font-size: 15px;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  .spm-plan-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255,255,255,0.2);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    border-radius: 999px;
    padding: 3px 10px;
    border: 1px solid rgba(255,255,255,0.3);
  }

  .spm-plan-body { padding: 20px; }

  .spm-section-label {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
    margin: 0 0 12px;
  }

  .spm-desc {
    font-size: 15px;
    color: #475569;
    margin: 0 0 20px;
    line-height: 1.6;
  }

  /* ── Benefits ── */
  .spm-benefits { display: flex; flex-direction: column; gap: 0; }

  .spm-benefit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    gap: 12px;
  }
  .spm-benefit:last-child { border-bottom: none; }

  .spm-benefit-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: #374151;
  }

  .spm-benefit-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: #f0fdf4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #16a34a;
  }

  .spm-benefit-val {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
  }

  .spm-benefit-val.zero { color: #94a3b8; font-weight: 500; }

  /* ── Progress bar ── */
  .spm-bar-wrap { margin-top: 4px; }

  .spm-bar-track {
    height: 4px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
    margin-top: 5px;
  }

  .spm-bar-fill {
    height: 100%;
    background: #22c55e;
    border-radius: 999px;
    transition: width 0.4s ease;
  }

  .spm-bar-fill.low { background: #f59e0b; }
  .spm-bar-fill.empty { background: #e2e8f0; }

  /* ── Upgrade card ── */
  .spm-upgrade {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }

  .spm-upgrade-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fef9c3, #fef08a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #854d0e;
  }

  .spm-upgrade h3 {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .spm-upgrade p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }

  .spm-upgrade-btn {
    width: 100%;
    padding: 12px;
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, transform 0.12s;
  }
  .spm-upgrade-btn:hover  { background: #16a34a; }
  .spm-upgrade-btn:active { transform: scale(0.98); }

  /* ── Warning banner ── */
  .spm-warn {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fefce8;
    border: 1px solid #fde047;
    border-radius: 12px;
    padding: 14px 16px;
    color: #854d0e;
    font-size: 15px;
    line-height: 1.6;
  }

  .spm-warn svg { flex-shrink: 0; margin-top: 2px; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .spm          { padding: 24px 12px 48px; }
    .spm-grid     { grid-template-columns: 1fr; }
    .spm-title    { font-size: 18px; }
    .spm-plan-head { padding: 16px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(used, max) {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.round((used / max) * 100));
}

function barCls(p) {
  if (p === 0) return "empty";
  if (p <= 25) return "low";
  return "";
}

// ─── Benefit row with progress ────────────────────────────────────────────────

function Benefit({ icon: Icon, label, used, max }) {
  const p = pct(used, max);
  const cls = barCls(p);
  const val = max == null ? "—" : max === 0 ? "0 lần" : `${used} / ${max} lần`;

  return (
    <div className="spm-benefit">
      <div className="spm-benefit-left">
        <div className="spm-benefit-icon"><Icon size={14} /></div>
        <div>
          <div>{label}</div>
          {max > 0 && (
            <div className="spm-bar-wrap">
              <div className="spm-bar-track">
                <div className={`spm-bar-fill ${cls}`} style={{ width: `${p}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <span className={`spm-benefit-val ${max === 0 ? "zero" : ""}`}>{val}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServicePackageManager() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data } = useFetch(`/api/package/${user.userId}`);

  const plan = data?.subscriptionPlanDto;

  const fmtPrice = (price, days) => {
    if (!price) return "Miễn phí";
    return `${price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} / ${days} ngày`;
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="spm">
        <div className="spm-inner">

          {/* Header */}
          <div className="spm-header">
            <h1 className="spm-title">Gói dịch vụ của bạn</h1>
            <p className="spm-sub">Quản lý và nâng cấp gói để đăng tin hiệu quả hơn</p>
          </div>

          {/* Main grid */}
          <div className="spm-grid">

            {/* Left — current plan */}
            <div className="spm-plan">
              <div className="spm-plan-head">
                <p className="spm-plan-name">{plan?.subPlanName ?? "—"}</p>
                <p className="spm-plan-price">{fmtPrice(plan?.price, plan?.durationDays)}</p>
                <span className="spm-plan-badge">Hiện tại</span>
              </div>

              <div className="spm-plan-body">
                {plan?.title && (
                  <>
                    <p className="spm-section-label">Mô tả</p>
                    <p className="spm-desc">{plan.title}</p>
                  </>
                )}

                <p className="spm-section-label">Quyền lợi</p>
                <div className="spm-benefits">
                  <Benefit
                    icon={FileText}
                    label="Đăng tin miễn phí"
                    used={data?.remainingFreePost ?? 0}
                    max={plan?.maxFreePost ?? 0}
                  />
                  <Benefit
                    icon={RefreshCw}
                    label="Đăng tin trong tháng"
                    used={data?.remainingSubPost ?? 0}
                    max={plan?.maxPost ?? 0}
                  />
                  <Benefit
                    icon={Star}
                    label="Đăng tin nổi bật"
                    used={data?.remainingFeaturedPosts ?? 0}
                    max={plan?.maxFeaturedPosts ?? 0}
                  />
                  <Benefit
                    icon={Zap}
                    label="Giao dịch trung gian"
                    used={data?.remainingSubFPF ?? 0}
                    max={plan?.maxFreePlatform ?? 0}
                  />
                </div>
              </div>
            </div>

            {/* Right — upgrade */}
            <div className="spm-upgrade">
              <div className="spm-upgrade-icon">
                <Zap size={24} />
              </div>
              <h3>Nâng cấp gói</h3>
              <p>
                Đăng tin không giới hạn, ưu tiên hiển thị và nhiều tính năng
                độc quyền dành cho người bán chuyên nghiệp.
              </p>
              <button className="spm-upgrade-btn" onClick={() => navigate("/service-package")}>
                Xem các gói
              </button>
            </div>

          </div>

          {/* Warning */}
          <div className="spm-warn">
            <CircleAlert size={18} />
            <span>
              Lưu ý: Nếu bạn không gia hạn gói PRO, tài khoản sẽ tự động
              chuyển về gói mặc định (ChoRe Free) khi hết hạn.
            </span>
          </div>

        </div>
      </div>
    </>
  );
}