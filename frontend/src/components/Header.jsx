import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown, faSearch, faAngleRight,
  faBars, faTimes, faPlus, faChevronRight,
  faLayerGroup, faShieldHalved, faRightFromBracket,
  faUser, faCreditCard, faClockRotateLeft, faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { faComment, faBell, faHeart } from "@fortawesome/free-regular-svg-icons";

import "@/assets/Header.css";
import api from "../api";
import useFetch from "../Hooks/useFetch";
import { useSignalR } from "../signalr/SignalRContext";
import { useAuthStore } from "@/store/auth";
import ReviewForm from "./Review/ReviewForm";

// ─── Constants ────────────────────────────────────────────────────────────────

const NOTIF_TABS = [
  { key: "All",         label: "Tất cả" },
  { key: "Post",        label: "Bài đăng" },
  { key: "Transaction", label: "Giao dịch" },
];

const POST_NOTIF_TYPES = ["PostApproved", "PostRejected", "PostNeedPayment"];
const TRANSACTION_NOTIF_TYPES = ["Transaction", "PendingPayment", "PaymentReceived", "AwaitingEvidence"];

const AVATAR_BASE = "https://api.chore123.cloud/uploads/";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avatarUrl(path) {
  return `${AVATAR_BASE}${path}`;
}

function formatNotifDate(dateString) {
  const diff    = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);
  const date    = new Date(dateString);

  if (minutes < 60)  return `${minutes || 1} phút`;
  if (hours   < 24)  return `${hours} giờ`;
  if (days    === 1) return "Hôm qua";
  if (days    <= 3)  return ["CN","T2","T3","T4","T5","T6","T7"][date.getDay()];
  if (days    <= 30) return `${days} ngày`;
  return date.toLocaleDateString("vi-VN");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavIconBtn({ to, icon, title, children, onClick, active }) {
  const cls = `hdr-icon-btn${active ? " hdr-icon-btn--active" : ""}`;
  if (to) return (
    <Link to={to} className={cls} title={title}>
      <FontAwesomeIcon icon={icon} />
      {children}
    </Link>
  );
  return (
    <button className={cls} title={title} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Dropdown states
  const [cateOpen,       setCateOpen]       = useState(false);
  const [notifOpen,      setNotifOpen]      = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [drawerCateOpen, setDrawerCateOpen] = useState(false);
  const [drawerNotifOpen,setDrawerNotifOpen]= useState(false);

  // Search
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Category mega menu
  const { data: categoryData } = useFetch("/api/categories/hierarchy");
  const [categories,        setCategories]        = useState([]);
  const [activeCate,        setActiveCate]        = useState(null);
  const [mobileExpandedCate, setMobileExpandedCate] = useState(null);

  // Notifications
  const { data: notifData } = useFetch(`/api/notifications/${user?.userId || 0}`);
  const [notifications, setNotifications] = useState([]);
  const [notifFilter,   setNotifFilter]   = useState("All");

  // Review modal
  const [reviewChatRoomId, setReviewChatRoomId] = useState(null);

  // Refs for click-outside
  const cateRef    = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const connectionRef = useSignalR();

  const isHomePage   = location.pathname === "/";
  const isSearchPage = location.pathname === "/search";

  // ── Init data ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData);
      setActiveCate(categoryData[0] ?? null);
    }
  }, [categoryData]);

  useEffect(() => {
    if (notifData) setNotifications(notifData);
  }, [notifData]);

  // SignalR real-time notifications
  useEffect(() => {
    const connection = connectionRef?.current;
    if (!connection) return;

    const handler = (notif) => {
      setNotifications(prev =>
        prev.some(n => n.id === notif.id) ? prev : [notif, ...prev]
      );
    };

    connection.off("ReceiveNotification");
    connection.on("ReceiveNotification", handler);
    return () => connection.off("ReceiveNotification", handler);
  }, [connectionRef?.current]);

  // Sync search input on search page
  useEffect(() => {
    if (isSearchPage) setSearchKeyword(searchParams.get("keyword") || "");
  }, [isSearchPage]);

  // Close dropdowns on outside click / Escape
  useEffect(() => {
    const onMouseDown = (e) => {
      if (cateRef.current    && !cateRef.current.contains(e.target))    setCateOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setCateOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const doSearch = () => {
    const q = searchKeyword.trim();
    if (isSearchPage) setSearchParams(q ? { keyword: q } : {});
    else navigate(q ? `/search?keyword=${encodeURIComponent(q)}` : "/search");
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") doSearch(); };

  const handleCreatePost = () => {
    navigate(user ? "/post/create" : "/login", user ? undefined : { state: { redirectTo: "/post/create" } });
  };

  const handleLogout = async () => {
    try { await api.post("/account/revoke-token"); } catch { /* noop */ }
    logout();
    setDrawerOpen(false);
    navigate("/login");
  };

  const handleNotifClick = async (notif) => {
    await api.post(`/api/notifications/${notif.id}/read`);
    setNotifOpen(false);
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));

    const routes = {
      Transaction:          `/pay/transaction/${notif.relatedId}`,
      PendingPayment:       `/pay/transaction/${notif.relatedId}`,
      PendingPaymentPackage:`/pay/package/${notif.relatedId}`,
      PostApproved:         "/profile",
      PostRejected:         "/profile",
      PostNeedPayment:      `/pay/post/${notif.relatedId}`,
      Confirming:           "/user-transactions",
      AwaitingEvidence:     "/user-transactions",
    };

    if (notif.type === "ReviewReminder") {
      setReviewChatRoomId(notif.relatedId);
    } else {
      navigate(routes[notif.type] ?? "/");
    }
  };

  const closeAll = () => {
    setProfileOpen(false);
    setDrawerOpen(false);
  };

  const navigateTo = (path) => {
    closeAll();
    navigate(path);
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === "Post")        return POST_NOTIF_TYPES.includes(n.type);
    if (notifFilter === "Transaction") return TRANSACTION_NOTIF_TYPES.includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const dashboardLink = () => {
    if (!user) return null;
    if (user.role === "Admin")  return { to: "/admin/post-manager",  icon: faGauge,        label: "Trang quản trị Admin" };
    if (user.role === "Censor") return { to: "/censor/post-censor",  icon: faShieldHalved, label: "Trang kiểm duyệt" };
    return null;
  };

  const dash = dashboardLink();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <header className="hdr">
        <div className="hdr-inner">

          {/* Logo */}
          <Link to="/" className="hdr-logo">
            <img src="/logovientrang.png" alt="ChoRe" />
          </Link>

          {/* Category — desktop mega menu */}
          <div className="hdr-category" ref={cateRef}>
            <button
              className={`hdr-cat-btn ${cateOpen ? "hdr-cat-btn--open" : ""}`}
              onClick={() => setCateOpen(v => !v)}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Danh mục</span>
              <FontAwesomeIcon icon={faAngleDown} className="hdr-cat-chevron" />
            </button>

            {cateOpen && (
              <div className="hdr-cat-panel hdr-cat-panel--mega">
                {/* Left: parent categories */}
                <div className="hdr-mega-left">
                  <div className="hdr-cat-panel-header">Danh mục</div>
                  {categories.map(cate => (
                    <button
                      key={cate.cateId}
                      className={`hdr-cat-item ${activeCate?.cateId === cate.cateId ? "hdr-cat-item--active" : ""}`}
                      onMouseEnter={() => setActiveCate(cate)}
                      onClick={() => { setCateOpen(false); navigate(`/search?cateId=${cate.cateId}`); }}
                    >
                      <span className="hdr-cat-label">{cate.cateName}</span>
                      <FontAwesomeIcon icon={faChevronRight} className="hdr-cat-arrow" />
                    </button>
                  ))}
                </div>

                {/* Right: sub-categories + brands */}
                {activeCate && (
                  <div className="hdr-mega-right">
                    {activeCate.subCategories?.length > 0 && (
                      <div className="hdr-mega-section">
                        <div className="hdr-mega-section-title">Danh mục con</div>
                        <div className="hdr-mega-chips">
                          {activeCate.subCategories.map(sub => (
                            <button
                              key={sub.cateId}
                              className="hdr-mega-chip"
                              onClick={() => { setCateOpen(false); navigate(`/search?cateId=${sub.cateId}`); }}
                            >
                              {sub.cateName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCate.brands?.length > 0 && (
                      <div className="hdr-mega-section">
                        <div className="hdr-mega-section-title">Thương hiệu</div>
                        <div className="hdr-mega-brands">
                          {activeCate.brands.map(brand => (
                            <button
                              key={brand.brandId}
                              className="hdr-mega-brand-card"
                              onClick={() => { setCateOpen(false); navigate(`/search?brandId=${brand.brandId}`); }}
                            >
                              <span>{brand.brandName}</span>
                              {brand.subBrands?.length > 0 && (
                                <div className="hdr-mega-subbrand-list">
                                  {brand.subBrands.map(sb => (
                                    <button
                                      key={sb.brandId}
                                      className="hdr-mega-subbrand"
                                      onClick={(e) => { e.stopPropagation(); setCateOpen(false); navigate(`/search?brandId=${sb.brandId}`); }}
                                    >
                                      {sb.brandName}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!activeCate.subCategories?.length && !activeCate.brands?.length && (
                      <div className="hdr-mega-empty">Chưa có danh mục con hoặc thương hiệu</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search — hidden on home page */}
          {!isHomePage && (
            <div className={`hdr-search ${searchFocused ? "hdr-search--focused" : ""}`}>
              <button className="hdr-search-icon-btn" onClick={doSearch} aria-label="Tìm kiếm">
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <input
                type="text"
                placeholder="Tìm sản phẩm, danh mục, thương hiệu..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchKeyword && (
                <button
                  className="hdr-search-clear"
                  onClick={() => { setSearchKeyword(""); if (isSearchPage) setSearchParams({}); }}
                  aria-label="Xóa"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
              <button className="hdr-search-submit" onClick={doSearch}>Tìm</button>
            </div>
          )}

          {/* Right actions */}
          <div className="hdr-actions">
            <NavIconBtn to="/chat"      icon={faComment} title="Nhắn tin" />
            <NavIconBtn to="/favorites" icon={faHeart}   title="Yêu thích" className="hdr-icon-btn--heart" />

            {/* Notifications */}
            <div className="hdr-notif-wrap" ref={notifRef}>
              <NavIconBtn
                icon={faBell}
                title="Thông báo"
                active={notifOpen}
                onClick={() => setNotifOpen(v => !v)}
              >
                {unreadCount > 0 && (
                  <span className="hdr-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                )}
              </NavIconBtn>

              {notifOpen && (
                <div className="hdr-notif-panel">
                  <div className="hdr-notif-head">
                    <span className="hdr-notif-title">Thông báo</span>
                    {unreadCount > 0 && <span className="hdr-notif-count">{unreadCount} chưa đọc</span>}
                  </div>

                  <div className="hdr-notif-tabs">
                    {NOTIF_TABS.map(tab => (
                      <button
                        key={tab.key}
                        className={`hdr-notif-tab ${notifFilter === tab.key ? "hdr-notif-tab--active" : ""}`}
                        onClick={() => setNotifFilter(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="hdr-notif-list">
                    {filteredNotifs.length === 0 ? (
                      <div className="hdr-notif-empty">
                        <FontAwesomeIcon icon={faBell} />
                        <p>Không có thông báo</p>
                      </div>
                    ) : filteredNotifs.map(item => (
                      <button
                        key={item.id}
                        className={`hdr-notif-item ${!item.isRead ? "hdr-notif-item--unread" : ""}`}
                        onClick={() => handleNotifClick(item)}
                      >
                        {!item.isRead && <span className="hdr-notif-dot" />}
                        <div className="hdr-notif-body">
                          <div className="hdr-notif-row">
                            <span className="hdr-notif-name">{item.title}</span>
                            <span className="hdr-notif-time">{formatNotifDate(item.createdAt)}</span>
                          </div>
                          <p className="hdr-notif-msg">{item.message}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hdr-divider" />

            <Link to="/service-package" className="hdr-pro-link">
              Mua <span className="hdr-pro-badge">GÓI</span>
            </Link>

            <button onClick={handleCreatePost} className="hdr-create-btn">
              <FontAwesomeIcon icon={faPlus} />
              <span>Đăng tin</span>
            </button>

            {/* Auth */}
            {!user ? (
              <Link to="/login" className="hdr-login-btn">Đăng nhập</Link>
            ) : (
              <div className="hdr-profile-wrap" ref={profileRef}>
                <button
                  className={`hdr-avatar-btn ${profileOpen ? "hdr-avatar-btn--open" : ""}`}
                  onClick={e => { e.stopPropagation(); setProfileOpen(v => !v); }}
                >
                  <img src={avatarUrl(user.avatar)} alt="avatar" />
                  <span className="hdr-avatar-name">{user.fullName?.split(" ").pop()}</span>
                  <FontAwesomeIcon icon={faAngleDown} className="hdr-avatar-chevron" />
                </button>

                {profileOpen && (
                  <div className="hdr-profile-panel">
                    <div className="hdr-profile-header">
                      <img src={avatarUrl(user.avatar)} alt="avatar" className="hdr-profile-avatar" />
                      <div>
                        <div className="hdr-profile-name">{user.fullName}</div>
                        <div className="hdr-profile-role">{user.email}</div>
                      </div>
                    </div>

                    <div className="hdr-profile-links">
                      {[
                        { to: "/profile",                  icon: faUser,            label: "Trang cá nhân" },
                        { to: "/service-package-manager",  icon: faLayerGroup,      label: "Quản lý Gói" },
                        { to: "/user-transactions",        icon: faClockRotateLeft, label: "Quản lý giao dịch" },
                        ...(dash ? [dash] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to} className="hdr-profile-item" onClick={closeAll}>
                          <FontAwesomeIcon icon={item.icon} className="hdr-profile-item-icon" />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="hdr-profile-footer">
                      <button onClick={handleLogout} className="hdr-logout-btn">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile: login button + hamburger */}
          {/* {!user && (
            <Link to="/login" className="hdr-mobile-login-btn">
              Đăng nhập
            </Link>
          )} */}
          <button
            className="hdr-mobile-menu-btn"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={drawerOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Mobile search row */}
        {!isHomePage && (
          <div className="hdr-mobile-search-row">
            <button className="hdr-mobile-cat-btn" onClick={() => setCateOpen(v => !v)}>
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Danh mục</span>
            </button>
            <div className="hdr-mobile-search-divider" />
            <div className="hdr-mobile-search-input">
              <FontAwesomeIcon icon={faSearch} onClick={doSearch} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchKeyword && (
                <button onClick={() => { setSearchKeyword(""); if (isSearchPage) setSearchParams({}); }} aria-label="Xóa">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile top bar — login + create (hiện khi ở homepage hoặc cần auth) */}
        {/* {isHomePage && !user && (
          <div className="hdr-mobile-auth-bar">
            <Link to="/login" className="hdr-mobile-login-btn">Đăng nhập</Link>
          </div>
        )} */}

        {/* Mobile category panel */}
        {cateOpen && (
          <>
            <div className="hdr-mobile-backdrop" onClick={() => setCateOpen(false)} />
            <div className="hdr-mobile-cat-panel" onClick={e => e.stopPropagation()}>
              <div className="hdr-cat-panel-header">Danh mục</div>
              {categories.map(cate => (
                <div key={cate.cateId}>
                  <button
                    className={`hdr-cat-item ${mobileExpandedCate === cate.cateId ? "hdr-cat-item--active" : ""}`}
                    onClick={() => setMobileExpandedCate(id => id === cate.cateId ? null : cate.cateId)}
                  >
                    <span className="hdr-cat-label">{cate.cateName}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="hdr-cat-arrow"
                      style={{ transform: mobileExpandedCate === cate.cateId ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </button>

                  {mobileExpandedCate === cate.cateId && (
                    <div className="hdr-mobile-cate-expand">
                      {cate.subCategories?.length > 0 && (
                        <>
                          <div className="hdr-mega-section-title hdr-mobile-section-title">Danh mục con</div>
                          {cate.subCategories.map(sub => (
                            <button
                              key={sub.cateId}
                              className="hdr-mobile-sub-item"
                              onClick={() => { setCateOpen(false); navigate(`/search?cateId=${sub.cateId}`); }}
                            >
                              <FontAwesomeIcon icon={faAngleRight} className="hdr-mobile-sub-icon" />
                              {sub.cateName}
                            </button>
                          ))}
                        </>
                      )}
                      {cate.brands?.length > 0 && (
                        <>
                          <div className="hdr-mega-section-title hdr-mobile-section-title">Thương hiệu</div>
                          <div className="hdr-mobile-brand-chips">
                            {cate.brands.map(brand => (
                              <button
                                key={brand.brandId}
                                className="hdr-mega-chip"
                                onClick={() => { setCateOpen(false); navigate(`/search?brandId=${brand.brandId}`); }}
                              >
                                {brand.brandName}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      <button
                        className="hdr-mobile-sub-item hdr-mobile-sub-item--all"
                        onClick={() => { setCateOpen(false); navigate(`/search?cateId=${cate.cateId}`); }}
                      >
                        Xem tất cả {cate.cateName}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <button className="hdr-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
            <div className="hdr-drawer">

              {/* User info */}
              <div className="hdr-drawer-header">
                {user ? (
                  <div className="hdr-drawer-user">
                    <img src={avatarUrl(user.avatar)} alt="avatar" className="hdr-drawer-avatar" />
                    <div>
                      <div className="hdr-drawer-name">{user.fullName}</div>
                      <div className="hdr-drawer-email">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="hdr-drawer-guest">
                    <p className="hdr-drawer-guest-msg">
                      Đăng nhập để sử dụng các tính năng và nhận thông báo nhanh chóng!
                    </p>
                    <div className="hdr-drawer-guest-btns">
                      <Link
                        to="/login"
                        className="hdr-drawer-login-btn"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="hdr-drawer-register-btn"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="hdr-drawer-body">

                {/* Đăng tin */}
                <button onClick={() => { setDrawerOpen(false); handleCreatePost(); }} className="hdr-drawer-create">
                  <FontAwesomeIcon icon={faPlus} />
                  Đăng tin
                </button>

                <div className="hdr-drawer-divider" />

                {/* Danh mục — accordion */}
                <div className="hdr-drawer-accordion">
                  <button
                    className={`hdr-drawer-acc-btn ${drawerCateOpen ? "open" : ""}`}
                    onClick={() => setDrawerCateOpen(v => !v)}
                  >
                    <span className="hdr-drawer-acc-left">
                      <FontAwesomeIcon icon={faLayerGroup} />
                      Danh mục
                    </span>
                    <FontAwesomeIcon icon={faAngleDown} className="hdr-drawer-acc-chevron" />
                  </button>

                  {drawerCateOpen && (
                    <div className="hdr-drawer-cate-list">
                      {categories.map(cate => (
                        <div key={cate.cateId}>
                          <button
                            className={`hdr-drawer-cate-item ${mobileExpandedCate === cate.cateId ? "open" : ""}`}
                            onClick={() => setMobileExpandedCate(id => id === cate.cateId ? null : cate.cateId)}
                          >
                            <span>{cate.cateName}</span>
                            <FontAwesomeIcon icon={faChevronRight} className="hdr-drawer-cate-arrow" />
                          </button>

                          {mobileExpandedCate === cate.cateId && (
                            <div className="hdr-drawer-sub-list">
                              {cate.subCategories?.map(sub => (
                                <button key={sub.cateId} className="hdr-drawer-sub-item"
                                  onClick={() => { setDrawerOpen(false); navigate(`/search?cateId=${sub.cateId}`); }}>
                                  <FontAwesomeIcon icon={faAngleRight} /> {sub.cateName}
                                </button>
                              ))}
                              {cate.brands?.map(brand => (
                                <button key={brand.brandId} className="hdr-drawer-sub-item hdr-drawer-sub-item--brand"
                                  onClick={() => { setDrawerOpen(false); navigate(`/search?brandId=${brand.brandId}`); }}>
                                  <FontAwesomeIcon icon={faAngleRight} /> {brand.brandName}
                                </button>
                              ))}
                              <button className="hdr-drawer-sub-item hdr-drawer-sub-item--all"
                                onClick={() => { setDrawerOpen(false); navigate(`/search?cateId=${cate.cateId}`); }}>
                                Xem tất cả {cate.cateName}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thông báo — accordion */}
                <div className="hdr-drawer-accordion">
                  <button
                    className={`hdr-drawer-acc-btn ${drawerNotifOpen ? "open" : ""}`}
                    onClick={() => setDrawerNotifOpen(v => !v)}
                  >
                    <span className="hdr-drawer-acc-left">
                      <FontAwesomeIcon icon={faBell} />
                      Thông báo
                      {unreadCount > 0 && (
                        <span className="hdr-drawer-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                      )}
                    </span>
                    <FontAwesomeIcon icon={faAngleDown} className="hdr-drawer-acc-chevron" />
                  </button>

                  {drawerNotifOpen && (
                    <div className="hdr-drawer-notif">
                      <div className="hdr-drawer-notif-tabs">
                        {NOTIF_TABS.map(tab => (
                          <button key={tab.key}
                            className={`hdr-drawer-notif-tab ${notifFilter === tab.key ? "active" : ""}`}
                            onClick={() => setNotifFilter(tab.key)}>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div className="hdr-drawer-notif-list">
                        {filteredNotifs.length === 0 ? (
                          <p className="hdr-drawer-notif-empty">Không có thông báo</p>
                        ) : filteredNotifs.map(item => (
                          <button key={item.id}
                            className={`hdr-drawer-notif-item ${!item.isRead ? "unread" : ""}`}
                            onClick={() => { setDrawerOpen(false); handleNotifClick(item); }}>
                            {!item.isRead && <span className="hdr-notif-dot" />}
                            <div className="hdr-drawer-notif-body">
                              <div className="hdr-drawer-notif-row">
                                <span>{item.title}</span>
                                <span className="hdr-drawer-notif-time">{formatNotifDate(item.createdAt)}</span>
                              </div>
                              <p className="hdr-drawer-notif-msg">{item.message}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hdr-drawer-divider" />

                {/* Nav links */}
                <nav className="hdr-drawer-nav">
                  {[
                    { to: "/chat",            icon: faComment,    label: "Nhắn tin" },
                    { to: "/favorites",       icon: faHeart,      label: "Yêu thích" },
                    { to: "/service-package", icon: faCreditCard, label: "Mua Gói" },
                  ].map(item => (
                    <Link key={item.to} to={item.to} className="hdr-drawer-link" onClick={() => setDrawerOpen(false)}>
                      <FontAwesomeIcon icon={item.icon} /> {item.label}
                    </Link>
                  ))}

                  {user && [
                    { to: "/profile",                 icon: faUser,            label: "Trang cá nhân" },
                    { to: "/manage-posts",            icon: faLayerGroup,      label: "Tin của tôi" },
                    { to: "/service-package-manager", icon: faCreditCard,      label: "Quản lý Gói" },
                    { to: "/user-transactions",       icon: faClockRotateLeft, label: "Giao dịch" },
                    ...(dash ? [dash] : []),
                  ].map(item => (
                    <Link key={item.to} to={item.to} className="hdr-drawer-link" onClick={() => setDrawerOpen(false)}>
                      <FontAwesomeIcon icon={item.icon} /> {item.label}
                    </Link>
                  ))}
                </nav>

              </div>

              {user && (
                <div className="hdr-drawer-footer">
                  <button onClick={handleLogout} className="hdr-drawer-logout">
                    <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      {/* Review modal */}
      {reviewChatRoomId && (
        <ReviewForm
          chatRoomId={reviewChatRoomId}
          userId={user.userId}
          onClose={() => setReviewChatRoomId(null)}
          reload={() => navigate(0)}
        />
      )}
    </>
  );
}