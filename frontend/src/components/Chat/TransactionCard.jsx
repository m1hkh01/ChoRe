import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export function TransactionCard({ transaction,sellerId, currentUserId, onConfirm, connectionRef }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [confirmedByCurrentUser, setConfirmedByCurrentUser] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState("");

    useEffect(() => {
        if (!transaction) return;
        console.log("Transaction: ", transaction);
        const isBuyer = sellerId !== currentUserId;
        const isSeller = sellerId === currentUserId;

        if (isBuyer && transaction.buyerConfirmed) setConfirmedByCurrentUser(true);
        else if (isSeller && transaction.sellerConfirmed) setConfirmedByCurrentUser(true);
        else setConfirmedByCurrentUser(false);
    }, [transaction, currentUserId,sellerId]);

    useEffect(() => {
        if (!transaction?.expiredAt) return;
        const update = () => {
            const now = new Date();
            const expiredTime = new Date(transaction.expiredAt);
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
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, [transaction?.expiredAt]);

    if (!transaction) return null;

    const isBuyer = sellerId !== currentUserId;
    const isSeller = sellerId === currentUserId;
    const buyerConfirmed = !!transaction.buyerConfirmed;
    const sellerConfirmed = !!transaction.sellerConfirmed;

    const canConfirm = !isExpired && transaction.status == "Confirming" && !confirmedByCurrentUser && (isBuyer || isSeller);

    const handleConfirm = async () => {
        if (!canConfirm || !connectionRef?.current) return;
        setIsLoading(true);
        try {
            await connectionRef.current.invoke("ConfirmEscrow", transaction.EscrowTransactionId);
            if (onConfirm) onConfirm(transaction.EscrowTransactionId);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi xác nhận giao dịch");
        } finally {
            setIsLoading(false);
        }
    };

    const bothConfirmed = transaction.IsCompleted || (buyerConfirmed && sellerConfirmed);

    return (
        <div className="rounded-lg text-center w-full max-w-md p-[12px_!important] mx-auto mt-3 text-sm bg-white shadow-[0_0_6px_rgba(0,0,0,0.06)] border border-gray-200">
            <div className="font-semibold text-xl mb-3">Đã tạo giao dịch trung gian</div>

            <div className="text-sm text-gray-700 mb-6">Để xác nhận giao dịch qua trung gian ( hệ thống ) hãy ấn vào nút bên dưới</div>

            <div className="mb-2">
                {bothConfirmed ? (
                    <div className="bg-green-100 p-3 w-full rounded flex flex-col items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-2xl mb-1" />
                        <div className="text-sm font-bold text-gray-800">✅ Đã tạo giao dịch thành công</div>
                    </div>
                ) : confirmedByCurrentUser ? (
                    <div className="flex flex-col items-center gap-2">
                        <button disabled className="w-44 bg-green-500 text-white px-4 py-2 font-bold rounded opacity-90 cursor-default opacity-50">Đã xác nhận</button>
                        <div className="text-sm text-gray-600">
                            {isBuyer && !sellerConfirmed && "Chờ người bán xác nhận"}
                            {isSeller && !buyerConfirmed && "Chờ người mua xác nhận"}
                        </div>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={handleConfirm}
                            disabled={!canConfirm || isLoading}
                            className={`w-44 bg-green-500 text-white px-4 py-2 font-bold rounded ${canConfirm && !isLoading ? "hover:bg-green-600 cursor-pointer" : "opacity-50 cursor-not-allowed"} transition`}>
                            {isLoading ? "Đang xác nhận..." : "Xác nhận"}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-yellow-100 p-3 w-full rounded flex items-start gap-3">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-orange-500 text-2xl mt-1" />
                <div className="text-xs text-gray-700 text-left">
                    <div className="mt-1 font-semibold">Lưu ý:</div>
                    <div>Người mua vui lòng thanh toán phí giao dịch + tiền sản phẩm trong 24 giờ nếu không sẽ tự động hủy giao dịch</div>
                </div>
            </div>
            {
                transaction.status == "Confirming" &&
                (<div className="font-light text-sm text-gray-600 mt-3">⏱Tự động hủy giao dịch sau: {timeRemaining}</div>)
            }
        </div>
    );
}
