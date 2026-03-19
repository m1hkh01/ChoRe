import { useEffect, useState } from "react";
import api from "@/api";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .pr-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* ── Summary bar ── */
  .pr-summary {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  .pr-avg {
    font-size: 36px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1;
  }

  .pr-summary-right {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pr-summary-stars { display: flex; gap: 2px; }

  .pr-summary-count {
    font-size: 12px;
    color: #94a3b8;
  }

  /* ── Stars ── */
  .pr-stars { display: inline-flex; gap: 2px; }

  .pr-star {
    font-size: 14px;
    color: #e2e8f0;
    line-height: 1;
  }
  .pr-star.on { color: #f59e0b; }

  /* ── List ── */
  .pr-list { display: flex; flex-direction: column; gap: 8px; }

  /* ── Card ── */
  .pr-card {
    display: flex;
    gap: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    align-items: flex-start;
    transition: border-color 0.15s;
  }
  .pr-card:hover { border-color: #cbd5e1; }

  .pr-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #f1f5f9;
  }

  .pr-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .pr-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
  }

  .pr-top-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .pr-name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }

  .pr-date {
    font-size: 11px;
    color: #94a3b8;
  }

  .pr-comment {
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    margin: 0;
    background: #f8fafc;
    border-left: 3px solid #e2e8f0;
    border-radius: 0 8px 8px 0;
    padding: 8px 12px;
  }

  /* ── Empty ── */
  .pr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 56px 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    text-align: center;
  }

  .pr-empty-icon {
    font-size: 36px;
    opacity: 0.25;
    color: #f59e0b;
  }

  .pr-empty p { margin: 0; font-size: 14px; font-weight: 500; color: #475569; }

  /* ── Load more ── */
  .pr-more { display: flex; justify-content: center; }

  .pr-more-btn {
    padding: 8px 24px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pr-more-btn:hover    { border-color: #22c55e; color: #16a34a; background: #f0fdf4; }
  .pr-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .pr-summary { padding: 12px 14px; gap: 10px; }
    .pr-avg     { font-size: 28px; }
    .pr-card    { padding: 12px; gap: 10px; }
    .pr-avatar  { width: 34px; height: 34px; }
    .pr-name    { font-size: 12px; }
    .pr-comment { font-size: 12px; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
const UPLOADS   = "https://api.chore123.cloud/uploads/";

// ─── Stars component ──────────────────────────────────────────────────────────

function Stars({ count, size = 14 }) {
  return (
    <span className="pr-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`pr-star ${i < count ? "on" : ""}`}
          style={{ fontSize: size }}>★</span>
      ))}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileRatings({ userId }) {
  const [ratings, setRatings] = useState([]);
  const [page,    setPage]    = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [total,   setTotal]   = useState(0);
  const [avg,     setAvg]     = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (p, reset = false) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/profile/users/${userId}/ratings`, {
        params: { page: p, pageSize: PAGE_SIZE },
      });
      setRatings(prev => reset ? data.items : [...prev, ...data.items]);
      setHasNext(data.hasNext);
      setTotal(data.total);
      setPage(p);

      // Tính avg từ toàn bộ items đã load
      if (reset && data.items.length > 0) {
        const sum = data.items.reduce((s, r) => s + r.stars, 0);
        setAvg(Math.round((sum / data.items.length) * 10) / 10);
      }
    } catch (e) {
      console.error("Load ratings error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, true); }, [userId]);

  const fmt = (d) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <>
      <style>{CSS}</style>
      <div className="pr-wrap">

        {/* Summary */}
        {total > 0 && (
          <div className="pr-summary">
            <span className="pr-avg">{avg.toFixed(1)}</span>
            <div className="pr-summary-right">
              <div className="pr-summary-stars">
                <Stars count={Math.round(avg)} size={18} />
              </div>
              <span className="pr-summary-count">{total} đánh giá</span>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && ratings.length === 0 && (
          <div className="pr-empty">
            <div className="pr-empty-icon">★</div>
            <p>Chưa có đánh giá nào</p>
          </div>
        )}

        {/* List */}
        <div className="pr-list">
          {ratings.map(r => (
            <div key={r.ratingId} className="pr-card">
              <img
                src={r.raterAvatar ? `${UPLOADS}${r.raterAvatar}` : "/default-avatar.png"}
                alt={r.raterFullName}
                className="pr-avatar"
              />
              <div className="pr-body">
                <div className="pr-top">
                  <div className="pr-top-left">
                    <span className="pr-name">{r.raterFullName}</span>
                    <Stars count={r.stars} />
                  </div>
                  <span className="pr-date">{fmt(r.createAt)}</span>
                </div>
                {r.comment && <p className="pr-comment">{r.comment}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasNext && (
          <div className="pr-more">
            <button
              className="pr-more-btn"
              onClick={() => load(page + 1)}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Xem thêm"}
            </button>
          </div>
        )}

      </div>
    </>
  );
}