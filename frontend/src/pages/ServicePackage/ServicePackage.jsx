import "@/assets/service-package.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
// import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import api from "@/api";
import Pay from "../Pay/Pay";
import { useSignalR } from "../../signalr/SignalRContext";
import { Toast } from "../../utils/toast";
function ServicePackage() {
    const swiperRef = useRef(null);
    const [isPay, setIsPay] = useState(false);
    const [packages, setPackages] = useState([]);
    const [selectPackage, setSelectPackage] = useState(null);
    const [orderCode, setOrderCode] = useState("");
    const [currentUserSubPlan, setCurrentUserSubPlan] = useState("");

    const displayPackages =
        packages.length < 6 && packages.length > 0
            ? [...packages, ...packages]
            : packages;
    
    const handlePay = async (pkg) => {
        setIsPay(true);
        setSelectPackage(pkg);
        const res = await api.post("/api/package/order", pkg);
        console.log("Order Code: ",res.data.orderCode)
        setOrderCode(res.data.orderCode);
    }
    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching package data...");
            try {
                const res = await api.get("/api/package");

                let packages = res.data.package;
                const currentPlan = res.data.currentPackage;
                // nếu current plan = 1 thì bỏ package id = 1
                if (currentPlan !== 1) {
                    packages = packages.filter(p => p.subPlanId !== 1);
                }
                setPackages(packages);
                console.log(res.data.package);
                setCurrentUserSubPlan(currentPlan);
            } catch (error) {
                // Nên xử lý lỗi, ví dụ: toast.error hoặc set error state
                console.error("Fetch package failed:", error);
            }
        };

        fetchData();
    }, [selectPackage]);
    return (

        <div className="package-container">
            {!isPay ? (
                <>

                    <h2>Chọn gói đăng bài</h2>
                    <h4 className="text-center"><strong>Lưu ý:</strong> Bạn chỉ được sử dụng 1 gói trong thời gian thời gian của gói đã đăng ký</h4>
                    <Swiper
                        key={displayPackages.length}
                        modules={[Autoplay]}
                        spaceBetween={40}
                        slidesPerView={3}
                        centeredSlides
                        loop
                        grabCursor
                        speed={600}
                        autoplay={{
                            delay: 1200,
                            disableOnInteraction: false,
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper
                            swiper.el.addEventListener("mouseover", (e) => {
                                if (e.target.closest(".swiper-slide-active")) {
                                    swiperRef?.current?.autoplay.stop();
                                }
                            });

                            swiper.el.addEventListener("mouseout", (e) => {
                                if (e.target.closest(".swiper-slide-active")) {
                                    swiperRef?.current?.autoplay.start();
                                }
                            });
                        }}
                        className="service-swiper"
                    >
                        {
                            displayPackages.length > 0 ? displayPackages.map((pkg, index) => {
                                return (
                                    <SwiperSlide className={pkg.subPlanId == currentUserSubPlan ? "swiper-slide active" : "swiper-slide"} key={index}>
                                        <div className="package-card-header">
                                            <h2>{pkg.subPlanName}</h2>
                                            <span>{pkg.subPlanTitle}</span>
                                        </div>
                                        <div className="package-card-body">
                                            <div>
                                                <div className="package-card-price">
                                                    {
                                                        pkg.subPlanPrice > 0 ? (
                                                            <>
                                                                <strong>{pkg.subPlanPrice.toLocaleString("vi-VN")}</strong> / <small>{pkg.durationDays} ngày</small>
                                                            </>
                                                        ) : (
                                                                <strong style={{color: "var(--primary-color)"}}>Miễn Phí</strong>
                                                        )
                                                    }
                                                </div>
                                                <div className="promo-text">
                                                    <p>{pkg.subPlanPromo}</p>
                                                </div>
                                                {
                                                    pkg.subPlanId == currentUserSubPlan ? (
                                                        <button className = "package-card-btn disabled">Đang sử dụng</button>
                                                    ): (
                                                        <button className="package-card-btn" onClick={() => handlePay(pkg)}>Mua ngay</button>
                                                    ) 
                                                }
                                            </div>
                                            <div className="package-card-summary">
                                                <div className="summary-item">
                                                    <div className="summary-item-active">
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </div>
                                                    <div className="summary-item-label">
                                                        <span>Lượt đăng tin trên tháng</span>
                                                        <span>{ pkg.maxPostPerSub }</span>
                                                    </div>

                                                </div>
                                                <div className="summary-item">
                                                    <div className="summary-item-active">
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </div>
                                                    <div className="summary-item-label">
                                                        <span>Lượt đăng tin miễn phí</span>
                                                        <span>{ pkg.maxFreePost }</span>
                                                    </div>

                                                </div>
                                                <div className="summary-item">
                                                    <div className={pkg.maxFreePlatformFeePerSub == 0 ? "summary-item-inactive" : "summary-item-active"}>
                                                        <FontAwesomeIcon icon={pkg.maxFreePlatformFeePerSub == 0 ? faX : faCheck} />
                                                    </div>
                                                    <div className="summary-item-label">
                                                        <span>Lượt giao dịch trung gian miễn phí</span>
                                                        <span>{pkg.maxFreePlatformFeePerSub }</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </SwiperSlide>
                                )
                            }):""
                        }
                    </Swiper>
                </>
            ) : <Pay pkg={selectPackage}
                    orderCode={orderCode}
                    paymentType={"Package"}
                    onClose={() => {
                        setSelectPackage(null);
                        setIsPay(false);
                    }}
            ></Pay>}

        </div>
    )
}
export default ServicePackage;
