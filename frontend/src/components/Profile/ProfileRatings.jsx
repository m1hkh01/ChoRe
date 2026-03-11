import { useEffect, useState } from "react";
import api from "@/api";

function Stars({ count }) {
    return (
        <span className="pf-stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`pf-star ${i < count ? "pf-star--on" : ""}`}>★</span>
            ))}
        </span>
    );
}

export default function ProfileRatings({ userId }) {
    const [ratings, setRatings] = useState([]);
    const [page,    setPage]    = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [total,   setTotal]   = useState(0);
    const [loading, setLoading] = useState(false);

    const load = async (p, reset) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/profile/${userId}/ratings`, {
                params: { page: p, pageSize: 10 },
            });
            setRatings(prev => reset ? res.data.items : [...prev, ...res.data.items]);
            setHasNext(res.data.hasNext);
            setTotal(res.data.total);
            setPage(p);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(1, true); }, [userId]);

    return (
        <div className="pf-ratings">
            <p className="pf-count">{total} đánh giá</p>

            {!loading && ratings.length === 0 && (
                <div className="pf-empty">
                    <div className="pf-empty-icon">⭐</div>
                    <p>Chưa có đánh giá nào</p>
                </div>
            )}

            <div className="pf-ratings-list">
                {ratings.map(r => (
                    <div key={r.ratingId} className="pf-rating-item">
                        <img
                            src={r.raterAvatar
                                ? `https://api.chore123.cloud/uploads/${r.raterAvatar}`
                                : "/default-avatar.png"}
                            alt={r.raterFullName}
                            className="pf-rater-avatar"
                        />
                        <div className="pf-rating-body">
                            <div className="pf-rating-top">
                                <span className="pf-rater-name">{r.raterFullName}</span>
                                <Stars count={r.stars} />
                                <span className="pf-rating-date">
                                    {new Date(r.createAt).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            {r.comment && <p className="pf-rating-cmt">{r.comment}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {hasNext && (
                <div className="pf-load-more">
                    <button
                        className="pf-load-btn"
                        onClick={() => load(page + 1, false)}
                        disabled={loading}
                    >
                        {loading ? "Đang tải..." : "Xem thêm"}
                    </button>
                </div>
            )}
        </div>
    );
}