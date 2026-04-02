import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BaseCard from "./BaseCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PendingPaymentCard({
    connectionRef,
    isBuyer,
    timeRemaining,
    transaction
}) {
    const navigate = useNavigate();
    return (

        <BaseCard
            title="Chờ thanh toán"
            footer={`⏱ Tự động hủy sau: ${timeRemaining}`}
        >
            {/* Success message */}
            <div div className="bg-green-100 p-3 rounded flex justify-center items-center gap-2 mb-4" >
                
                <p className="font-semibold text-sm flex flex-col">
                    <span className="text-center"><FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-600 text-base"
                    />Giao dịch đã được xác nhận</span>
                    <span className="text-xs text-gray-500 mt-1">
                        Lưu ý: Phí giao dịch sẽ được trừ vào tiền sản phẩm sau khi giao dịch được hoàn tất
                    </span>
                </p>
            </div>

            {/* Price breakdown */}
            <div div className="bg-gray-50 rounded p-3 text-sm mb-4" >
                <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Giá sản phẩm</span>
                    <span className="font-medium">
                        {transaction.postPrice?.toLocaleString()} ₫
                    </span>
                </div>

                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Phí giao dịch</span>
                    <span className="font-medium">
                        {transaction.platformFee?.toLocaleString()} ₫
                    </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold text-green-700">
                    <span>Tổng thanh toán</span>
                    <span>{transaction.postPrice?.toLocaleString()} ₫</span>
                </div>
            </div>

            {/* CTA */}
            {
                isBuyer && (
                    <div className="text-center">
                        <button
                            onClick={() => navigate(`/pay/transaction/${transaction.transactionId}`)}
                            className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded font-bold w-full">
                            Thanh toán ngay
                        </button>
                    </div>
                )
            }
        </BaseCard >
    );
}
