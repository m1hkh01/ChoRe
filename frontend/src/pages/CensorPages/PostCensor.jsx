import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faXmark, faEye, faSearch,
  faSpinner, faInbox, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useCallback, useRef } from "react";
import PostPreviewModal from "@/pages/CensorPages/PostPreviewModal";
import { useAuthStore } from "@/store/auth";
import api from "@/api";

// ─── (CSS giữ nguyên từ PostManager — không thay đổi) ────────────────────────

const CSS = `
  .pm {
    --accent:       var(--primary-color);
    --accent-hover: var(--primary-color-hover);
    --success:      var(--success);
    --cancel:       var(--cancel);
    --preview:      var(--preview);
    // --bg:           #ffffff;
    --bg-page:      whitesmoke;
    // --border:       #e5e7eb;
    // --radius:       10px;
    // --radius-sm:    6px;
    --text:         #111827;
    --text-sub:     #6b7280;
    --text-xs:      #9ca3af;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 4px 20px rgba(0,0,0,0.10);
    --font:         'Inter', 'Segoe UI', sans-serif;
    --transition:   0.18s ease;
  }
  .pm {
    background: var(--bg); border-radius: var(--radius);
    box-shadow: var(--shadow-sm); border: 1px solid var(--border);
    overflow: hidden; font-family: var(--font); color: var(--text);
    margin-bottom: 600px;
  }
  .pm-header {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    gap: 12px; padding: 18px 24px; border-bottom: 1px solid var(--border);
  }
  .pm-title { font-size: 17px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .pm-title-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .pm-count { font-size: 12px; font-weight: 600; padding: 2px 9px; background: #f3f4f6; border: 1px solid var(--border); border-radius: 999px; color: var(--text-sub); }
  .pm-search-wrap { position: relative; flex-shrink: 0; }
  .pm-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text-xs); font-size: 13px; pointer-events: none; }
  .pm-search { padding: 7px 12px 7px 32px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 13px; font-family: var(--font); background: #f9fafb; color: var(--text); outline: none; width: 220px; transition: border-color var(--transition), box-shadow var(--transition); }
  .pm-search:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.12); background: #fff; }
  @media (max-width: 600px) { .pm-search { width: 100%; } .pm-search-wrap { width: 100%; } }
  .pm-table-wrap { overflow-x: auto; }
  table.pm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .pm-table thead tr { background: #f9fafb; border-bottom: 1px solid var(--border); }
  .pm-table th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-sub); white-space: nowrap; }
  .pm-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; color: var(--text); vertical-align: middle; }
  .pm-table tbody tr { transition: background var(--transition); }
  .pm-table tbody tr:hover { background: #fafafa; }
  .pm-table tbody tr:last-child td { border-bottom: none; }
  .pm-id { font-size: 12px; color: var(--text-xs); font-variant-numeric: tabular-nums; }
  .pm-post-title { font-weight: 500; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pm-username { display: flex; align-items: center; gap: 8px; }
  .pm-date { color: var(--text-sub); white-space: nowrap; font-size: 13px; }
  .pm-price { font-weight: 600; color: var(--accent); white-space: nowrap; font-variant-numeric: tabular-nums; }
  .pm-actions { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
  .pm-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; transition: all var(--transition); flex-shrink: 0; }
  .pm-btn-preview { background: #eff6ff; border-color: #bfdbfe; color: var(--preview, #2196f3); }
  .pm-btn-preview:hover { background: #dbeafe; }
  .pm-btn-accept { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
  .pm-btn-accept:hover { background: #dcfce7; }
  .pm-btn-reject { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .pm-btn-reject:hover { background: #fee2e2; }
  .pm-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 12px; color: var(--text-sub); }
  .pm-state-icon { font-size: 36px; opacity: 0.35; }
  .pm-state-text { font-size: 14px; font-weight: 500; }
  .pm-spinner { animation: pmSpin 0.8s linear infinite; }
  @keyframes pmSpin { to { transform: rotate(360deg); } }
  @media (max-width: 640px) { .pm-table-wrap { display: none; } .pm-cards { display: flex; flex-direction: column; gap: 0; } }
  @media (min-width: 641px) { .pm-cards { display: none; } }
  .pm-card { padding: 14px 18px; border-bottom: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 8px; transition: background var(--transition); }
  .pm-card:last-child { border-bottom: none; }
  .pm-card:hover { background: #fafafa; }
  .pm-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .pm-card-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.4; }
  .pm-card-price { font-size: 13px; font-weight: 700; color: var(--accent); white-space: nowrap; }
  .pm-card-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 12px; color: var(--text-sub); }
  .pm-card-actions { display: flex; gap: 8px; }
  .pm-card-actions .pm-btn { width: 36px; height: 36px; font-size: 14px; }
  .pm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(3px); z-index: 1800; display: flex; align-items: center; justify-content: center; padding: 16px; animation: pmFadeIn 0.15s ease; }
  @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .pm-modal { background: #fff; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.20); width: 100%; max-width: 420px; overflow: hidden; animation: pmSlideUp 0.2s cubic-bezier(0.16,1,0.3,1); }
  @keyframes pmSlideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .pm-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .pm-modal-title { font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .pm-modal-title-icon { color: #dc2626; }
  .pm-modal-close { width: 30px; height: 30px; border-radius: var(--radius-sm); background: #f3f4f6; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-sub); font-size: 13px; transition: background var(--transition); }
  .pm-modal-close:hover { background: #e5e7eb; }
  .pm-modal-body { padding: 20px; }
  .pm-modal-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-sub); letter-spacing: .04em; text-transform: uppercase; margin-bottom: 8px; }
  .pm-modal-select { width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 13.5px; font-family: var(--font); color: var(--text); background: #f9fafb; outline: none; transition: border-color var(--transition), box-shadow var(--transition); appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
  .pm-modal-select:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.10); background-color: #fff; }
  .pm-modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--border); background: #fafafa; }
  .pm-modal-btn { padding: 8px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; font-family: var(--font); cursor: pointer; border: 1px solid transparent; transition: all var(--transition); }
  .pm-modal-btn-cancel { background: #f3f4f6; border-color: var(--border); color: var(--text-sub); }
  .pm-modal-btn-cancel:hover { background: #e5e7eb; }
  .pm-modal-btn-confirm { background: #dc2626; border-color: #dc2626; color: #fff; }
  .pm-modal-btn-confirm:hover { background: #b91c1c; }
  .pm-modal-btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useDebounce(fn, delay = 300) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

const formatDate = (str) => {
  if (!str) return "—";
  const iso = str.endsWith("Z") ? str : str + "Z";
  return new Date(iso).toLocaleString("vi-VN");
};

const formatPrice = (price) =>
  Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActionButtons({ post, onPreview, onAccept, onReject }) {
  return (
    <div className="pm-actions">
      <button className="pm-btn pm-btn-preview" title="Xem trước" onClick={() => onPreview(post)}>
        <FontAwesomeIcon icon={faEye} />
      </button>
      <button className="pm-btn pm-btn-accept" title="Duyệt" onClick={() => onAccept(post.postId)}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
      <button className="pm-btn pm-btn-reject" title="Từ chối" onClick={() => onReject(post.postId)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

function PostRow({ post, index, onPreview, onAccept, onReject }) {
  return (
    <tr>
      <td className="pm-id">{index + 1}</td>
      <td><div className="pm-post-title" title={post.title}>{post.title}</div></td>
      <td><div className="pm-username">{post.user?.userName}</div></td>
      <td className="pm-date">{formatDate(post.createdAt)}</td>
      <td className="pm-price">{formatPrice(post.price)}</td>
      <td><ActionButtons post={post} onPreview={onPreview} onAccept={onAccept} onReject={onReject} /></td>
    </tr>
  );
}

function PostCard({ post, onPreview, onAccept, onReject }) {
  return (
    <div className="pm-card">
      <div className="pm-card-top">
        <div className="pm-card-title">{post.title}</div>
        <div className="pm-card-price">{formatPrice(post.price)}</div>
      </div>
      <div className="pm-card-meta">
        <span>{post.user?.userName}</span>
        <span>·</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      <div className="pm-card-actions">
        <ActionButtons post={post} onPreview={onPreview} onAccept={onAccept} onReject={onReject} />
      </div>
    </div>
  );
}

function RejectModal({ onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-modal" role="dialog" aria-modal="true">
        <div className="pm-modal-header">
          <div className="pm-modal-title">
            <FontAwesomeIcon icon={faTriangleExclamation} className="pm-modal-title-icon" />
            Lý do từ chối
          </div>
          <button className="pm-modal-close" onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="pm-modal-body">
          <label className="pm-modal-label" htmlFor="pm-reject-reason">Chọn lý do</label>
          <select id="pm-reject-reason" className="pm-modal-select" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">— Chọn lý do —</option>
            <option value="Vi phạm quy định">Vi phạm quy định</option>
            <option value="Ảnh không hợp lệ">Ảnh không hợp lệ</option>
            <option value="Sản phẩm bị cấm">Sản phẩm bị cấm</option>
          </select>
        </div>
        <div className="pm-modal-footer">
          <button className="pm-modal-btn pm-modal-btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="pm-modal-btn pm-modal-btn-confirm" disabled={!reason} onClick={() => reason && onConfirm(reason)}>
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PostCensor (dùng trong MainLayout) ──────────────────────────────────────

export default function PostCensor() {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() ?? "";

  const [posts,        setPosts]        = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [rejectId,     setRejectId]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/${role}/posts`);
        setPosts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [role]);

  const handleSearch = useCallback(
    (q) => setFiltered(posts.filter((p) => p.user?.userName?.includes(q))),
    [posts]
  );
  const debouncedSearch = useDebounce(handleSearch, 400);

  const removePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.postId !== id));
    setFiltered((prev) => prev.filter((p) => p.postId !== id));
  };

  const handleAccept = async (id) => {
    try {
      await api.post(`/api/${role}/posts/${id}/accept`);
      removePost(id);
      setSelectedPost(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi duyệt bài");
    }
  };

  const handleReject = async (reason) => {
    if (!rejectId || !reason) return;
    try {
      await api.post(
        `/api/${role}/posts/${rejectId}/reject`,
        JSON.stringify(reason),
        { headers: { "Content-Type": "application/json" } }
      );
      removePost(rejectId);
      setSelectedPost(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi từ chối bài");
    } finally {
      setRejectId(null);
    }
  };

  const openReject = (id) => { setRejectId(id); setSelectedPost(null); };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pm">
        <div className="pm-header">
          <div className="pm-title">
            <div className="pm-title-dot" />
            Duyệt bài viết
            {!loading && <span className="pm-count">{filtered.length} bài</span>}
          </div>
          <div className="pm-search-wrap">
            <FontAwesomeIcon icon={faSearch} className="pm-search-icon" />
            <input
              className="pm-search" type="text"
              placeholder="Tìm theo tên người dùng…"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="pm-state">
            <FontAwesomeIcon icon={faSpinner} className="pm-state-icon pm-spinner" />
            <span className="pm-state-text">Đang tải dữ liệu…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pm-state">
            <FontAwesomeIcon icon={faInbox} className="pm-state-icon" />
            <span className="pm-state-text">Không có bài viết nào</span>
          </div>
        ) : (
          <>
            <div className="pm-table-wrap">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>#</th><th>Tiêu đề</th><th>Người đăng</th>
                    <th>Ngày đăng</th><th>Giá</th><th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post, i) => (
                    <PostRow key={post.postId} index={i} post={post}
                      onPreview={setSelectedPost} onAccept={handleAccept} onReject={openReject} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pm-cards">
              {filtered.map((post) => (
                <PostCard key={post.postId} post={post}
                  onPreview={setSelectedPost} onAccept={handleAccept} onReject={openReject} />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedPost && (
        <PostPreviewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={handleAccept}
          onReject={openReject}
        />
      )}

      {rejectId && (
        <RejectModal onConfirm={handleReject} onClose={() => setRejectId(null)} />
      )}
    </>
  );
}