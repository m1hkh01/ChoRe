import CancelledCard from "./states/CancelledCard";
import CompletedCard from "./states/CompletedCard";
import ConfirmingCard from "./states/ConfirmingCard";
import DisputingCard from "./states/DisputingCard";
import ExpiredCard from "./states/ExpiredCard";
import PaidCard from "./states/PaidCard";
import PendingPaymentCard from "./states/PendingPaymentCard";
import RefundedCard from "./states/RefundedCard";
import {useTransactionTimer} from "./useTransactionTimer";

export function TransactionCard({ transaction, currentUserId, connectionRef }) {
    const {timeRemaining } = useTransactionTimer(transaction)
    
    if (!transaction) return null;

    const isBuyer = transaction.buyerId === currentUserId;
    const confirmedByCurrentUser =
        (isBuyer && transaction.buyerConfirmed) ||
        (!isBuyer && transaction.sellerConfirmed);

    const canConfirm = transaction.status === "Confirming" && !confirmedByCurrentUser;

    const handleConfirm = async () => {
        await connectionRef.current.invoke(
            "ConfirmEscrow",
            transaction.transactionId,
            isBuyer
        );
    };

    switch (transaction.status) {
        case "Confirming":
            return (
                <ConfirmingCard
                    isBuyer={isBuyer}
                    confirmedByCurrentUser={confirmedByCurrentUser}
                    canConfirm={canConfirm}
                    onConfirm={handleConfirm}
                    timeRemaining={timeRemaining}
                />
            );

        case "PendingPayment":
            return <PendingPaymentCard transaction={transaction} connectionRef={connectionRef} platformFee={transaction.platformFee} isBuyer={isBuyer} timeRemaining={timeRemaining} />;

        case "Paid":
            return <PaidCard />;

        case "Completed":
            return <CompletedCard />;

        case "Cancelled":
            return <CancelledCard />;

        case "Expired":
            return <ExpiredCard />;

        case "Disputing":
            return <DisputingCard />;

        case "Refunded":
            return <RefundedCard />;

        default:
            return null;
    }
}
