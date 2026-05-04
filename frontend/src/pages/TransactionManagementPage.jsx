// TransactionManagementPage.jsx
// Bao gồm: TransactionManagementPage + TransactionTabs + EscrowTab + PackageTab

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

import api from "../api";
import { useAuthStore } from "../store/auth";
import EscrowFilter from "../components/UserTransaction/EscrowFilter";
import { EscrowTransactionCard } from "../components/UserTransaction/EscrowTransactionCard";
import { EscrowPagination }      from "../components/EscrowTransaction/EscrowPagination";
import { usePagination }          from "../Hooks/usePagination";
import PackageTransactionCard    from "../components/UserTransaction/PackageTransactionCard";
import PackageTransactionModal   from "../components/UserTransaction/PackageTransactionModal";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .tm {
    min-height: 100vh;
    background: #f1f5f9;
    padding: 36px 20px 60px;
  }

  .tm-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── Header ── */
  .tm-header { margin-bottom: 4px; }
  .tm-title  { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
  .tm-sub    { font-size: 13px; color: #94a3b8; margin: 0; }

  /* ── Tabs ── */
  .tm-tabs {
    display: flex;
    gap: 4px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 6px;
  }

  .tm-tab {
    flex: 1;
    padding: 9px 16px;
    border-radius: 8px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .tm-tab:hover { background: #f8fafc; color: #374151; }
  .tm-tab.on    { background: #22c55e; color: #fff; }

  /* ── Empty state ── */
  .tm-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 72px 20px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    text-align: center;
    color: #94a3b8;
  }
  .tm-empty svg { font-size: 40px; opacity: 0.3; }
  .tm-empty p   { margin: 0; font-size: 14px; font-weight: 500; color: #475569; }

  /* ── Escrow tab ── */
  .tm-escrow-list { display: flex; flex-direction: column; gap: 10px; }

  /* ── Package tab grid ── */
  .tm-pkg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .tm            { padding: 20px 12px 48px; }
    .tm-title      { font-size: 18px; }
    .tm-tabs       { gap: 2px; padding: 4px; }
    .tm-tab        { padding: 8px 10px; font-size: 12px; }
    .tm-pkg-grid   { grid-template-columns: 1fr; }
  }
`;

// ─── TransactionTabs ──────────────────────────────────────────────────────────

function TransactionTabs({ active, onChange }) {
  const tabs = [
    { key: "escrow",  label: "Giao dịch trung gian" },
    { key: "package", label: "Giao dịch gói dịch vụ" },
  ];
  return (
    <div className="tm-tabs">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`tm-tab ${active === t.key ? "on" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── EscrowTab ────────────────────────────────────────────────────────────────

function EscrowTab({ transactions, userId, reload }) {
  const PER_PAGE = 6;
  const { currentPage, setCurrentPage, totalPages, visiblePages } = usePagination({
    totalItems:   transactions?.length ?? 0,
    itemsPerPage: PER_PAGE,
    maxPageIndex: 5,
  });
  if (currentPage > totalPages.length && totalPages.length > 0) {
    setCurrentPage(1);
  }
  const start     = (currentPage - 1) * PER_PAGE;
  const paginated = (transactions ?? []).slice(start, start + PER_PAGE);

  if (!transactions?.length) {
    return (
      <div className="tm-empty">
        <FontAwesomeIcon icon={faInbox} />
        <p>Bạn chưa có giao dịch trung gian nào</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="tm-escrow-list">
        {paginated.map(t => (
          <EscrowTransactionCard
            key={t.transactionId ?? t.id}
            transaction={t}
            currentUserIsSeler={t.sellerId === userId}
            reload={reload}
          />
        ))}
      </div>
      <EscrowPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        visiblePages={visiblePages}
      />
    </div>
  );
}

// ─── PackageTab ───────────────────────────────────────────────────────────────

function PackageTab({ transactions }) {
  const [selected, setSelected] = useState(null);

  if (!transactions?.length) {
    return (
      <div className="tm-empty">
        <FontAwesomeIcon icon={faInbox} />
        <p>Bạn chưa có giao dịch gói dịch vụ nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="tm-pkg-grid">
        {transactions.map((item, i) => (
          <PackageTransactionCard
            key={i}
            transaction={item}
            setSelectedTransaction={setSelected}
          />
        ))}
      </div>
      {selected && (
        <PackageTransactionModal
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TransactionManagementPage() {
  const { user } = useAuthStore();
  const [activeTab,          setActiveTab]          = useState("escrow");
  const [filter,             setFilter]             = useState({});
  const [escrowTransactions, setEscrowTransactions] = useState([]);
  const [serviceTransactions,setServiceTransactions]= useState([]);

  const fetchData = async () => {
    try {
      if (activeTab === "escrow") {
        const { data } = await api.post(`api/transaction/escrow/${user.userId}`, filter);
        setEscrowTransactions(data);
      } else {
        const { data } = await api.post(`api/transaction/service/${user.userId}`, filter);
        setServiceTransactions(data);
      }
    } catch (e) {
      console.error("Transaction fetch error:", e);
    }
  };

  useEffect(() => { fetchData(); }, [filter, activeTab, user.userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilter({});
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="tm">
        <div className="tm-inner">

          {/* Header */}
          <div className="tm-header">
            <h1 className="tm-title">Quản lý giao dịch</h1>
            <p className="tm-sub">Theo dõi và quản lý tất cả giao dịch của bạn</p>
          </div>

          {/* Filter */}
          <EscrowFilter onChange={setFilter} currentTab={activeTab} />

          {/* Tabs */}
          <TransactionTabs active={activeTab} onChange={handleTabChange} />

          {/* Content */}
          {activeTab === "escrow" ? (
            <EscrowTab
              transactions={escrowTransactions}
              userId={user.userId}
              reload={fetchData}
            />
          ) : (
            <PackageTab transactions={serviceTransactions} />
          )}

        </div>
      </div>
    </>
  );
}