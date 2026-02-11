import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import Pay from "./Pay";

export default function TransactionPayPage() {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(
                    `/api/transaction/escrow-pay/${Number(transactionId)}`
                );
                setTransaction(res.data);
            } catch (err) {
                console.error("Error: ",err);
                alert("Không tìm thấy giao dịch");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [transactionId]);

    if (loading) return <div className="p-6">Đang tải...</div>;
    if (!transaction) return null;

    return (
        <Pay
            transaction={transaction}
            orderCode={transaction.transactionOrderCode}
            paymentType="Transaction"
            onClose={() => navigate(-1)}
        />
    );
}
