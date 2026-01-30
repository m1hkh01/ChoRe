import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

/**
 * Component hiển thị thẻ giao dịch trung gian (escrow)
 * 
 * Props:
 * - transaction: EscrowTransactionDto
 * - currentUserId: ID user hiện tại
 * - onConfirm: callback khi click confirm
 * - connectionRef: SignalR connection ref (optional, để emit event nếu cần)
 */
export function TransactionCard({ transaction, currentUserId, onConfirm, connectionRef }) {
    const [timeRemaining, setTimeRemaining] = useState("");
    const [isExpired, setIsExpired] = useState(false);
    const [confirmedByCurrentUser, setConfirmedByCurrentUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Cập nhật thời gian còn lại
    useEffect(() => {
        const updateTimer = () => {
            if (!transaction?.ExpiredAt) return;

            const now = new Date();
            const expiredTime = new Date(transaction.ExpiredAt);
            const diff = expiredTime.getTime() - now.getTime();

            if (diff <= 0) {
                setIsExpired(true);
                setTimeRemaining("Đã hết hạn");
            } else {
                setIsExpired(false);
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [transaction?.ExpiredAt]);

    // Kiểm tra user hiện tại đã confirm chưa
    useEffect(() => {
        if (!transaction) return;

        const isBuyer = transaction.BuyerId === currentUserId;
        const isSeller = transaction.SellerId === currentUserId;

        if (isBuyer && transaction.BuyerConfirmedAt) {
            setConfirmedByCurrentUser(true);
        } else if (isSeller && transaction.SellerConfirmedAt) {
            setConfirmedByCurrentUser(true);
        } else {
            setConfirmedByCurrentUser(false);
        }
    }, [transaction, currentUserId]);

    if (!transaction) return null;

    const isBuyer = transaction.BuyerId === currentUserId;
    const isSeller = transaction.SellerId === currentUserId;

    // Xác định nút có được enable không
    const canConfirm = !isExpired && !transaction.IsCompleted && !confirmedByCurrentUser && (isBuyer || isSeller);

    // Render status badge
    const renderStatusBadge = () => {
        switch (transaction.Status) {
            case "Completed":
                return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">✅ Đã hoàn thành</span>;
            case "Cancelled":
                return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">❌ Đã hủy</span>;
            case "BuyerConfirmed":
                return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">👤 Người mua đã xác nhận</span>;
            case "SellerConfirmed":
                return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">👤 Người bán đã xác nhận</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">⏳ Đang chờ</span>;
        }
    };

    const handleConfirm = async () => {
        if (!canConfirm || !connectionRef?.current) return;

        setIsLoading(true);
        try {
            // Gọi SignalR method
            await connectionRef.current.invoke("ConfirmEscrow", transaction.EscrowTransactionId);

            // Callback nếu có
            if (onConfirm) {
                onConfirm(transaction.EscrowTransactionId);
            }
        } catch (error) {
            console.error("Lỗi confirm escrow:", error);
            alert("Lỗi khi xác nhận giao dịch");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-lg p-4 text-center w-auto max-w-md h-auto mx-auto text-sm bg-white shadow-[0_0_3px_rgba(0,0,0,0.2)] border border-gray-200">
            {/* Tiêu đề */}
            <div className="font-semibold text-xl mb-2">
                🔒 Giao dịch trung gian
            </div>

            {/* Trạng thái */}
            <div className="mb-3">
                {renderStatusBadge()}
            </div>

            {/* Thông tin tiền */}
            <div className="mb-3 p-3 bg-gray-50 rounded">
                <div className="text-lg font-bold text-green-600">
                    {transaction.Amount.toLocaleString('vi-VN')} ₫
                </div>
                {transaction.Fee > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                        Phí: {transaction.Fee.toLocaleString('vi-VN')} ₫
                    </div>
                )}
            </div>

            {/* Trạng thái xác nhận từng bên */}
            <div className="mb-3 p-3 bg-gray-50 rounded text-left">
                <div className="text-xs font-bold mb-1">Xác nhận:</div>
                <div className="flex justify-between text-xs">
                    <span>
                        {transaction.BuyerConfirmedAt ? "✅ Người mua" : "⏳ Người mua"}
                    </span>
                    <span>
                        {transaction.SellerConfirmedAt ? "✅ Người bán" : "⏳ Người bán"}
                    </span>
                </div>
            </div>

            {/* Nút xác nhận */}
            {!transaction.IsCompleted && !isExpired && (
                <button
                    onClick={handleConfirm}
                    disabled={!canConfirm || isLoading}
                    className={`
                        w-full bg-green-500 text-white px-4 py-2 font-bold rounded
                        ${canConfirm && !isLoading ? "hover:bg-green-600 cursor-pointer" : "opacity-50 cursor-not-allowed"}
                        transition disabled:opacity-60
                    `}
                >
                    {isLoading ? "Đang xác nhận..." : confirmedByCurrentUser ? "✅ Bạn đã xác nhận" : "Xác nhận giao dịch"}
                </button>
            )}

            {/* Warning timeout */}
            <div className="bg-yellow-100 p-2 mx-auto w-full rounded mt-3 flex flex-col items-center">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-orange-500 text-lg mb-1" />
                <p className="text-xs text-gray-700">
                    <strong>⏱️ Hạn chót:</strong> {timeRemaining}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Giao dịch sẽ tự động hủy nếu không xác nhận trong 24 giờ
                </p>
            </div>

            {/* Trạng thái hoàn thành / hết hạn */}
            {transaction.IsCompleted && (
                <div className="bg-green-100 p-2 mx-auto w-full rounded mt-3 flex flex-col items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg mb-1" />
                    <p className="text-xs text-gray-700 font-bold">
                        ✅ Giao dịch đã hoàn thành
                    </p>
                </div>
            )}

            {isExpired && transaction.Status !== "Completed" && (
                <div className="bg-red-100 p-2 mx-auto w-full rounded mt-3 flex flex-col items-center">
                    <FontAwesomeIcon icon={faTimes} className="text-red-600 text-lg mb-1" />
                    <p className="text-xs text-gray-700 font-bold">
                        ❌ Giao dịch đã hết hạn
                    </p>
                </div>
            )}
        </div>
    );
}
