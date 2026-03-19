import { useEffect, useState, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faFileLines, faStar, faComments,
  faHandshake, faBoxOpen, faTag, faBuilding,
  faArrowUp, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .db {
    --accent:       var(--primary-color);
    --accent-hover: var(--primary-color-hover);
    --success:      var(--success, #22c55e);
    --border:       #e5e7eb;
    --bg:           #ffffff;
    --bg-sub:       #f9fafb;
    --text:         #111827;
    --text-sub:     #6b7280;
    --text-xs:      #9ca3af;
    --radius:       10px;
    --radius-sm:    6px;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.07);
    --transition:   0.16s ease;
    --font:         'Inter', 'Segoe UI', sans-serif;
  }

  .db { font-family: var(--font); color: var(--text); display: flex; flex-direction: column; gap: 24px; }

  /* ── Section title ── */
  .db-section-title {
    font-size: 13px; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-xs); margin-bottom: 14px;
  }

  /* ── Filter bar ── */
  .db-filter {
    display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 20px;
    box-shadow: var(--shadow-sm);
  }
  .db-filter-field { display: flex; flex-direction: column; gap: 4px; }
  .db-filter-label { font-size: 11px; font-weight: 700; color: var(--text-xs); text-transform: uppercase; letter-spacing: .05em; }
  .db-filter-input, .db-filter-select {
    padding: 7px 11px; border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13px; font-family: var(--font); color: var(--text);
    background: var(--bg-sub); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .db-filter-input:focus, .db-filter-select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(4,153,71,0.10);
  }
  .db-filter-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px;
  }
  .db-filter-btn {
    padding: 8px 18px; border-radius: var(--radius-sm);
    background: var(--accent); border: 1px solid var(--accent); color: #fff;
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; transition: all var(--transition);
  }
  .db-filter-btn:hover { background: var(--accent-hover); }

  /* ── KPI grid ── */
  .db-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
  }
  .db-kpi {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 18px;
    box-shadow: var(--shadow-sm);
    display: flex; flex-direction: column; gap: 8px;
    transition: box-shadow var(--transition);
  }
  .db-kpi:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09); }
  .db-kpi-top { display: flex; align-items: center; justify-content: space-between; }
  .db-kpi-icon {
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .db-kpi-val  { font-size: 26px; font-weight: 800; color: var(--text); line-height: 1; }
  .db-kpi-label { font-size: 12px; color: var(--text-sub); font-weight: 500; }
  .db-kpi-sub   { font-size: 11px; color: var(--text-xs); }

  /* KPI color variants */
  .db-kpi-green  .db-kpi-icon { background: #f0fdf4; color: var(--accent); }
  .db-kpi-blue   .db-kpi-icon { background: #eff6ff; color: #2563eb; }
  .db-kpi-yellow .db-kpi-icon { background: #fffbeb; color: #b45309; }
  .db-kpi-purple .db-kpi-icon { background: #faf5ff; color: #7c3aed; }
  .db-kpi-red    .db-kpi-icon { background: #fff5f5; color: #dc2626; }
  .db-kpi-teal   .db-kpi-icon { background: #f0fdfa; color: #0d9488; }

  /* ── Chart card ── */
  .db-chart-card {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 24px;
    box-shadow: var(--shadow-sm);
  }
  .db-chart-header {
    display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
  }
  .db-chart-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .db-chart-title { font-size: 14px; font-weight: 700; color: var(--text); }

  /* ── Chart row 2-col ── */
  .db-charts-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  }
  @media (max-width: 900px) { .db-charts-row { grid-template-columns: 1fr; } }

  /* ── Pie legend ── */
  .db-pie-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; justify-content: center; }
  .db-pie-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-sub); }
  .db-pie-legend-dot  { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* ── Loading ── */
  .db-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 60px; gap: 10px; color: var(--text-sub); font-size: 14px;
  }
  .db-spinner { animation: dbSpin 0.8s linear infinite; }
  @keyframes dbSpin { to { transform: rotate(360deg); } }

  /* ── Plan table ── */
  .db-plan-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .db-plan-table th {
    padding: 9px 14px; text-align: left; font-size: 11px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--text-xs);
    border-bottom: 1px solid var(--border); background: var(--bg-sub);
  }
  .db-plan-table td { padding: 11px 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .db-plan-table tbody tr:hover { background: var(--bg-sub); }
  .db-plan-table tbody tr:last-child td { border-bottom: none; }
  .db-plan-revenue { font-weight: 700; color: var(--accent); }

  @media (max-width: 640px) {
    .db-kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .db-chart-card { padding: 14px 12px; }
    .db-filter { gap: 8px; }
    .db-filter-field { width: 100%; }
    .db-filter-input, .db-filter-select { width: 100%; }
    .db-filter-btn { width: 100%; justify-content: center; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = ["#049947", "#22c55e", "#2563eb", "#f59e0b", "#7c3aed", "#dc2626", "#0d9488"];

const PIE_COLORS = {
  1: "#f59e0b", 2: "#22c55e", 3: "#ef4444",
  5: "#6b7280", 6: "#94a3b8", 7: "#2563eb",
};

const fmtMoney = (n) => Number(n ?? 0).toLocaleString("vi-VN") + " đ";
const fmtNum   = (n) => Number(n ?? 0).toLocaleString("vi-VN");

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, colorClass }) {
  return (
    <div className={`db-kpi ${colorClass}`}>
      <div className="db-kpi-top">
        <div className="db-kpi-icon"><FontAwesomeIcon icon={icon} /></div>
      </div>
      <div className="db-kpi-val">{fmtNum(value)}</div>
      <div className="db-kpi-label">{label}</div>
      {sub && <div className="db-kpi-sub">{sub}</div>}
    </div>
  );
}

// ─── Chart Card wrapper ───────────────────────────────────────────────────────

function ChartCard({ title, children }) {
  return (
    <div className="db-chart-card">
      <div className="db-chart-header">
        <div className="db-chart-dot" />
        <span className="db-chart-title">{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
      padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", fontSize: 13,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#111827" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>{p.name}:</span>
          <span>{p.name === "Doanh thu" ? fmtMoney(p.value) : fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 29 * 864e5).toISOString().split("T")[0];

  const [from,    setFrom]    = useState(monthAgo);
  const [to,      setTo]      = useState(today);
  const [groupBy, setGroupBy] = useState("day");

  const [overview,   setOverview]   = useState(null);
  const [stats,      setStats]      = useState([]);
  const [postStatus, setPostStatus] = useState([]);
  const [topPlans,   setTopPlans]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  // ── Fetch all ────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, stRes, psRes, tpRes] = await Promise.all([
        api.get("/api/admin/dashboard/overview"),
        api.get("/api/admin/dashboard/stats", { params: { from, to, groupBy } }),
        api.get("/api/admin/dashboard/post-status"),
        api.get("/api/admin/dashboard/top-plans"),
      ]);
      setOverview(ovRes.data);
      setStats(stRes.data);
      setPostStatus(psRes.data);
      setTopPlans(tpRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [from, to, groupBy]);

  useEffect(() => { fetchAll(); }, []);

  // ── Render ────────────────────────────────────────────────────────────

  if (loading && !overview) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="db-loading">
        <FontAwesomeIcon icon={faSpinner} className="db-spinner" style={{ fontSize: 24 }} />
        Đang tải dữ liệu…
      </div>
    </>
  );

  const ov = overview ?? {};

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="db">

        {/* ── Filter bar ── */}
        <div className="db-filter">
          <div className="db-filter-field">
            <label className="db-filter-label">Từ ngày</label>
            <input className="db-filter-input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="db-filter-field">
            <label className="db-filter-label">Đến ngày</label>
            <input className="db-filter-input" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="db-filter-field">
            <label className="db-filter-label">Nhóm theo</label>
            <select className="db-filter-select" value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <button className="db-filter-btn" onClick={fetchAll}>Áp dụng</button>
        </div>

        {/* ── KPI cards ── */}
        <div>
          <div className="db-section-title">Tổng quan hệ thống</div>
          <div className="db-kpi-grid">
            <KpiCard icon={faUsers}     label="Người dùng"       value={ov.users?.total}       colorClass="db-kpi-green" />
            <KpiCard icon={faFileLines} label="Bài đăng"         value={ov.posts?.total}       colorClass="db-kpi-blue" />
            <KpiCard icon={faStar}      label="Đánh giá"         value={ov.reviews?.total}     colorClass="db-kpi-yellow" />
            <KpiCard icon={faComments}  label="Bình luận"        value={ov.comments?.total}    colorClass="db-kpi-purple" />
            <KpiCard icon={faHandshake} label="Giao dịch TG"     value={ov.escrow?.total}      colorClass="db-kpi-teal" />
            <KpiCard icon={faBoxOpen}   label="Gói đã mua"       value={ov.subOrders?.total}   sub={`Doanh thu: ${fmtMoney(ov.subOrders?.revenue)}`} colorClass="db-kpi-green" />
            <KpiCard icon={faBuilding}  label="Thương hiệu"      value={ov.brands?.total}      sub={`${ov.brands?.parent} cha · ${ov.brands?.child} con`} colorClass="db-kpi-blue" />
            <KpiCard icon={faTag}       label="Danh mục"         value={ov.categories?.total}  sub={`${ov.categories?.parent} cha · ${ov.categories?.child} con`} colorClass="db-kpi-yellow" />
          </div>
        </div>

        {/* ── Line chart: Users + Posts ── */}
        <ChartCard title="Người dùng & Bài đăng theo thời gian">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="users"    name="Người dùng" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="posts"    name="Bài đăng"   stroke="#049947" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="approved" name="Đã duyệt"   stroke="#22c55e" strokeWidth={2} dot={false} strokeDasharray="4 2" activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Bar: Reviews + Comments ── */}
        <ChartCard title="Đánh giá & Bình luận theo thời gian">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="reviews"  name="Đánh giá"   fill="#f59e0b" radius={[4,4,0,0]} maxBarSize={32} />
              <Bar dataKey="comments" name="Bình luận"  fill="#7c3aed" radius={[4,4,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Row: Escrow + Revenue ── */}
        <div className="db-charts-row">
          <ChartCard title="Giao dịch trung gian">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="escrow" name="Giao dịch TG" fill="#0d9488" radius={[4,4,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Doanh thu gói dịch vụ">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={v => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#049947" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Row: Post status pie + Top plans ── */}
        <div className="db-charts-row">

          {/* Pie: post status */}
          <ChartCard title="Phân bố trạng thái bài đăng">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={postStatus} dataKey="count" nameKey="label"
                  cx="50%" cy="50%" outerRadius={80}
                  label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {postStatus.map((entry) => (
                    <Cell key={entry.statusId} fill={PIE_COLORS[entry.statusId] ?? "#9ca3af"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [fmtNum(v), n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="db-pie-legend">
              {postStatus.map(s => (
                <div key={s.statusId} className="db-pie-legend-item">
                  <div className="db-pie-legend-dot" style={{ background: PIE_COLORS[s.statusId] ?? "#9ca3af" }} />
                  {s.label}: {fmtNum(s.count)}
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Table: top plans */}
          <ChartCard title="Gói dịch vụ được mua nhiều nhất">
            {topPlans.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-xs)", padding: "32px 0", fontSize: 13 }}>
                Chưa có dữ liệu
              </div>
            ) : (
              <table className="db-plan-table">
                <thead>
                  <tr>
                    <th>Gói</th>
                    <th>Lượt mua</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topPlans.map((p, i) => (
                    <tr key={p.planId}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0,
                          }} />
                          {p.planName}
                        </div>
                      </td>
                      <td>{fmtNum(p.count)}</td>
                      <td className="db-plan-revenue">{fmtMoney(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ChartCard>

        </div>

      </div>
    </>
  );
}