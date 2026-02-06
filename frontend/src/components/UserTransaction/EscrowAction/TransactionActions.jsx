import { ActionGroup } from "./ActionGroup";

export function TransactionActions({ status, isBuyer }) {
    if (status === "Confirming") {
        return (
            <ActionGroup
                primary="Xác nhận"
                secondary="Hủy"
            />
        );
    }

    if (status === "PendingPayment" && isBuyer) {
        return (
            <ActionGroup
                primary="Thanh toán"
                secondary="Hủy giao dịch"
            />
        );
    }

    if (status === "Paid" && isBuyer) {
        return (
            <ActionGroup
                primary="Yêu cầu hoàn tiền"
            />
        );
    }

    if (status === "RefundRequested") {
        if (isBuyer) {
            return (
                <ActionGroup
                    primary="Hủy yêu cầu hoàn tiền"
                />
            );
        }

        return (
            <ActionGroup
                primary="Chấp nhận hoàn tiền"
                secondary="Từ chối hoàn tiền"
            />
        );
    }
    if (status === "RefundRejected" && isBuyer) {
        return (
            <ActionGroup
                primary="Yêu cầu hệ thống can thiệp"
                secondary="Hủy yêu cầu hoàn tiền"
            />
        );
    }

    return null;
}
