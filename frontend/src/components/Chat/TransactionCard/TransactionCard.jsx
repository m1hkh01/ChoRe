import { useEffect, useState } from "react";
import CancelledCard from "./states/CancelledCard";
import CompletedCard from "./states/CompletedCard";
import ConfirmingCard from "./states/ConfirmingCard";
import DisputingCard from "./states/DisputingCard";
import ExpiredCard from "./states/ExpiredCard";
import PaidCard from "./states/PaidCard";
import PendingPaymentCard from "./states/PendingPaymentCard";
import RefundedCard from "./states/RefundedCard";
import {useTransactionTimer} from "./useTransactionTimer";

export function TransactionCard({ transaction, priceType, currentUserId, connectionRef }) {
    const { timeRemaining } = useTransactionTimer(transaction)
    const [isUpdatePrice, setIsUpdatePrice] = useState(false);
    const [updateTransaction, setUpdateTransaction] = useState(transaction);
    useEffect(() => {
        setUpdateTransaction(transaction);
    }, [transaction]);

    
    if (!updateTransaction) return null;

    const isBuyer = updateTransaction.buyerId === currentUserId;
    const confirmedByCurrentUser =
        (isBuyer && updateTransaction.buyerConfirmed) ||
        (!isBuyer && updateTransaction.sellerConfirmed);

    const canConfirm = updateTransaction.status === "Confirming" && !confirmedByCurrentUser;

    const handleConfirm = async () => {
        console.log("Price: ", updateTransaction.postPrice);
        console.log("Is Update price: ", isUpdatePrice);
        await connectionRef.current.invoke(
            "ConfirmEscrow",
            updateTransaction.transactionId,
            isBuyer,
            Number(updateTransaction.postPrice),
            isUpdatePrice
        );
    };
    const onChangePrice = (value) => {
        console.log("value: ", value);
        setUpdateTransaction(prev => ({ ...prev, postPrice: Number(value) }));
        setIsUpdatePrice(true);
    }

    switch (updateTransaction.status) {
        case "Confirming":
            return (
                <ConfirmingCard
                    transaction={updateTransaction}
                    isBuyer={isBuyer}
                    confirmedByCurrentUser={confirmedByCurrentUser}
                    canConfirm={canConfirm}
                    onConfirm={handleConfirm}
                    onChangePrice={onChangePrice}
                    timeRemaining={timeRemaining}
                />
            );

        case "PendingPayment":
            return <PendingPaymentCard transaction={updateTransaction} connectionRef={connectionRef} platformFee={updateTransaction.platformFee} isBuyer={isBuyer} timeRemaining={timeRemaining} />;

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
