import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { STATUS_STYLES } from "../../constants/StatusStyles";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
    PendingPayment: "Chờ thanh toán",
    Paid: "Đã thanh toán",
    Completed: "Thành công",
    Cancelled: "Đã hủy",
    Expired: "Hết hạn"
};

export default function PackageTransactionModal({ transaction, onClose }) {
    const navigate = useNavigate();

    if (!transaction) return null;

    const isPackage = transaction.serviceType == "Mua gói";
    const status = transaction.status || "PendingPayment";
    const statusLabel = STATUS_LABELS[status] || status;

    const formatDate = (date) => {
        if (date) {
            const newDate = new Date(date).toLocaleDateString("vi-VN");
            return newDate;
        }
    }
    const formatMoney = (value) =>
        value.toLocaleString("vi-VN") + " đ";

    const handlePayment = () => {
        onClose();
        navigate(`/pay/package/${transaction.serviceCode}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl !p-6 relative animate-fadeIn">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <FontAwesomeIcon icon={faX} className="text-2xl" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        {transaction.serviceName}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1 flex gap-2">
                        <span className="py-1">
                            Mã giao dịch: #{transaction.serviceCode}
                        </span>
                        <span className={`inline-block px-3 py-1 h-max text-xs rounded-full font-medium ${STATUS_STYLES[status]}`}>
                            {statusLabel}
                        </span>
                    </div>

                </div>

                {/* Body */}
                <div className="space-y-4 text-sm">

                    <div className="flex justify-between">
                        <span className="text-gray-500 text-base">Loại thanh toán</span>
                        <span className="text-base">{transaction.serviceType}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500 text-base">Thời điểm mua</span>
                        <span>{status == "PendingPayment" ? "Chưa thanh toán" : formatDate(transaction.startDate)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500 text-base">Số tiền thanh toán</span>
                        <span className="text-emerald-600 font-medium text-lg">
                            {formatMoney(transaction.servicePrice)}
                        </span>
                    </div>

                    {isPackage && (
                        <>
                            <div className="border-t pt-2 border-gray-200" />

                            <div className="flex justify-between">
                                <span className="text-gray-500 text-base">Thời hạn gói</span>
                                <span className="text-base">{transaction.durationDays} ngày</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 text-base">Ngày bắt đầu</span>
                                <span className="text-base">{status == "PendingPayment" ? "Chưa thanh toán" : formatDate(transaction.startDate)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 text-base">Ngày hết hạn</span>
                                <span className="text-base">{status == "PendingPayment" ? "Chưa thanh toán" : formatDate(transaction.expiredAt)}</span>
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className="!mt-3 flex gap-2 justify-end">
                    {status === "PendingPayment" && (
                        <button
                            onClick={handlePayment}
                            className="px-4 py-2 !rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
                        >
                            Thanh toán ngay
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 !rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                    >
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    );
}
