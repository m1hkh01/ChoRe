import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { STATUS_STYLES } from "../../constants/StatusStyles";
import { useTransactionTimer } from "../Chat/TransactionCard/useTransactionTimer";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { TransactionActions } from "./EscrowAction/TransactionActions";

export function EscrowTransactionCard({ transaction, currentUserIsSeler }) {
    
    const { timeRemaining } = useTransactionTimer(transaction)
    const formatMoney = (value) =>
        value.toLocaleString("vi-VN") + " đ";
    return (
        <div
            key={transaction.transactionId}
            className="bg-white rounded-2xl shadow-sm p-3 flex gap-6 hover:shadow-md transition"
        >
            {/* Image */}
            <img
                src={transaction.postImage}
                alt=""
                className="w-15 h-15 object-cover rounded-xl"
            />

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <h2 className="font-semibold !text-xl">
                            {transaction.postTitle}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 mb-1">
                            {currentUserIsSeler ? "Người mua" : "Người bán"} • {currentUserIsSeler ? transaction.buyerName : transaction.sellerName}
                        </p>
                    </div>

                    <span
                        className={`px-2 py-1 h-max 
                                        rounded-full text-sm
                                        font-medium
                                        ${STATUS_STYLES[transaction.status]}`}
                    >
                        {transaction.statusDescription}
                    </span>
                </div>

                {/* Price Box */}
                <div className="bg-gray-50 rounded-xl !p-2.5 mt-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Giá sản phẩm</span>
                        <span className="text-sm text-gray-500">{formatMoney(transaction.postPrice)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Phí nền tảng</span>
                        <span className="text-sm text-gray-500">{formatMoney(transaction.platformFee)}</span>
                    </div>
                    <div className="flex justify-between mt-2 font-semibold text-green-600 border-t pt-2">
                        <span className="text-sm text-gray-500">Tổng thanh toán</span>
                        <span className="text-base">{formatMoney(transaction.amount)}</span>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3 text-red-500 text-sm">
                        {/* <Clock size={16} /> */}
                        {/* {console.log("transaction Status: ",transaction)} */}
                        {
                            (transaction.status == "Confirming" || transaction.status == "PendingPayment") && (
                                <span className="flex gap-1 items-center">
                                    <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                                    {timeRemaining}
                                </span>
                            )
                        }
                        <span className="text-gray-400 ml-2">
                            #{transaction.transactionOrderCode}
                        </span>
                    </div>
                    
                    <TransactionActions status={transaction.status} isBuyer={!currentUserIsSeler}/>
                    {/* {transaction.status === "Confirming" && (
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-green-600 text-white !rounded-xl hover:bg-green-700 transition">
                                Xác nhận
                            </button>
                            <button className="px-4 py-2 border border-red-400 text-red-500 !rounded-xl hover:bg-red-50 transition">
                                Hủy
                            </button>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}