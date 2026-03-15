import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash, faEye, faCheckSquare,
  faSquare, faCommentSlash,
} from "@fortawesome/free-solid-svg-icons";

import api from "@/api";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .pc-wrap { display: flex; flex-direction: column; gap: 16px; }

  /* ── Toolbar ── */
  .pc-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .pc-count {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .pc-toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* ── Buttons ── */
  .pc-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    background: none;
  }

  .pc-btn-red {
    color: #dc2626;
    border-color: #fca5a5;
    background: #fff5f5;
  }
  .pc-btn-red:hover    { background: #fee2e2; }
  .pc-btn-red:disabled { opacity: 0.4; cursor: not-allowed; }

  .pc-btn-ghost {
    color: #475569;
    border-color: #e2e8f0;
    background: #fff;
  }
  .pc-btn-ghost:hover { background: #f8fafc; }

  /* ── Select-all row ── */
  .pc-select-all {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .pc-select-all:hover { color: #0f172a; }
  .pc-select-all svg   { font-size: 16px; }

  .pc-sel-badge {
    font-size: 11px;
    font-weight: 600;
    color: #22c55e;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 999px;
    padding: 1px 8px;
  }

  /* ── List ── */
  .pc-list { display: flex; flex-direction: column; gap: 8px; }

  /* ── Row ── */
  .pc-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .pc-chk {
    flex-shrink: 0;
    margin-top: 14px;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-size: 16px;
    color: #cbd5e1;
    transition: color 0.15s;
  }
  .pc-chk:hover, .pc-chk.on { color: #22c55e; }

  /* ── Card ── */
  .pc-card {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    transition: border-color 0.15s;
    min-width: 0;
  }

  .pc-card:hover { border-color: #cbd5e1; }
  .pc-card.on    { border-color: #86efac; background: #f0fdf4; }

  .pc-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #f1f5f9;
  }

  .pc-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pc-meta {
    font-size: 13px;
    color: #374151;
    line-height: 1.5;
  }

  .pc-meta b { font-weight: 600; color: #111827; }

  .pc-content {
    font-size: 13px;
    color: #475569;
    background: #f8fafc;
    border-radius: 8px;
    padding: 8px 10px;
    line-height: 1.5;
    border-left: 3px solid #e2e8f0;
  }

  .pc-date {
    font-size: 11px;
    color: #94a3b8;
  }

  /* ── Card actions ── */
  .pc-actions {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
    margin-top: 2px;
  }

  .pc-ico {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    border: 1px solid #e2e8f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    color: #64748b;
    text-decoration: none;
    transition: all 0.15s;
  }
  .pc-ico:hover        { border-color: #22c55e; color: #16a34a; background: #f0fdf4; }
  .pc-ico.del:hover    { border-color: #ef4444; color: #dc2626; background: #fff5f5; }

  /* ── Empty ── */
  .pc-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 56px 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    text-align: center;
    color: #94a3b8;
  }
  .pc-empty svg { font-size: 36px; opacity: 0.3; }
  .pc-empty p   { margin: 0; font-size: 14px; color: #475569; font-weight: 500; }

  /* ── Load more ── */
  .pc-more {
    display: flex;
    justify-content: center;
    padding-top: 4px;
  }

  .pc-more-btn {
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
  .pc-more-btn:hover    { border-color: #22c55e; color: #16a34a; background: #f0fdf4; }
  .pc-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Responsive ── */
  @media (max-width: 560px) {
    .pc-card    { padding: 12px; gap: 10px; }
    .pc-avatar  { width: 34px; height: 34px; }
    .pc-meta    { font-size: 12px; }
    .pc-content { font-size: 12px; padding: 7px 9px; }
    .pc-actions { flex-direction: row; margin-top: 8px; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
const UPLOADS   = "https://api.chore123.cloud/uploads/";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileComments({ userId }) {
  const [comments,  setComments]  = useState([]);
  const [page,      setPage]      = useState(1);
  const [hasNext,   setHasNext]   = useState(false);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [selected,  setSelected]  = useState(new Set());

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = async (p, reset = false) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/profile/${userId}/comments`, {
        params: { page: p, pageSize: PAGE_SIZE },
      });
      setComments(prev => reset ? data.items : [...prev, ...data.items]);
      setHasNext(data.hasNext);
      setTotal(data.total);
      setPage(p);
    } catch (e) {
      console.error("Load comments error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, true); }, [userId]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggle = (id) => setSelected(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const allChecked  = comments.length > 0 && selected.size === comments.length;
  const toggleAll   = () => setSelected(allChecked ? new Set() : new Set(comments.map(c => c.cmtId)));

  // const remove = async (id) => {
  //   if (!confirm("Xóa bình luận này?")) return;
  //   try {
  //     await api.delete(`/api/comments/${id}`);
  //     setComments(p => p.filter(c => c.cmtId !== id));
  //     setSelected(s => { const n = new Set(s); n.delete(id); return n; });
  //     setTotal(p => p - 1);
  //   } catch (e) { console.error(e); }
  // };

  const removeSelected = async () => {
    if (!selected.size || !confirm(`Xóa ${selected.size} bình luận đã chọn?`)) return;
    try {
      await Promise.allSettled([...selected].map(id => api.delete(`/api/comments/${id}`)));
      setComments(p => p.filter(c => !selected.has(c.cmtId)));
      setTotal(p => p - selected.size);
      setSelected(new Set());
    } catch (e) { console.error(e); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("vi-VN");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div className="pc-wrap">

        {/* Toolbar */}
        <div className="pc-toolbar">
          <p className="pc-count">{total} bình luận</p>

          {comments.length > 0 && (
            <div className="pc-toolbar-right">
              {/* <button className="pc-select-all" onClick={toggleAll}>
                <FontAwesomeIcon
                  icon={allChecked ? faCheckSquare : faSquare}
                  style={{ color: allChecked ? "#22c55e" : "#cbd5e1" }}
                />
                {allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button> */}

              {selected.size > 0 && (
                <>
                  <span className="pc-sel-badge">{selected.size}</span>
                  {/* <button className="pc-btn pc-btn-red" onClick={removeSelected}>
                    <FontAwesomeIcon icon={faTrash} />
                    Xóa {selected.size} mục
                  </button> */}
                </>
              )}
            </div>
          )}
        </div>

        {/* Empty */}
        {!loading && comments.length === 0 && (
          <div className="pc-empty">
            <FontAwesomeIcon icon={faCommentSlash} />
            <p>Chưa có bình luận nào</p>
          </div>
        )}

        {/* List */}
        <div className="pc-list">
          {comments.map(c => (
            <div key={c.cmtId} className="pc-row">
              {/* <button
                className={`pc-chk ${selected.has(c.cmtId) ? "on" : ""}`}
                onClick={() => toggle(c.cmtId)}
              >
                <FontAwesomeIcon icon={selected.has(c.cmtId) ? faCheckSquare : faSquare} />
              </button> */}

              <div className={`pc-card ${selected.has(c.cmtId) ? "on" : ""}`}>
                <img
                  src={c.user?.avatar ? `${UPLOADS}${c.user.avatar}` : "/default-avatar.png"}
                  alt={c.user?.fullName}
                  className="pc-avatar"
                />

                <div className="pc-body">
                  <p className="pc-meta">
                    <b>{c.user?.fullName}</b> bình luận về{" "}
                    <b>{c.post?.title}</b>
                  </p>
                  <div className="pc-content">{c.content}</div>
                  <span className="pc-date">{fmt(c.createAt)}</span>
                </div>

                <div className="pc-actions">
                  <Link to={`/posts/${c.post?.postId}`} className="pc-ico" title="Xem bài viết">
                    <FontAwesomeIcon icon={faEye} />
                  </Link>
                  {/* <button className="pc-ico del" onClick={() => remove(c.cmtId)} title="Xóa">
                    <FontAwesomeIcon icon={faTrash} />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasNext && (
          <div className="pc-more">
            <button
              className="pc-more-btn"
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