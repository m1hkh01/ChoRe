import { useEffect, useState } from "react";
import api from "@/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
const UPLOADS = "https://api.chore123.cloud/uploads/";

// ─── Stars component ──────────────────────────────────────────────────────────

function Stars({ count, size = 14 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-${size} ${i < count ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Image Preview Modal ──────────────────────────────────────────────────────

function ImageModal({ images, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-white text-4xl!"
        >
          ×
        </button>
        <img
          src={`${UPLOADS}${images[index].fileUrl}`}
          alt="Review"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "http://localhost:5121/uploads/reviews/" + images[index].fileUrl;
          }}
          className="max-w-full max-h-full object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex((index - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((index + 1) % images.length)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileRatings({ userId }) {
  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, 5star, hasImage, purchased
  const [modalImages, setModalImages] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  const load = async (p, reset = false) => {
    if (loading) return; // ❗ chặn spam
    setLoading(true);
    try {
      const params = { page: p, pageSize: PAGE_SIZE };
      if (filter === "5star") params.rating = 5;
      if (filter === "hasImage") params.hasImage = true;
      if (filter === "purchased") params.reviewType = 1; // Assuming 1 is CompletedOrder

      const { data } = await api.get(`/api/profile/users/${userId}/ratings`, { params });
      console.log("Review", data);
      setRatings(prev => reset ? data.items : [...prev, ...data.items]);
      setHasNext(data.hasNext);
      setTotal(data.total);
      setPage(p);

      // Calculate avg from all loaded items
      if (reset && data.items.length > 0) {
        const sum = data.items.reduce((s, r) => s + r.rating, 0);
        setAvg(Math.round((sum / data.items.length) * 10) / 10);
      }
    } catch (e) {
      console.error("Load ratings error:", e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, true);
  }, [userId, filter]);

  const fmt = (d) => new Date(d).toLocaleDateString("vi-VN");

  const openModal = (images, index) => {
    setModalImages(images);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalImages(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Filters */}
      <div className="flex gap-1">
        <button
          onClick={() => setFilter("all")}
          className={`p-[5px_14px]! h-max! rounded-full! text-[12px]! font-bold! 
            ${filter === "all" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 border"}
            hover:border-green-600! hover:text-green-600  
          `}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter("5star")}
          className={`p-[5px_14px]! h-max! rounded-full! text-[12px]! font-bold! 
            ${filter === "5star" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 border"}
           hover:border-green-600! hover:text-green-600  `}
        >
          5 sao
        </button>
        <button
          onClick={() => setFilter("hasImage")}
          className={`p-[5px_14px]! h-max! rounded-full! text-[12px]! font-bold! 
              ${filter === "hasImage" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500  border"}
              hover:border-green-600! hover:text-green-600 `}
        >
          Có ảnh
        </button>
        <button
          onClick={() => setFilter("purchased")}
          className={`p-[5px_14px]! h-max! rounded-full! text-[12px]! font-bold!
            ${filter === "purchased" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 border"}
            hover:border-green-600! hover:text-green-600
             `}
        >
          Đã mua
        </button>
      </div>

      {/* Summary */}
      {/* {total > 0 && (
        <div className="sticky top-0 bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 shadow-sm">
          <span className="text-4xl font-bold text-gray-900">{avg.toFixed(1)}</span>
          <div className="flex flex-col gap-1">
            <Stars count={Math.round(avg)} size={18} />
            <span className="text-sm text-gray-500">{total} đánh giá</span>
          </div>
        </div>
      )} */}

      {/* Empty */}
      {!loading && ratings.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 bg-white border border-gray-200 rounded-lg text-center">
          <span className="text-4xl text-yellow-400 opacity-25">★</span>
          <p className="text-gray-600 font-medium">Chưa có đánh giá nào</p>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {ratings.map(r => (
          <div key={r.reviewId} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3 hover:shadow-md transition-shadow">
            {
              <img
                src={r.reviewer.avatar ? `${UPLOADS}${r.reviewer.avatar}` : "/default-avatar.png"}
                alt={r.reviewer.fullName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            }
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">{r.reviewer.fullName}</span>
                  <Stars count={r.rating} />
                  {r.reviewType === "CompletedOrder" && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Đã mua hàng
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{fmt(r.createdAt)}</span>
              </div>
              {/* Tags */}
              {r.reviewTags && r.reviewTags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {r.reviewTags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag.tag}
                    </span>
                  ))}
                </div>
              )}
              {r.comment && (
                <p className="text-sm text-gray-700 bg-gray-50 border-l-4 border-gray-200 rounded-r-lg p-3 mb-0 line-clamp-3">
                  {r.comment}
                </p>
              )}
              
              {/* Images */}
              {r.reviewImages && r.reviewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {r.reviewImages.slice(0, 6).map((img, idx) => (
                    <div key={idx} className="relative cursor-pointer" onClick={() => openModal(r.reviewImages, idx)}>
                      <img
                        src={`${UPLOADS}${img.fileUrl}`}
                        alt="Review"
                        className="w-1/4 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "http://localhost:5121/uploads/reviews/" + img.fileUrl;
                        }}
                      />
                      {img.fileType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <span className="text-white text-lg">▶</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {r.reviewImages.length > 6 && (
                    <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-600">
                      +{r.reviewImages.length - 6}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasNext && (
        <div className="flex justify-center">
          <button
            className="px-6 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-semibold hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => load(page + 1)}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}

      {/* Modal */}
      {modalImages && (
        <ImageModal images={modalImages} currentIndex={modalIndex} onClose={closeModal} />
      )}
    </div>
  );
}