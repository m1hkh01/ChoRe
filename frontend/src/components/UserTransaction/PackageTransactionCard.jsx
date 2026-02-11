import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { STATUS_STYLES } from "../../constants/StatusStyles";
import { faEye, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
    PendingPayment: "Chờ thanh toán",
    Paid: "Đã thanh toán",
    Completed: "Thành công",
    Cancelled: "Đã hủy",
    Expired: "Hết hạn"
};

export default function PackageTransactionCard({ transaction, setSelectedTransaction }) {
    const navigate = useNavigate();
    const status = transaction.status || "PendingPayment";
    const statusLabel = STATUS_LABELS[status] || status;

    const handlePayment = () => {
        navigate(`/pay/package/${transaction.orderId}`);
    };

    return (
        <div className="bg-white rounded-2xl flex gap-2 w-full justify-between border border-gray-100 shadow-sm p-3 hover:shadow-md transition">

            {/* Header */}
            <div className="flex flex-col mb-1 flex-1">
                <div>
                    <div className="flex items-center gap-2 justify-between">
                        <h3 className="font-semibold wrap-normal md:break-all text-xl! mb-1">
                            {transaction.serviceName}
                        </h3>
                        <p className={`px-2! w-max text-center py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status]} mb-0`}>
                            {statusLabel}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 my-1">
                        Thanh toán dịch vụ
                    </p>
                    <p className="text-sm text-gray-500 my-1">
                        Mã giao dịch: #{transaction.serviceCode}
                    </p>
                </div>
                {/* Action */}
                <div className="flex-1 flex justify-end gap-2">
                    {status === "PendingPayment" && (
                        <button
                            className="
                                text-sm! bg-green-600
                                hover:bg-green-700
                                p-2 text-white
                                rounded-xl! border
                                border-green-700
                                transition"
                            onClick={handlePayment}
                        >
                            <FontAwesomeIcon icon={faCreditCard} />
                            Thanh toán
                        </button>
                    )}
                    <button
                        className="
                            !text-sm bg-blue-200
                            p-2 text-blue-600
                            !rounded-xl border
                            !border-blue-700"
                        onClick={() => setSelectedTransaction(transaction)}
                    >
                        <FontAwesomeIcon icon={faEye} />
                        Chi tiết
                    </button>
                </div>

                {/* <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600">
                    Thành công
                </span> */}
            </div>

            {/* Nội dung chính */}
            {/* <div className="bg-gray-50 rounded-xl w-1/2 !p-2.5 space-y-3 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Loại thanh toán</span>
                    <span>{transaction.type}</span>
                </div>

                <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Ngày thanh toán</span>
                    <span>{transaction.date}</span>
                </div>

                <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t">
                    <span className="text-base font-semibold">Tổng tiền</span>
                    <span className="text-emerald-600 text-lg">
                        {transaction.amount}
                    </span>
                </div>

            </div> */}

            {/* Footer */}
            {/* <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>#{transaction.code}</span>

                <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    Chi tiết
                </button>
            </div> */}

        </div>
    );
}
