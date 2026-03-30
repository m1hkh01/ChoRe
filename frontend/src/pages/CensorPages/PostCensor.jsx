import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faXmark, faEye,
  faMagnifyingGlass, faSpinner, faInbox,
  faRotateLeft, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useCallback } from "react";
import PostPreviewModal from "./PostPreviewModal";
import { useAuthStore } from "@/store/auth";
import api from "@/api";
import Swal from "sweetalert2";
import { Toast } from "@/utils/toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS = {
  PENDING:  "Pending",
  APPROVED: "Approved",
  REJECTED: "Reject",
};

const STATUS_CONFIG = {
  [STATUS.PENDING]:  { label: "Chờ duyệt", bg: "#fffbeb", border: "#fde68a", text: "#92400e", dot: "#f59e0b" },
  [STATUS.APPROVED]: { label: "Đã duyệt",  bg: "#f0fdf4", border: "#bbf7d0", text: "#065f46", dot: "#10b981" },
  [STATUS.REJECTED]: { label: "Từ chối",   bg: "#fff5f5", border: "#fecaca", text: "#991b1b", dot: "#ef4444" },
};

const FILTER_OPTIONS = [
  { value: "",               label: "Tất cả" },
  { value: STATUS.PENDING,   label: "Chờ duyệt" },
  { value: STATUS.APPROVED,  label: "Đã duyệt" },
  { value: STATUS.REJECTED,  label: "Từ chối" },
];

const REJECT_REASONS = [
  "Vi phạm quy định cộng đồng",
  "Hình ảnh không phù hợp / không hợp lệ",
  "Sản phẩm thuộc danh mục bị cấm",
  "Thông tin sản phẩm không chính xác",
  "Nội dung trùng lặp",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str.endsWith("Z") ? str : str + "Z").toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const formatPrice = (price) =>
  Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .pm {
    --accent:       var(--primary-color, #16a34a);
    --accent-hover: var(--primary-color-hover, #15803d);
    --danger:       #dc2626;
    --border:       #e5e7eb;
    --bg:           #ffffff;
    --bg-sub:       #f9fafb;
    --bg-row-hover: #fafafa;
    --text:         #111827;
    --text-sub:     #6b7280;
    --text-xs:      #9ca3af;
    --radius:       10px;
    --radius-sm:    6px;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --transition:   0.16s ease;
  }

  .pm { color: var(--text); display: flex; flex-direction: column; gap: 0; }

  /* ── Card ── */
  .pm-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    margin: 30px;
  }
  .pm-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
    flex-wrap: wrap;
  }
  .pm-card-header-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); flex-shrink: 0;
  }
  .pm-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .pm-card-count {
    margin-left: auto;
    padding: 2px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600;
    background: #f3f4f6; border: 1px solid var(--border);
    color: var(--text-sub);
  }

  /* ── Toolbar ── */
  .pm-toolbar {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 20px; flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
    background: var(--bg-sub);
  }
  .pm-search-wrap { position: relative; flex: 1 1 160px; max-width: 280px; }
  .pm-search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: var(--text-xs); font-size: 12px; pointer-events: none;
  }
  .pm-search {
    width: 100%; box-sizing: border-box;
    padding: 7px 12px 7px 30px;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13px; background: var(--bg); color: var(--text);
    outline: none; transition: border-color var(--transition), box-shadow var(--transition);
  }
  .pm-search:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  }
  .pm-filters { display: flex; gap: 5px; flex-wrap: wrap; }
  .pm-pill {
    padding: 5px 12px; border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg); color: var(--text-sub);
    font-size: 12px; font-weight: 600; cursor: pointer;
    white-space: nowrap; transition: all var(--transition);
  }
  .pm-pill:hover { border-color: var(--accent); color: var(--accent); }
  .pm-pill--active { background: #f0fdf4; border-color: var(--accent); color: var(--accent); }

  /* ── Status badge ── */
  .pm-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 9px; border-radius: 999px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
    border: 1px solid transparent;
  }
  .pm-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* ── Icon action buttons ── */
  .pm-btn-icon {
    width: 30px; height: 30px; padding: 0;
    border-radius: var(--radius-sm);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; cursor: pointer; border: 1px solid transparent;
    transition: all var(--transition); background: none;
  }
  .pm-btn-view   { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
  .pm-btn-view:hover   { background: #dbeafe; }
  .pm-btn-ok     { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
  .pm-btn-ok:hover     { background: #dcfce7; }
  .pm-btn-reject { background: #fff5f5; border-color: #fecaca; color: #dc2626; }
  .pm-btn-reject:hover { background: #fee2e2; }
  .pm-btn-reset  { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .pm-btn-reset:hover  { background: #fef3c7; }
  .pm-td-actions { display: flex; gap: 5px; align-items: center; }

  /* ── Table ── */
  .pm-table-wrap { overflow-x: auto; }
  table.pm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .pm-table thead tr { background: var(--bg-sub); border-bottom: 1px solid var(--border); }
  .pm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-sub); white-space: nowrap;
  }
  .pm-table td {
    padding: 10px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle;
  }
  .pm-table tbody tr { transition: background var(--transition); }
  .pm-table tbody tr:hover { background: var(--bg-row-hover); }
  .pm-table tbody tr:last-child td { border-bottom: none; }

  .pm-td-index { color: var(--text-xs); font-size: 12px; font-variant-numeric: tabular-nums; }
  .pm-td-title {
    font-weight: 600; color: var(--text);
    max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pm-td-user  { color: var(--text-sub); font-weight: 500; }
  .pm-td-date  { color: var(--text-xs); font-size: 12.5px; white-space: nowrap; }
  .pm-td-price { font-weight: 700; color: #15803d; white-space: nowrap; font-variant-numeric: tabular-nums; }

  /* ── Empty / Loading ── */
  .pm-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 50px 24px; gap: 10px; color: var(--text-sub);
  }
  .pm-state-icon { font-size: 32px; opacity: 0.30; }
  .pm-state-text { font-size: 13.5px; font-weight: 500; }
  .pm-state-sub  { font-size: 12.5px; color: var(--text-xs); }
  .pm-spinner { animation: pmSpin 0.8s linear infinite; }
  @keyframes pmSpin { to { transform: rotate(360deg); } }

  /* ── Mobile cards (≤ 600px) ── */
  @media (max-width: 600px) {
    .pm-table-wrap  { display: none; }
    .pm-mobile-list { display: flex; flex-direction: column; }
  }
  @media (min-width: 601px) {
    .pm-mobile-list { display: none; }
  }

  .pm-mobile-item {
    padding: 13px 16px;
    border-bottom: 1px solid #f3f4f6;
    display: flex; flex-direction: column; gap: 4px;
    transition: background var(--transition);
  }
  .pm-mobile-item:last-child { border-bottom: none; }
  .pm-mobile-item:hover { background: var(--bg-row-hover); }
  .pm-mobile-top  { display: flex; justify-content: space-between; gap: 8px; }
  .pm-mobile-title { font-size: 13.5px; font-weight: 600; color: var(--text); flex: 1; }
  .pm-mobile-price { font-size: 13px; font-weight: 700; color: #15803d; white-space: nowrap; }
  .pm-mobile-meta  { font-size: 12px; color: var(--text-xs); display: flex; flex-wrap: wrap; gap: 4px 6px; }
  .pm-mobile-foot  { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .pm-mobile-actions { display: flex; gap: 5px; }

  /* ── Reject Modal ── */
  .pm-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.40); backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .pm-modal {
    background: var(--bg); border-radius: var(--radius);
    width: 100%; max-width: 460px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.16); overflow: hidden;
  }
  .pm-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border-bottom: 1px solid var(--border); background: white;
  }
  .pm-modal-title {
    display: flex; align-items: center; gap: 9px;
    font-size: 14px; font-weight: 700; color: var(--text);
  }
  .pm-modal-title-icon {
    width: 28px; height: 28px; border-radius: var(--radius-sm);
    background: #fff5f5; color: var(--danger);
    display: flex; align-items: center; justify-content: center; font-size: 12px;
  }
  .pm-modal-close {
    width: 28px; height: 28px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--bg);
    color: var(--text-sub); font-size: 11px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
  }
  .pm-modal-close:hover { background: #e5e7eb; color: var(--text); }
  .pm-modal-body { padding: 16px 20px; background: #fff;}
  .pm-modal-label {
    display: block; font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .06em;
    color: var(--text-sub); margin-bottom: 10px;
  }
  .pm-reason-list { display: flex; flex-direction: column; gap: 6px; }
  .pm-reason-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--bg);
    cursor: pointer; transition: all var(--transition);
  }
  .pm-reason-item:hover { border-color: var(--accent); background: #f0fdf4; }
  .pm-reason-item--sel  { border-color: var(--danger) !important; background: #fff5f5 !important; }
  .pm-reason-radio {
    width: 15px; height: 15px; border-radius: 50%;
    border: 2px solid var(--border); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
  }
  .pm-reason-item--sel .pm-reason-radio { border-color: var(--danger); background: var(--danger); }
  .pm-reason-dot { width: 5px; height: 5px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity var(--transition); }
  .pm-reason-item--sel .pm-reason-dot { opacity: 1; }
  .pm-reason-text { font-size: 13px; font-weight: 500; color: var(--text); }
  .pm-modal-foot {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 12px 20px; border-top: 1px solid var(--border); background: white;
  }
  .pm-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600;
    border: 1px solid transparent; cursor: pointer; transition: all var(--transition);
  }
  .pm-btn-secondary { background: var(--bg); border-color: var(--border); color: var(--text-sub); }
  .pm-btn-secondary:hover { background: #e5e7eb; }
  .pm-btn-danger:hover { background: rgba(233, 6, 6, 0.6); color: white; }
  .pm-btn-danger:disabled { opacity: .45; cursor: not-allowed; }
  .pm-btn pm-btn-danger { background: var(--bg); border-color: var(--border); color: black; }
`;

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className="pm-badge" style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}>
      <span className="pm-badge-dot" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ─── ActionButtons ────────────────────────────────────────────────────────────

function ActionButtons({ post, onPreview, onApprove, onReject, onReset }) {
  const { postStatus, postId } = post;
  const isPending = postStatus === STATUS.PENDING;
  const isDone = postStatus === STATUS.APPROVED || postStatus === STATUS.REJECTED;

  return (
    <div className="pm-td-actions">
      <button className="pm-btn-icon pm-btn-view" title="Xem trước" onClick={() => onPreview(post)}>
        <FontAwesomeIcon icon={faEye} />
      </button>
      {isPending && (
        <>
          <button className="pm-btn-icon pm-btn-ok" title="Duyệt bài" onClick={() => onApprove(postId)}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button className="pm-btn-icon pm-btn-reject" title="Từ chối" onClick={() => onReject(postId)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </>
      )}
      {isDone && (
        <button className="pm-btn-icon pm-btn-reset" title="Đặt lại trạng thái" onClick={() => onReset(postId)}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
      )}
    </div>
  );
}

// ─── RejectModal ──────────────────────────────────────────────────────────────

function RejectModal({ onConfirm, onClose }) {
  const [reason, setReason] = useState("");

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-modal" role="dialog" aria-modal="true">
        <div className="pm-modal-head">
          <div className="pm-modal-title">
            <div className="pm-modal-title-icon">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            Từ chối bài đăng
          </div>
          <button className="pm-modal-close" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="pm-modal-body">
          <span className="pm-modal-label">Chọn lý do từ chối</span>
          <div className="pm-reason-list">
            {REJECT_REASONS.map((r) => (
              <div
                key={r}
                className={`pm-reason-item${reason === r ? " pm-reason-item--sel" : ""}`}
                onClick={() => setReason(r)}
                role="radio"
                aria-checked={reason === r}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setReason(r)}
              >
                <div className="pm-reason-radio">
                  <div className="pm-reason-dot" />
                </div>
                <span className="pm-reason-text">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pm-modal-foot">
          <button className="pm-btn pm-btn-secondary" onClick={onClose}>Huỷ bỏ</button>
          <button
            className="pm-btn pm-btn-danger"
            disabled={!reason}
            onClick={() => reason && onConfirm(reason)}
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PostManager ──────────────────────────────────────────────────────────────

export default function PostManager() {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() ?? "";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const debouncedSearch = useDebounce(search);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get(`/api/${role}/posts`);
      setPosts(res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredPosts = posts.filter((post) => {
    const q = debouncedSearch.toLowerCase();
    const matchSearch =
      !q ||
      post.title?.toLowerCase().includes(q) ||
      post.user?.userName?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || post.postStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Mutations ──────────────────────────────────────────────────────────────

  const optimisticUpdate = useCallback((id, patch) => {
    setPosts((prev) => prev.map((p) => (p.postId === id ? { ...p, ...patch } : p)));
  }, []);

  const handleApprove = useCallback(async (id) => {
    try {
      await api.post(`/api/${role}/posts/${id}/accept`);
      optimisticUpdate(id, { postStatus: STATUS.APPROVED });
      setSelectedPost(null);
      Toast.fire({ icon: "success", title: "Đã duyệt bài đăng" });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "Lỗi khi duyệt bài" });
    }
  }, [role, optimisticUpdate]);

  const handleReject = useCallback(async (reason) => {
    if (!rejectId || !reason) return;
    try {
      await api.post(
        `/api/${role}/posts/${rejectId}/reject`,
        JSON.stringify(reason),
        { headers: { "Content-Type": "application/json" } }
      );
      optimisticUpdate(rejectId, { postStatus: STATUS.REJECTED });
      setSelectedPost(null);
      Toast.fire({ icon: "success", title: "Đã từ chối bài đăng" });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "Lỗi khi từ chối bài" });
    } finally {
      setRejectId(null);
    }
  }, [role, rejectId, optimisticUpdate]);

  const handleReset = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Đặt lại trạng thái?",
      text: "Bài đăng sẽ được chuyển về trạng thái chờ duyệt.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-green-600 text-white text-md me-2 px-4 py-2 rounded mr-2 hover:bg-green-700",
        cancelButton:  "bg-red-500 text-white text-md px-4 py-2 rounded hover:bg-red-700",
      },
    });
    if (!result.isConfirmed) return;
    try {
      await api.post(`/api/${role}/posts/${id}/reset`);
      optimisticUpdate(id, { postStatus: STATUS.PENDING });
      Toast.fire({ icon: "success", title: "Đã đặt lại trạng thái" });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "Lỗi khi đặt lại trạng thái" });
    }
  }, [role, optimisticUpdate]);

  const openReject = useCallback((id) => {
    setRejectId(id);
    setSelectedPost(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pm">
        <div className="pm-card">

          {/* ── Header ── */}
          <div className="pm-card-header">
            <div className="pm-card-header-dot" />
            <span className="pm-card-title">Quản lý bài viết</span>
            {!loading && (
              <span className="pm-card-count">{filteredPosts.length}</span>
            )}
          </div>

          {/* ── Toolbar ── */}
          <div className="pm-toolbar">
            <div className="pm-search-wrap">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="pm-search-icon" />
              <input
                className="pm-search"
                type="search"
                placeholder="Tìm tiêu đề, người dùng…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="pm-filters">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`pm-pill${statusFilter === opt.value ? " pm-pill--active" : ""}`}
                  onClick={() => setStatusFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Body ── */}
          {loading ? (
            <div className="pm-state">
              <FontAwesomeIcon icon={faSpinner} className="pm-state-icon pm-spinner" />
              <span className="pm-state-text">Đang tải dữ liệu…</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="pm-state">
              <FontAwesomeIcon icon={faInbox} className="pm-state-icon" />
              <span className="pm-state-text">Không có bài viết nào</span>
              <span className="pm-state-sub">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</span>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="pm-table-wrap">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tiêu đề</th>
                      <th>Người đăng</th>
                      <th>Ngày đăng</th>
                      <th>Giá</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post, i) => (
                      <tr key={post.postId}>
                        <td className="pm-td-index">{i + 1}</td>
                        <td><div className="pm-td-title" title={post.title}>{post.title}</div></td>
                        <td className="pm-td-user">{post.user?.userName ?? "—"}</td>
                        <td className="pm-td-date">{formatDate(post.createdAt)}</td>
                        <td className="pm-td-price">{formatPrice(post.price)}</td>
                        <td><StatusBadge status={post.postStatus} /></td>
                        <td>
                          <ActionButtons
                            post={post}
                            onPreview={setSelectedPost}
                            onApprove={handleApprove}
                            onReject={openReject}
                            onReset={handleReset}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="pm-mobile-list">
                {filteredPosts.map((post) => (
                  <div key={post.postId} className="pm-mobile-item">
                    <div className="pm-mobile-top">
                      <span className="pm-mobile-title">{post.title}</span>
                      <span className="pm-mobile-price">{formatPrice(post.price)}</span>
                    </div>
                    <div className="pm-mobile-meta">
                      <span>{post.user?.userName ?? "—"}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="pm-mobile-foot">
                      <StatusBadge status={post.postStatus} />
                      <div className="pm-mobile-actions">
                        <ActionButtons
                          post={post}
                          onPreview={setSelectedPost}
                          onApprove={handleApprove}
                          onReject={openReject}
                          onReset={handleReset}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview modal */}
      {selectedPost && (
        <PostPreviewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={handleApprove}
          onReject={openReject}
        />
      )}

      {/* Reject modal */}
      {rejectId && (
        <RejectModal onConfirm={handleReject} onClose={() => setRejectId(null)} />
      )}
    </>
  );
}