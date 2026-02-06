import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch, faMobileScreen, faAngleRight, faList } from "@fortawesome/free-solid-svg-icons";
import { faComment, faBell, faHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Header() {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const handleCreatePost = () => {
        if (!user) {
            navigate("/login", {
                state: { redirectTo: "/post/create" }
            });
        } else {
            navigate("/post/create");
        }
    };

    // Đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const renderDashboardLink = () => {
        if (!user) return null;

        if (user.role === "Admin") {
            return (
                <Link
                    to="/admin/post-manager"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                    Trang quản trị Admin
                </Link>
            );
        }

        if (user.role === "Censor") {
            return (
                <Link
                    to="/censor/post-censor"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                    Trang kiểm duyệt
                </Link>
            );
        }

        return null;
    };

    return (
        <header className="flex items-center h-18 bg-green-600 p-4 border-b border-green-500/25 shadow-sm z-50">
            {/* LOGO */}
            <Link to="/" className="flex items-center">
                <div className="p-2 flex items-center justify-center">
                    <img
                        src="/logodenrmvbg.png"
                        alt="LogoChoRe"
                        className="h-20 w-35 object-contain p-1"
                    />
                </div>
            </Link>

            <div className="relative" ref={dropdownRef}>
                <div className="flex items-center 
                                rounded-2 bg-(--primary-color) 
                                w-auto p-2 text-md 
                                font-semibold text-white
                                cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    <FontAwesomeIcon icon={faList} />
                    <span onClick={(e) => { e.stopPropagation(); setOpen((prev) => !prev) }}>Danh mục</span>
                    <FontAwesomeIcon icon={faAngleDown} />
                </div>

                {open && (
                    <>
                        <div className="absolute right-0 z-100 mt-2 w-48 bg-white rounded-lg shadow-lg">
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">Điện thoại</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">Laptop</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">Bàn phím</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">PC, Màn hình</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">Âm thanh, mic thu âm</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">Phụ kiện</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                            <div className="flex justify-between items-center p-2 text-[16px] font-semibold hover:bg-gray-100">
                                <FontAwesomeIcon icon={faMobileScreen} />
                                <span className="px-2 flex-1">Đồng hồ thông minh</span>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* NAV */}
            <nav className="flex-1 flex justify-center items-center gap-6">
                <div className="w-[calc(100%-200px)] flex-1 mx-5 h-11 rounded-4xl bg-[white] flex items-center justify-between">
                    <div className="w-7.5 flex justify-end">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm, danh mục hay thương hiệu mong muốn ..."
                        className="w-full h-full rounded-4xl px-4 outline-none border-none"
                    />
                </div>
            </nav>
            {/* ACTIONS */}
            <div className="flex items-center gap-2">
                {/* Nhắn tin */}
                <Link to="/chat" className="w-10 h-10 text-black rounded-circle d-flex justify-center items-center bg-white cursor-pointer">
                    <FontAwesomeIcon icon={faComment} className="text-xl" />
                </Link>
                {/* Tin yêu thích */}
                <div className="w-10 h-10 rounded-circle d-flex justify-center items-center bg-white cursor-pointer">
                    <FontAwesomeIcon icon={faHeart} className="text-xl" />
                </div>
                {/* Thông báo */}
                <div className="w-10 h-10 rounded-circle d-flex justify-center items-center bg-white cursor-pointer">
                    <FontAwesomeIcon icon={faBell} className="text-xl " />
                </div>
                {/* GÓI PRO */}
                <Link
                    to="/service-package"
                    className="text-black text-decoration-none font-semibold text-xl px-3"
                >
                    Gói <span className="text-yellow-400">PRO</span>
                </Link>

                {/* ĐĂNG TIN */}
                <button
                    onClick={handleCreatePost}
                    className="
        flex items-center gap-1
        rounded-2
        bg-(--primary-color)
        px-3 py-2
        text-sm font-semibold text-white
        cursor-pointer
        hover:opacity-95
        transition
    "
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Đăng tin</span>
                </button>

                {/* AUTH */}
                {!user ? (
                    <div className="flex gap-2">
                        <Link
                            to="/login"
                            className="bg-[#1A6A3A] text-sm text-decoration-none text-white px-3 py-2 rounded-lg font-bold hover:opacity-95 hover:-translate-y-px transition"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                ) : (
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-circle bg-(--primary-color) flex justify-center items-center text-xl">
                            <img src="https://i.pravatar.cc/40" className="w-full h-full p-1 rounded-circle" />
                        </div>

                        {/* DROPDOWN */}
                        <div className="absolute right-0 top-8 z-10 mt-2 w-52 bg-white rounded-lg shadow-lg hidden group-hover:block">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm rounded-lg hover:bg-gray-100"
                            >
                                Trang cá nhân
                            </Link>

                            <Link
                                to="/service-package-manager"
                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                Quản lý Gói
                            </Link>
                            <Link
                                to="/user-transactions"
                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                Quản lý các giao dịch
                            </Link>

                            {renderDashboardLink()}

                            <div className="border-t my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
