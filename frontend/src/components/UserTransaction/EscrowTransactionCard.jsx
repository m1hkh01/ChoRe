import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { STATUS_STYLES } from "../../constants/StatusStyles";
import { useTransactionTimer } from "../Chat/TransactionCard/useTransactionTimer";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { TransactionActions } from "./EscrowAction/TransactionActions";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { ReasonRefundModal } from "./EscrowAction/ReasonRefundModal";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../utils/toast";
import api from "../../api";
import { EvidenceModal } from "./EscrowAction/EvidenceModal";
import ReviewForm from "../Review/ReviewForm";

export function EscrowTransactionCard({ transaction, currentUserIsSeler, reload}) {
    const [openReasonRefundModal, setOpenReasonRefundModal] = useState(false);
    const [openEvidenceModal, setOpenEvidenceModal] = useState(false);
    const [openReviewForm, setOpenReviewForm] = useState(false);
    const { user } = useAuthStore();
    const [price, setPrice] = useState(transaction.postPrice);
    const [dispute, setDispute] = useState({
        EscrowTransId: Number(transaction.transactionId),
        OpenedByUserId: Number(user.userId),
        DisputeReason: ""
    })
    const [userEvidences, setUserEvidences] = useState(null);
    const navigate = useNavigate();

    const { timeRemaining } = useTransactionTimer(transaction)

    const formatMoney = (value) =>
        value.toLocaleString("vi-VN") + " đ";

    const confirmByCurrentUser = (!currentUserIsSeler && transaction.buyerConfirmed) ||
        (currentUserIsSeler && transaction.sellerConfirmed);
    // console.log("ConfirmbyCurrentUser: ", !currentUserIsSeler);

    useEffect(() => {
        setUserEvidences(transaction.disEvidence.filter(d => d.submitByUserId == user.userId));
    },[openEvidenceModal])

    // console.log("Transaction: ", transaction);

    // Handle Action
    const handleUpdateStatusTransaction = async (apiName, successMessage, id = transaction.transactionId) => {
        try {
            await api.put(`api/transaction/${apiName}/${Number(id)}`);
            Toast.fire({
                icon: "success",
                title: `${successMessage}`
            })
            reload();
        }
        catch (e) {
            console.log("co loi xay ra: ", e);
            Toast.fire({
                icon: "error",
                title: "Có lỗi xảy ra vui lòng thử lại"
            });
        }
    }

    const handleConfirm = async () => {
        try {
            if (price === 0) {
                Toast.fire({
                    icon: "error",
                    title: "Giá không được < 0"
                });
                return;
            }
            const req = {
                TransactionId: transaction.transactionId,
                IsBuyer: !currentUserIsSeler,
                PostPrice: Number(price),
                UpdatePrice: price != transaction.postPrice
            }
            const res = await api.post("api/transaction/confirm", req);
            Toast.fire({
                icon: "success",
                title: res.data.message
            })
            reload();
        }
        catch (e) {
            console.log("co loi xay ra: ", e);
            Toast.fire({
                icon: "error",
                title: "Có lỗi xảy ra vui lòng thử lại sau"
            });
        }
    }
    const handlePayment = () => {
        navigate(`/pay/transaction/${transaction.transactionId}`)
    }

    const handleRefundTransaction = async () =>{
        try{
            if (dispute.DisputeReason == '') {
            Toast.fire({
                icon: "error",
                title:"Vui lòng chọn lý do hoàn tiền"
            })
            return; 
        }
            await api.post(`api/transaction/refund/${Number(transaction.transactionId)}`, dispute);
            Toast.fire({
                icon: "success",
                title: "Đã gửi yêu cầu hoàn tiền"
            })
            reload();
            setOpenReasonRefundModal(false);
        }
        catch (e) {
            console.log("co loi xay ra: ", e);
            Toast.fire({
                icon: "error",
                title: "Có lỗi xảy ra vui lòng thử lại sau"
            });
        }
        
    }
    const handleRequestSystemIntervention = async (evidences) => {
        console.log("Evidences: ", evidences);
        try {
            if (evidences.length == 0 && evidences.some(e => e.driveLink == "" && e.description == "")) {
                Toast.fire({
                    icon: "error",
                    title: "Vui lòng gửi ít nhất 1 bằng chứng"
                })
                return;
            }
            await api.post(`api/transaction/refund-system/${Number(transaction.disputeId)}`,evidences);
            Toast.fire({
                icon: "success",
                title: "Đã gửi yêu cầu hệ thống can thiệp"
            });
            setOpenEvidenceModal(false);
            reload();
        } catch (e) {
            console.log("Có lỗi xảy ra: ", e);
            Toast.fire({
                icon: "error",
                title: "Có lỗi xảy ra vui lòng thử lại"
            });
        }
    };
    return (
        <div
            key={transaction.transactionId}
            className="bg-white rounded-2xl shadow-sm p-3 flex gap-6 hover:shadow-md transition"
        >
            {/* Image */}
            <img
                src={"https://api.chore123.cloud/uploads/"+transaction.postImage}
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
                <div className="flex justify-between flex-wrap items-center mt-2">
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

                    <TransactionActions
                        status={transaction.status}
                        isRated={transaction.isRated == 1}
                        isBuyer={!currentUserIsSeler}
                        currentPrice={price}
                        setPrice={setPrice}
                        confirmByCurrentUser={confirmByCurrentUser}
                        openReasonModal={() => setOpenReasonRefundModal(true)}
                        openEvidenceModal={() => setOpenEvidenceModal(true)}
                        openReviewForm={() => setOpenReviewForm(true)}
                        handleConfirm={handleConfirm}
                        handlePayment={handlePayment}
                        handleUpdateStatusTransaction={handleUpdateStatusTransaction}
                        disputeId={transaction.disputeId}
                        hasEvidence={transaction.disEvidence.length > 0 && transaction.disEvidence?.some(d => d.submitByUserId == user.userId)}
                        disputeStatus={transaction.disputeStatus}
                    />
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
            
            {openReasonRefundModal && (
                <ReasonRefundModal
                    onClose={() => setOpenReasonRefundModal(false)}
                    onSubmit={handleRefundTransaction}
                    setDispute={setDispute}>    
                </ReasonRefundModal>)}
            {openEvidenceModal && (
                <EvidenceModal
                    onClose={() => setOpenEvidenceModal(false)}
                    onSubmit={handleRequestSystemIntervention}
                    disEvidences={userEvidences}>
                </EvidenceModal>)}
            {openReviewForm && (
                <ReviewForm
                    review={transaction.review}
                    transactionId={transaction.transactionId}
                    sellerName={transaction.sellerName}
                    postImage={transaction.postImage}
                    postTitle={transaction.postTitle}
                    postId={transaction.postId}
                    chatRoomId={transaction.chatRoomId}
                    sellerId={transaction.sellerId}
                    userId={user.userId}
                    reload={reload}
                    onClose={() => setOpenReviewForm(false)}
                    >
                </ReviewForm>)}
        </div>
    )
}