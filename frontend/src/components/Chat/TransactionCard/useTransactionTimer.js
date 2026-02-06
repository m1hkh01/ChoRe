import { useEffect, useState } from "react";

export function useTransactionTimer(transaction) {
    const [isExpired, setIsExpired] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState("");

    useEffect(() => {
        if (!transaction?.expiredAt) return;
        
        const update = () => {
            const now = new Date();
            const expiredTime = new Date(transaction.expiredAt);
            const diff = expiredTime.getTime() - now.getTime();

            const expirableStatuses = ["Confirming", "PendingPayment"];
            if (diff <= 0 && expirableStatuses.includes(transaction.status)) {
                setIsExpired(true);
                setTimeRemaining("Đã hết hạn");
            } else {
                setIsExpired(false);
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeRemaining(`${h}h ${m}m ${s}s`);
            }
        };

        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, [transaction?.expiredAt, transaction?.status]);

    return { isExpired, timeRemaining };
}
