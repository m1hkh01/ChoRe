import "@/assets/service-package.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import Pay from "../Pay/Pay";
import { useAuthStore } from "../../store/auth";

function ServicePackage() {
    const swiperRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [isPay, setIsPay] = useState(false);
    const [packages, setPackages] = useState([]);
    const [selectPackage, setSelectPackage] = useState(null);
    const [orderCode, setOrderCode] = useState("");
    const [currentUserSubPlan, setCurrentUserSubPlan] = useState("");

    const displayPackages =
        packages.length > 0 && packages.length < 6
            ? [...packages, ...packages]
            : packages;

    const handlePay = async (pkg) => {
        const res = await api.post("/api/package/order", pkg);
        navigate(`/pay/package/${res.data.orderId}`);
    };

    const handleSwiperMount = (swiper) => {
        swiperRef.current = swiper;
        swiper.el.addEventListener("mouseover", (e) => {
            if (e.target.closest(".swiper-slide-active")) {
                swiperRef.current?.autoplay.stop();
            }
        });
        swiper.el.addEventListener("mouseout", (e) => {
            if (e.target.closest(".swiper-slide-active")) {
                swiperRef.current?.autoplay.start();
            }
        });
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await api.get(`/api/package/all/${user?.userId || 0}`);
                let pkgList = res.data.package;
                const currentPlan = res.data.currentPackage;

                if (currentPlan !== 1 && currentPlan !== 0) {
                    pkgList = pkgList.filter((p) => p.subPlanId !== 1);
                }

                setPackages(pkgList);
                setCurrentUserSubPlan(currentPlan);
            } catch (error) {
                console.error("Fetch package failed:", error);
            }
        };
        fetchPackages();
    }, [selectPackage]);

    if (isPay) {
        return (
            <Pay
                pkg={selectPackage}
                orderCode={orderCode}
                paymentType="Package"
                onClose={() => {
                    setSelectPackage(null);
                    setIsPay(false);
                }}
            />
        );
    }

    return (
        <div className="package-container">
            {/* Hero section */}
            <div className="pkg-hero">
                <div className="pkg-hero-eyebrow">Gói đăng bài</div>
                <h2>Chọn gói phù hợp</h2>
                <h4>
                    Bạn chỉ được sử dụng 1 gói trong thời gian của gói đã đăng ký
                </h4>
            </div>

            {displayPackages.length > 0 && (
                <Swiper
                    key={displayPackages.length}
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={3}
                    centeredSlides
                    loop
                    grabCursor
                    speed={600}
                    autoplay={{ delay: 1800, disableOnInteraction: false }}
                    onSwiper={handleSwiperMount}
                    className="service-swiper"
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 12, centeredSlides: true },
                        480: { slidesPerView: 1.2, spaceBetween: 16, centeredSlides: true },
                        640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: true },
                        900: { slidesPerView: 3, spaceBetween: 24, centeredSlides: true },
                    }}
                >
                    {displayPackages.map((pkg, index) => {
                        const isCurrentPlan = pkg.subPlanId === currentUserSubPlan;
                        const isFree = pkg.subPlanPrice === 0;
                        const hasFreeTransaction = pkg.maxFreePlatformFeePerSub > 0;

                        return (
                            <SwiperSlide
                                key={index}
                                className={`swiper-slide${isCurrentPlan ? " active" : ""}`}
                            >
                                {/* Header */}
                                <div className="package-card-header">
                                    <h2>{pkg.subPlanName}</h2>
                                    <span>{pkg.subPlanTitle}</span>
                                </div>

                                {/* Body */}
                                <div className="package-card-body">
                                    {/* Price */}
                                    <div className="package-card-price">
                                        {isFree ? (
                                            <span className="price-free">Miễn Phí</span>
                                        ) : (
                                            <>
                                                <strong>
                                                    {pkg.subPlanPrice.toLocaleString("vi-VN")}đ
                                                </strong>
                                                <small>/ {pkg.durationDays} ngày</small>
                                            </>
                                        )}
                                    </div>

                                    {/* Promo */}
                                    <div className="promo-text">
                                        <p>{pkg.subPlanPromo}</p>
                                    </div>

                                    {/* CTA */}
                                    {isCurrentPlan ? (
                                        <button className="package-card-btn disabled" disabled>
                                            Đang sử dụng
                                        </button>
                                    ) : (
                                        <button
                                            className="package-card-btn"
                                            onClick={() => handlePay(pkg)}
                                        >
                                            Mua ngay
                                        </button>
                                    )}

                                    {/* Features */}
                                    <div className="package-card-summary">
                                        <SummaryItem
                                            active
                                            label="Lượt đăng tin / tháng"
                                            value={pkg.maxPostPerSub}
                                        />
                                        <SummaryItem
                                            active
                                            label="Lượt đăng tin miễn phí"
                                            value={pkg.maxFreePost}
                                        />
                                        <SummaryItem
                                            active={pkg.maxFeaturedPosts > 0}
                                            label="Lượt đăng tin nổi bật"
                                            value={pkg.maxFeaturedPosts > 0 ? `${pkg.maxFeaturedPosts} bài` : "Không có"}
                                        />
                                        <SummaryItem
                                            active
                                            label="Hạng"
                                            value={getTierLabel(pkg.featuredPriority)}
                                        />
                                        <SummaryItem
                                            active={hasFreeTransaction}
                                            label="Giao dịch trung gian miễn phí"
                                            value={pkg.maxFreePlatformFeePerSub}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
        </div>
    );
}

function SummaryItem({ active, label, value }) {
    return (
        <div className="summary-item">
            <div className={active ? "summary-item-active" : "summary-item-inactive"}>
                <FontAwesomeIcon icon={active ? faCheck : faX} />
            </div>
            <div className="summary-item-label">
                <span>{label}</span>
                <span>{value}</span>
            </div>
        </div>
    );
}

const FEATURE_TIERS = [
    { value: 0, label: "Bình thường" },
    { value: 1, label: "Vip" },
    { value: 2, label: "Premium" },
    { value: 3, label: "Business" },
    { value: 4, label: "Luxury" },
];

const getTierLabel = (value) => FEATURE_TIERS.find((tier) => tier.label === value)?.label ?? "Bình thường";

export default ServicePackage;