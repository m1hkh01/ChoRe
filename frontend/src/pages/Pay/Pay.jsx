import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTriangleExclamation,} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";
import { Toast } from "@/utils/toast";
import PayRow from "./PayComponents/PayRow";
import ConfirmPay from "./PayComponents/ConfirmPay";
import SwitchItem from "./PayComponents/SwitchItem";
import TransferRow from "./PayComponents/TransferRow";
// import { icon, text } from "@fortawesome/fontawesome-svg-core";

function Pay({ transaction, pkg, orderCode, onClose, paymentType }) {
    console.log("Package: ", pkg);
    console.log("Order Code: ", orderCode);
    const totalAmount =
        paymentType === "Transaction"
            ? transaction.amount
            : pkg.servicePrice || pkg.subPlanPrice;

    const qrcode = `https://qr.sepay.vn/img?acc=0379530805&bank=MB&amount=${totalAmount}&des=${orderCode}`;

    const [isQrCode, setIsQrCode] = useState(true);

    const handlePay = async () => {
        try {

            if (pkg) {
                const res = await api.post("/api/package/pay-order", { orderCode });
                Toast.fire({
                    icon: res.data.success ? "success" : "error",
                    text: res.data.success
                        ? res.data.success
                        : res.data.error
                });
                if (res.data.error) {
                    return;
                }
            } else {
                const res = await api.post("/api/transaction/pay", {
                    OrderCode: orderCode,
                    SellerId: transaction.sellerId,
                    BuyerId: transaction.buyerId,
                    PostId: transaction.postId,
                    ChatRoomId: transaction.chatRoomId?.toString()
                });
                Toast.fire({
                    icon: res.data.success ? "success" : "error",
                    text: res.data.success
                        ? res.data.success
                        : res.data.error
                });
                if (res.data.error) {
                    return;
                }
            }
            onClose();
        }
        catch (err) {
            console.log("Loi khi giao dich: ", err);
            Toast.fire({
                icon: "error",
                text: "Đã có lỗi xảy ra"
            })
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg !p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ===== LEFT INFO ===== */}
                    <div className="bg-gray-50 rounded-2xl !p-4 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-2">
                                Thông tin thanh toán
                            </h2>

                            {paymentType === "Transaction" ? (
                                <>
                                    <p className="text-base text-gray-600 mb-1">
                                        Thanh toán giao dịch trung gian
                                    </p>
                                    <div className="mt-2 !space-y-2">
                                        <div className="flex justify-between border-b border-gray-400">
                                            <PayRow
                                                label="Người bán"
                                                value={transaction.sellerName}
                                            />
                                            <PayRow
                                                label="Người mua"
                                                value={transaction.buyerName}
                                            />
                                        </div>
                                        <div className="flex justify-between border-b border-gray-400">
                                            <PayRow
                                                label="Giá sản phẩm"
                                                value={`${transaction.postPrice.toLocaleString(
                                                    "vi-VN"
                                                )} ₫`}
                                            />
                                            <PayRow
                                                label="Phí giao dịch"
                                                value={`${transaction.platformFee.toLocaleString(
                                                    "vi-VN"
                                                )} ₫`}
                                            />
                                        </div>
                                        <PayRow
                                            label="Mã giao dịch"
                                            value={transaction.transactionOrderCode}
                                            full
                                        />
                                    </div>

                                    <div className="border-t border-t-gray-400 mt-1 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-600">
                                            Tổng tiền
                                        </span>
                                        <span className="text-2xl font-bold text-red-500">
                                            {transaction.amount.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            ₫
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-0">
                                        Gói dịch vụ đã chọn
                                    </p>
                                    <span className="inline-block my-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        {pkg.serviceName || pkg.subPlanName}
                                    </span>

                                    <div className="!mt-4 space-y-2 mb-0">
                                        <PayRow
                                            label="Mã đơn hàng"
                                            value={orderCode}
                                            full
                                        />
                                    </div>

                                    <div className="border-t border-t-gray-400 mt-2 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-600">
                                            Tổng tiền
                                        </span>
                                        <span className="text-2xl font-bold text-red-600">
                                            {pkg.servicePrice?.toLocaleString(
                                                "vi-VN"
                                                ) || pkg.subPlanPrice.toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* WARNING */}
                            <div className="mt-2 flex gap-2 bg-orange-50 border border-orange-200 p-3 rounded-lg text-sm">
                                <FontAwesomeIcon
                                    icon={faTriangleExclamation}
                                    className="text-orange-500 mt-1"
                                />
                                <p>
                                    <strong>Lưu ý:</strong> Chợ Rẻ không hoàn tiền
                                    cho các giao dịch phát sinh do lỗi hoặc nhầm
                                    lẫn từ phía khách hàng.
                                </p>
                            </div>
                        </div>

                        <div className="mt-2 space-y-3">
                            <ConfirmPay onPay={handlePay} />
                            <button
                                onClick={onClose}
                                className="text-blue-600 font-semibold text-center w-full"
                            >
                                Quay về
                            </button>
                        </div>
                    </div>

                    {/* ===== RIGHT QR / TRANSFER ===== */}
                    <div className="rounded-2xl border !p-6 flex flex-col items-center">
                        {/* SWITCH */}
                        <div className="relative flex justify-content-between bg-gray-100 rounded-lg p-1 !mb-6 w-full max-w-xs">
                            <div
                                className="absolute top-1 h-[calc(100%-8px)] w-[140px] bg-white rounded-lg transition-all duration-300"
                                style={{
                                    left: isQrCode ? "10px" : "52%",
                                }}
                            />
                            <SwitchItem
                                active={isQrCode}
                                onClick={() => setIsQrCode(true)}
                            >
                                Quét mã QR
                            </SwitchItem>
                            <SwitchItem
                                active={!isQrCode}
                                onClick={() => setIsQrCode(false)}
                            >
                                Chuyển khoản
                            </SwitchItem>
                        </div>

                        {isQrCode ? (
                            <>
                                <div className="bg-white p-4 rounded-xl shadow">
                                    <img
                                        src={qrcode}
                                        alt="QR Code"
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-4 text-center">
                                    Dùng app ngân hàng hỗ trợ{" "}
                                    <strong>QR Code</strong> để quét
                                </p>
                            </>
                        ) : (
                            <div className="w-full max-w-xs !space-y-3">
                                <TransferRow
                                    label="Tên tài khoản"
                                    value="Nguyen Cu Nhat"
                                />
                                <TransferRow
                                    label="Số tài khoản"
                                    value="0379530805"
                                />
                                <TransferRow
                                    label="Số tiền"
                                    value={`${totalAmount.toLocaleString(
                                        "vi-VN"
                                    )} ₫`}
                                />
                                <TransferRow
                                    label="Nội dung"
                                    value={orderCode}
                                    bold
                                />

                                <div className="flex gap-2 bg-orange-50 border border-orange-200 p-3 rounded-lg text-sm">
                                    <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                        className="text-orange-500 mt-0.5"
                                    />
                                    <p>
                                        <strong>Lưu ý:</strong> Nhập đúng nội dung
                                        để giao dịch thành công
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pay;
