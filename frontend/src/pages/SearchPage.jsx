import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch, faFilter, faSlidersH, faChevronDown, faChevronUp,
    faTimes, faSort, faSpinner, faBoxOpen, faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import PostCard from "@/components/Post/PostCard";
import provinceData from "@/data/sauSapNhap/province.json";
import wardData from "@/data/sauSapNhap/ward.json";
import "@/assets/SearchPage.css";

const API_BASE = "http://localhost:5121/api";

const SORT_OPTIONS = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
];

const PRICE_RANGES = [
    { label: "Dưới 1 triệu", min: 0, max: 1000000 },
    { label: "1 – 3 triệu", min: 1000000, max: 3000000 },
    { label: "3 – 5 triệu", min: 3000000, max: 5000000 },
    { label: "5 – 10 triệu", min: 5000000, max: 10000000 },
    { label: "Trên 10 triệu", min: 10000000, max: null },
];

const PRICE_TYPES = [
    { value: "", label: "Tất cả" },
    { value: "NEGOTIABLE", label: "Thương lượng" },
    { value: "FIXED", label: "Giá cố định" },
    { value: "RANGE", label: "Khoảng giá" },
];

// Chuyển object JSON → array, sort theo tên
const provinces = Object.values(provinceData).sort((a, b) =>
    a.name.localeCompare(b.name, "vi")
);

function CollapsibleSection({ title, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="filter-section">
            <button className="filter-section-header" onClick={() => setOpen(!open)}>
                <span>{title}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </button>
            {open && <div className="filter-section-body">{children}</div>}
        </div>
    );
}

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const urlKeyword = searchParams.get("keyword") || "";

    // ── Filter state ───────────────────────────────────────────────
    const [selectedCateId, setSelectedCateId] = useState(
        searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")) : null
    );
    const [selectedBrandId, setSelectedBrandId] = useState(
        searchParams.get("brandId") ? parseInt(searchParams.get("brandId")) : null
    );
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [selectedPriceType, setSelectedPriceType] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // ── Địa chỉ: chọn tỉnh → ward ─────────────────────────────────
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedWardCode, setSelectedWardCode] = useState("");
    const [appliedAddress, setAppliedAddress] = useState(searchParams.get("address") || "");

    // Wards thuộc tỉnh đang chọn
    const wardsForProvince = useMemo(() => {
        if (!selectedProvinceCode) return [];
        return Object.values(wardData)
            .filter(w => w.parent_code === selectedProvinceCode)
            .sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }, [selectedProvinceCode]);

    // Reset ward khi đổi tỉnh
    useEffect(() => {
        setSelectedWardCode("");
    }, [selectedProvinceCode]);

    // ── Data state ─────────────────────────────────────────────────
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [allBrands, setAllBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // ── Fetch brands ───────────────────────────────────────────────
    useEffect(() => {
        fetch(`${API_BASE}/brands`)
            .then(r => r.ok ? r.json() : [])
            .then(setAllBrands)
            .catch(() => setAllBrands([]));
    }, []);

    // ── Fetch categories theo brand ────────────────────────────────
    useEffect(() => {
        const url = selectedBrandId
            ? `${API_BASE}/categories/by-brand/${selectedBrandId}`
            : `${API_BASE}/categories`;

        fetch(url)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                setCategories(data);
                if (selectedCateId && !data.find(c => c.cateId === selectedCateId)) {
                    setSelectedCateId(null);
                }
            })
            .catch(() => setCategories([]));
    }, [selectedBrandId]);

    // ── Fetch posts ────────────────────────────────────────────────
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (urlKeyword) params.set("keyword", urlKeyword);
            if (selectedBrandId) params.set("brandId", selectedBrandId);
            if (selectedCateId) params.set("categoryId", selectedCateId);
            if (minPrice && selectedPriceType !== "NEGOTIABLE") params.set("minPrice", minPrice);
            if (maxPrice && selectedPriceType !== "NEGOTIABLE") params.set("maxPrice", maxPrice);

            const res = await fetch(`${API_BASE}/posts/home?${params}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPosts(data);
        } catch {
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [urlKeyword, selectedBrandId, selectedCateId, minPrice, maxPrice]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    // ── Client-side filter: priceType + appliedAddress + sort ──────
    useEffect(() => {
        let result = [...posts];

        if (selectedPriceType) {
            result = result.filter(p => p.priceType === selectedPriceType);
        }

        if (appliedAddress.trim()) {
            const addrLower = appliedAddress.trim().toLowerCase();
            result = result.filter(p => p.address?.toLowerCase().includes(addrLower));
        }

        result.sort((a, b) => {
            const getPrice = (p) => {
                if (p.priceType === "FIXED") return p.price ?? 0;
                if (p.priceType === "RANGE") return ((p.minPrice ?? 0) + (p.maxPrice ?? 0)) / 2;
                return 0;
            };
            switch (sortBy) {
                case "oldest":     return new Date(a.createdAt) - new Date(b.createdAt);
                case "price_asc":  return getPrice(a) - getPrice(b);
                case "price_desc": return getPrice(b) - getPrice(a);
                default:           return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        setFilteredPosts(result);
    }, [posts, selectedPriceType, appliedAddress, sortBy]);

    // ── Tính địa chỉ sẽ apply ─────────────────────────────────────
    const buildAddressString = () => {
        if (!selectedProvinceCode) return "";
        const province = provinceData[selectedProvinceCode];
        if (selectedWardCode) {
            const ward = wardData[selectedWardCode];
            // dùng "path" của ward: "Minh Châu, Hà Nội"
            return ward?.path || province?.name || "";
        }
        return province?.name || "";
    };

    // ── Apply filter ───────────────────────────────────────────────
    const handleApplyFilter = () => {
        const addr = buildAddressString();
        setAppliedAddress(addr);

        const params = {};
        if (urlKeyword) params.keyword = urlKeyword;
        if (selectedCateId) params.categoryId = selectedCateId;
        if (selectedBrandId) params.brandId = selectedBrandId;
        if (minPrice && selectedPriceType !== "NEGOTIABLE") params.minPrice = minPrice;
        if (maxPrice && selectedPriceType !== "NEGOTIABLE") params.maxPrice = maxPrice;
        if (addr) params.address = addr;
        setSearchParams(params, { preventScrollReset: true });
        setMobileFilterOpen(false);
    };

    const handleReset = () => {
        setSelectedCateId(null);
        setSelectedBrandId(null);
        setMinPrice("");
        setMaxPrice("");
        setSelectedPriceType("");
        setSortBy("newest");
        setSelectedProvinceCode("");
        setSelectedWardCode("");
        setAppliedAddress("");
        setSearchParams(urlKeyword ? { keyword: urlKeyword } : {}, { preventScrollReset: true });
    };

    const handlePriceRange = (range) => {
        setMinPrice(range.min ?? "");
        setMaxPrice(range.max ?? "");
    };

    const handlePriceTypeChange = (val) => {
        setSelectedPriceType(val);
        if (val === "NEGOTIABLE") {
            setMinPrice("");
            setMaxPrice("");
        }
    };

    // Label hiển thị khu vực đang chọn (chưa apply)
    const pendingAddressLabel = buildAddressString();

    const activeCount = [
        selectedCateId,
        selectedBrandId,
        (minPrice || maxPrice) && selectedPriceType !== "NEGOTIABLE",
        selectedPriceType,
        appliedAddress,
    ].filter(Boolean).length;

    // ── Sidebar ────────────────────────────────────────────────────
    const FilterSidebar = () => (
        <aside className="search-sidebar">
            <div className="sidebar-header">
                <span><FontAwesomeIcon icon={faSlidersH} /> Bộ lọc</span>
                {activeCount > 0 && (
                    <button className="reset-btn" onClick={handleReset}>
                        <FontAwesomeIcon icon={faTimes} /> Xoá tất cả
                    </button>
                )}
            </div>

            {/* Thương hiệu */}
            <CollapsibleSection title="Thương hiệu">
                <div className="filter-list">
                    <label className={`filter-radio ${!selectedBrandId ? "active" : ""}`}>
                        <input type="radio" name="brand" checked={!selectedBrandId} onChange={() => setSelectedBrandId(null)} />
                        Tất cả thương hiệu
                    </label>
                    {allBrands.map(b => (
                        <label key={b.brandId} className={`filter-radio ${selectedBrandId === b.brandId ? "active" : ""}`}>
                            <input type="radio" name="brand" checked={selectedBrandId === b.brandId} onChange={() => setSelectedBrandId(b.brandId)} />
                            {b.brandName}
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            {/* Danh mục */}
            <CollapsibleSection title="Danh mục">
                <div className="filter-list">
                    <label className={`filter-radio ${!selectedCateId ? "active" : ""}`}>
                        <input type="radio" name="category" checked={!selectedCateId} onChange={() => setSelectedCateId(null)} />
                        Tất cả danh mục
                    </label>
                    {categories.length === 0 && selectedBrandId && (
                        <p className="filter-empty-note">Không có danh mục</p>
                    )}
                    {categories.map(c => (
                        <label key={c.cateId} className={`filter-radio ${selectedCateId === c.cateId ? "active" : ""}`}>
                            <input type="radio" name="category" checked={selectedCateId === c.cateId} onChange={() => setSelectedCateId(c.cateId)} />
                            {c.cateName}
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            {/* Loại giá */}
            <CollapsibleSection title="Loại giá">
                <div className="filter-list">
                    {PRICE_TYPES.map(pt => (
                        <label key={pt.value} className={`filter-radio ${selectedPriceType === pt.value ? "active" : ""}`}>
                            <input type="radio" name="priceType" checked={selectedPriceType === pt.value} onChange={() => handlePriceTypeChange(pt.value)} />
                            {pt.label}
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            {/* Khoảng giá */}
            {selectedPriceType !== "NEGOTIABLE" && (
                <CollapsibleSection title="Khoảng giá">
                    <div className="price-quick">
                        {PRICE_RANGES.map(r => (
                            <button
                                key={r.label}
                                className={`price-quick-btn ${minPrice == r.min && maxPrice == (r.max ?? "") ? "active" : ""}`}
                                onClick={() => handlePriceRange(r)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <div className="price-inputs">
                        <input type="number" placeholder="Từ (₫)" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0} />
                        <span className="price-sep">–</span>
                        <input type="number" placeholder="Đến (₫)" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0} />
                    </div>
                </CollapsibleSection>
            )}

            {/* Khu vực - chọn tỉnh → ward */}
            <CollapsibleSection title="Khu vực">
                <div className="location-selects">
                    {/* Chọn Tỉnh/Thành phố */}
                    <div className="location-select-wrap">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                        <select
                            className="location-select"
                            value={selectedProvinceCode}
                            onChange={e => setSelectedProvinceCode(e.target.value)}
                        >
                            <option value="">-- Tỉnh / Thành phố --</option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Chọn Phường/Xã — chỉ hiện khi đã chọn tỉnh */}
                    {selectedProvinceCode && (
                        <div className="location-select-wrap">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" style={{ opacity: 0.5 }} />
                            <select
                                className="location-select"
                                value={selectedWardCode}
                                onChange={e => setSelectedWardCode(e.target.value)}
                            >
                                <option value="">-- Phường / Xã (tùy chọn) --</option>
                                {wardsForProvince.map(w => (
                                    <option key={w.code} value={w.code}>{w.name_with_type}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Preview địa chỉ sẽ lọc */}
                    {pendingAddressLabel && pendingAddressLabel !== appliedAddress && (
                        <p className="filter-hint">
                            Sẽ lọc: <strong>{pendingAddressLabel}</strong>
                        </p>
                    )}
                    {pendingAddressLabel && pendingAddressLabel === appliedAddress && (
                        <p className="filter-applied-note">
                            Đang lọc: <strong>{appliedAddress}</strong>
                        </p>
                    )}
                </div>
            </CollapsibleSection>

            <button className="apply-filter-btn" onClick={handleApplyFilter}>
                <FontAwesomeIcon icon={faSearch} /> Áp dụng bộ lọc
            </button>
        </aside>
    );

    return (
        <div className="search-page">
            <div className="search-layout">
                <FilterSidebar />

                <main className="search-main">
                    <div className="search-toolbar">
                        <div className="toolbar-left">
                            <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
                                <FontAwesomeIcon icon={faFilter} />
                                Bộ lọc
                                {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
                            </button>
                            <span className="result-count">
                                {loading ? "Đang tải..." : `${filteredPosts.length} kết quả`}
                                {urlKeyword && <strong> cho "{urlKeyword}"</strong>}
                            </span>
                        </div>
                        <div className="toolbar-right">
                            <FontAwesomeIcon icon={faSort} />
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <div className="active-filters">
                            {selectedBrandId && (
                                <span className="filter-tag">
                                    {allBrands.find(b => b.brandId === selectedBrandId)?.brandName}
                                    <button onClick={() => setSelectedBrandId(null)}><FontAwesomeIcon icon={faTimes} /></button>
                                </span>
                            )}
                            {selectedCateId && (
                                <span className="filter-tag">
                                    {categories.find(c => c.cateId === selectedCateId)?.cateName}
                                    <button onClick={() => setSelectedCateId(null)}><FontAwesomeIcon icon={faTimes} /></button>
                                </span>
                            )}
                            {selectedPriceType && (
                                <span className="filter-tag">
                                    {PRICE_TYPES.find(p => p.value === selectedPriceType)?.label}
                                    <button onClick={() => handlePriceTypeChange("")}><FontAwesomeIcon icon={faTimes} /></button>
                                </span>
                            )}
                            {(minPrice || maxPrice) && selectedPriceType !== "NEGOTIABLE" && (
                                <span className="filter-tag">
                                    {minPrice ? `${parseInt(minPrice).toLocaleString("vi-VN")}₫` : "0"}
                                    {" – "}
                                    {maxPrice ? `${parseInt(maxPrice).toLocaleString("vi-VN")}₫` : "∞"}
                                    <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}><FontAwesomeIcon icon={faTimes} /></button>
                                </span>
                            )}
                            {appliedAddress && (
                                <span className="filter-tag">
                                    📍 {appliedAddress}
                                    <button onClick={() => {
                                        setSelectedProvinceCode("");
                                        setSelectedWardCode("");
                                        setAppliedAddress("");
                                    }}><FontAwesomeIcon icon={faTimes} /></button>
                                </span>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="search-loading">
                            <FontAwesomeIcon icon={faSpinner} spin />
                            <p>Đang tìm kiếm...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="search-empty">
                            <FontAwesomeIcon icon={faBoxOpen} />
                            <h3>Không tìm thấy kết quả</h3>
                            <p>Thử thay đổi từ khoá hoặc điều chỉnh bộ lọc</p>
                            <button onClick={handleReset} className="reset-search-btn">Xoá bộ lọc</button>
                        </div>
                    ) : (
                        <div className="search-grid">
                            {filteredPosts.map(post => (
                                <PostCard key={post.postId} post={post} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {mobileFilterOpen && (
                <>
                    <div className="drawer-backdrop" onClick={() => setMobileFilterOpen(false)} />
                    <div className="filter-drawer">
                        <div className="drawer-header">
                            <span>Bộ lọc</span>
                            <button onClick={() => setMobileFilterOpen(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="drawer-body">
                            <FilterSidebar />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchPage;