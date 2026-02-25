import React, { use } from "react";
import { CircleAlert } from 'lucide-react';
import { useAuthStore } from "../../store/auth";
import useFetch from "../../Hooks/useFetch";
import { useNavigate } from "react-router-dom";
export default function ServicePackageManager() {
    const { user } = useAuthStore();
    const { data } = useFetch(`/api/package/${user.userId}`);
    const navigate = useNavigate();
    console.log(data);

    // const currentPlan = {
    //     name: "ChoRè Free",
    //     price: "0đ / Tháng",
    //     description: "Gói miễn phí dành cho người dùng",
    //     features: [
    //         { label: "Miễn phí đăng tin", value: "còn 1 / 2 lần" },
    //         { label: "Số lần được đăng tin trong tháng", value: "còn 1 / 2 lần" },
    //         { label: "Miễn phí giao dịch trung gian", value: "0 lần" },
    //     ],
    // };

    return (
        <div className="min-h-screen bg-gray-100 p-10!">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-10!">

                {/* Title */}
                <h1 className="text-3xl font-bold! text-center mb-6!">
                    Gói của bạn
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* LEFT - Current Plan */}
                    <div className="relative border rounded-2xl p-5! mb-2 shadow-sm overflow-hidden">

                        {/* Badge */}
                        <span className="absolute top-0 -right-1 bg-green-500 text-white text-left text-xs font-bold p-3! rounded-bl-2xl">
                            Không giới hạn
                        </span>

                        <h2 className="text-xl text-center font-semibold! mb-4! mt-2">
                            {data?.subscriptionPlanDto?.subPlanName}
                        </h2>
                        <div className="relative mb-2">
                            <span className=" relative z-50 p-2 text-gray-400 bg-white ml-3!">Thông tin gói</span>
                            <div className="absolute top-1/2 h-[1px] z-10 w-full bg-gray-300"></div>
                        </div>
                        <div className="text-base text-gray-600 space-y-2">
                            <div className="mb-2 flex justify-between p-2">
                                <span><strong>Tên gói:</strong> {data?.subscriptionPlanDto?.subPlanName}</span>
                                <span>
                                    <strong>Giá: </strong>
                                    {data?.subscriptionPlanDto?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    / {data?.subscriptionPlanDto?.durationDays} ngày
                                </span>
                            </div>
                            <div className="mb-2 p-2">
                                <strong>Mô tả:</strong> {data?.subscriptionPlanDto?.title}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="relative mb-2">
                                <span className=" relative z-50 p-2 text-gray-400 bg-white ml-3!">Quyền lợi</span>
                                <div className="absolute top-1/2 h-[1px] z-10 w-full bg-gray-300"></div>
                            </div>
                            <ul className="text-sm text-gray-700 pl-0!">
                                <li
                                    className="flex justify-between text-base p-2"
                                >
                                    <span>Miễn phí đăng tin</span>
                                    <span>{data?.remainingFreePost} / {data?.subscriptionPlanDto?.maxFreePost} lần</span>
                                </li>
                                <li
                                    className="flex justify-between text-base p-2"
                                >
                                    <span>Số lần được đăng tin trong tháng</span>
                                    <span>{data?.remainingSubPost} / {data?.subscriptionPlanDto?.maxPost} lần</span>
                                </li>
                                <li
                                    className="flex justify-between text-base p-2"
                                >
                                    <span>Miễn phí giao dịch trung gian</span>
                                    <span>
                                        {data?.subscriptionPlanDto?.maxFreePlatform == 0 ?
                                            "0 lần" : 
                                            data?.remainingSubFPF + " / " + data?.subscriptionPlanDto?.maxFreePlatform + " lần"}
                                    </span>
                                </li>
                                {/* {data?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between text-base p-2"
                                    >
                                        <span>{item.label}</span>
                                        <span>{item.value}</span>
                                    </li>
                                ))} */}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT - Upgrade Box */}
                    <div className="text-center space-y-4">
                        <p className="text-gray-700">
                            Bạn muốn đăng nhiều tin, nhận nhiều ưu đãi hơn?
                        </p>
                        <p className="font-semibold">
                            Hãy nâng cấp gói PRO ngay nào
                        </p>

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6! py-3! rounded-xl! font-medium! transition"
                            onClick={() => navigate("/service-package")}
                        >
                            Nâng cấp gói PRO
                        </button>
                    </div>
                </div>

                {/* Warning Box */}
                <div className="mt-10 bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl flex items-center gap-3">
                    <CircleAlert size={20} className="mt-1" />
                    <p className="text-base mb-0!">
                        Lưu ý: Nếu bạn không gia hạn gói PRO thì sẽ tự động chuyển về
                        gói mặc định (ChoRè Free)
                    </p>
                </div>

            </div>
        </div>
    );
}