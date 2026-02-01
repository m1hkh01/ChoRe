import DisputeAction from "./DisputeAction";

export default function EscrowPreviewModal({ transaction, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-max rounded-2xl shadow-xl relative overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-b-2 border-gray-200">
                    <h2 className="text-lg font-semibold">
                        Chi tiết giao dịch
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 !text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-3">
                    {/* Info grid */}
                    <div className="flex flex-wrap justify-between text-sm w-[500px]">
                        <div className="w-[40%]">
                            <p className="text-gray-500 my-2">Mã giao dịch</p>
                            <p className="font-medium mb-0">
                                {transaction.transactionOrderCode}
                            </p>
                        </div>

                        <div className="w-[40%]">
                            <p className="text-gray-500 my-2">Trạng thái</p>
                            <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                {transaction.statusDescription}
                            </span>
                        </div>

                        <div className="w-[40%]">
                            <p className="text-gray-500 my-2">Giá sản phẩm</p>
                            <p className="font-medium mb-0">
                                {transaction.postPrice?.toLocaleString()} ₫
                            </p>
                        </div>

                        <div className="w-[40%]">
                            <p className="text-gray-500 my-2">Phí sàn</p>
                            <p className="font-medium text-red-600 mb-0">
                                {transaction.platformFee?.toLocaleString()} ₫
                            </p>
                        </div>

                        <div className="w-[40%]">
                            <p className="text-gray-500 my-2">Hết hạn</p>
                            <p className="font-medium mb-0">
                                {new Date(transaction.expiredAt)?.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-[40%]">
                            <p className="text-gray-500 my-2">Tổng thanh toán</p>
                            <p className="font-semibold text-lg text-green-600 mb-0">
                                {transaction.amount?.toLocaleString()} ₫
                            </p>
                        </div>
                    </div>

                    {/* Dispute */}
                    {transaction.status === "Disputing" && (
                        <DisputeAction transaction={transaction} />
                    )}
                </div>
            </div>
        </div>
    );
}
