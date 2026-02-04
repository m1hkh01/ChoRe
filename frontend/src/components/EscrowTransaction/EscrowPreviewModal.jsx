import { useState } from "react";
import DisputeAction from "./DisputeAction";
import { DecisionModal } from "./DecisionModal";
import { Toast } from "../../utils/toast";
import api from "../../api";

export default function EscrowPreviewModal({ transaction, onClose }) {
    const [openDecision, setOpenDecision] = useState(false);
    const [disputeData, setDisputeData] = useState({
        EscrowTransId: transaction.transactionId,
        DisputeId: transaction.disputeId,
        Decision: "",
        DecisionNote: "",
        DisputeSatatus: 0
    })
    const ResolveDispute = async () => {
        try {
            if (disputeData.Decision == '') {
                Toast.fire({
                    icon: "error",
                    title: "Vui lòng chọn lý do"
                });
                return;
            }
            await api.post("/api/admin/transactions/resolve-dispute", disputeData);
            console.log(disputeData);
            Toast.fire({
                icon: "success",
                title:"Xử lý tranh chấp thành công"
            })
            setOpenDecision(false);
            onClose();
        }
        catch (err) {
            console.log("Có lỗi xảy ra khi xử lý tranh trấp: ", err);
            Toast.fire({
                icon: "error",
                title: "Có lỗi xảy ra"
            })
        }
    }
    return (
        <>
            {
                !openDecision ? (
                    <>
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
                        </div>
                        <div className={`bg-white w-max rounded-2xl shadow-xl absolute top-[45%] left-[50%] translate-[-50%] overflow-hidden z-70 ${openDecision && 'hidden'}`}>

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
                                <div className="flex flex-wrap justify-between text-sm w-[500px] p-2 rounded-2xl shadow-sm border">
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
                                    <DisputeAction transaction={transaction} setOpenDecision={setOpenDecision} setDisputeData={setDisputeData}/>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <DecisionModal onClose={()=>setOpenDecision(false)} setDisputeData={setDisputeData} onSubmit={ResolveDispute}></DecisionModal>
                )
            }
            {/* </div> */}
        </>

    );
}
