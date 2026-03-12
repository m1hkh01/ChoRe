import { ActionGroup } from "./ActionGroup";
import { Toast } from "../../../utils/toast";

export function TransactionActions({
    status,
    isRated,
    isBuyer,
    currentPrice,
    setPrice,
    confirmByCurrentUser,
    openReasonModal,
    openReviewForm,
    openEvidenceModal,
    openBankDetailsModal,
    handleConfirm,
    handleUpdateStatusTransaction,
    handlePayment,
    disputeId,
    hasEvidence,
    disputeStatus,
    hasBankDetails
}) {
    if (status === "Confirming") {
        if (confirmByCurrentUser) {
            return (
                <ActionGroup
                    primary={`Chờ ${isBuyer ? "người bán" : "người mua"} xác nhận`}
                    secondary="Hủy"
                    onSecondary={() => handleUpdateStatusTransaction("reject", "Đã hủy giao dịch")}
                    primaryDisabled
                />
            )
        }
        if (!confirmByCurrentUser) {
            return (
                <ActionGroup
                    primary="Xác nhận"
                    secondary="Hủy"
                    onPrimary={handleConfirm}
                    onSecondary={() => handleUpdateStatusTransaction("reject", "Đã hủy giao dịch")}
                    extra={
                        !isBuyer && (
                            <input
                                type="text"
                                placeholder={`Giá hiện tại: ${currentPrice}`}
                                // disabled={currentPrice != 0}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, "");
                                    e.target.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                    setPrice(raw)
                                }}
                                className="rounded-xl p-2 w-60 h-max border shadow-sm"
                            />
                        )
                    }
                />
            );
        }
    }

    if (status === "PendingPayment" && isBuyer) {
        return (
            <ActionGroup
                primary="Thanh toán"
                secondary="Hủy giao dịch"
                onPrimary={handlePayment}
                onSecondary={() => handleUpdateStatusTransaction("reject", "Đã hủy giao dịch")}
            />
        );
    }

    if (status === "Paid" && isBuyer) {
        return (
            <ActionGroup
                primary="Đã nhận được hàng"
                secondary="Yêu cầu hoàn tiền"
                onPrimary={() => handleUpdateStatusTransaction("complete", "Giao dịch đã hoàn tất")}
                onSecondary={() => openReasonModal()}
            />
        );
    }

    if (status === "Paid" && !isBuyer) {
        return (
            <ActionGroup
                primary={hasBankDetails ? "Cập nhật thông tin ngân hàng" : "Nhập thông tin ngân hàng"}
                onPrimary={()=>openBankDetailsModal("seller")}
            />
        );
    }
    if (status === "Completed" && isBuyer) {
        if (!isRated) {
            return (
                <ActionGroup
                    primary="Đánh giá"
                    onPrimary={openReviewForm}
                ></ActionGroup>
            );
        }
        return (
            <ActionGroup
                primary="Xem đánh giá"
                onPrimary={openReviewForm}
            ></ActionGroup>
        );
    }
    if (status === "RefundRequested") {
        if (isBuyer) {
            return (
                <ActionGroup
                    primary="Hủy yêu cầu hoàn tiền"
                    onPrimary={() => handleUpdateStatusTransaction("refund-cancel", "Đã hủy bỏ yêu cầu hoàn tiền")}
                    secondary="Cập nhật thông tin ngân hàng"
                    onSecondary={()=>openBankDetailsModal("buyer")}
                />
            );
        }
        return (
            <ActionGroup
                primary="Chấp nhận hoàn tiền"
                secondary="Từ chối hoàn tiền"
                onPrimary={() => handleUpdateStatusTransaction("refund-confirm", "Đã đồng ý yêu cầu hoàn tiền", disputeId)}
                onSecondary={() => handleUpdateStatusTransaction("refund-reject", "Đã từ chối yêu cầu hoàn tiền", disputeId)}
            />
        );
    }
    // if (status === "RefundRejected" && isBuyer) {
    //     console.log("Dispute Status: ", disputeStatus);
    // }
    if (status === "RefundRejected" && isBuyer && disputeStatus != "ResolvedReject") {
        return (
            <ActionGroup
                primary="Yêu cầu hệ thống can thiệp"
                secondary="Hủy yêu cầu hoàn tiền"
                onPrimary={() => openEvidenceModal()}
                onSecondary={() => handleUpdateStatusTransaction("refund-cancel", "Đã hủy bỏ yêu cầu hoàn tiền", disputeId)}
            />
        );
    }
    if (status === "Disputing") {
        return (
            <ActionGroup
                primary={`${hasEvidence ? "Nộp thêm bằng chứng" : "Nộp bằng chứng"}`}
                onPrimary={() => openEvidenceModal()}
            />
        )
    }

    return null;
}
