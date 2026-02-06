import { useState } from "react";
import PackageTransactionCard from "./PackageTransactionCard";
import PackageTransactionModal from "./PackageTransactionModal";

export default function PackageTab({ transactions }) {
    console.log("Service Transaction: ",transactions)
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const packagePayments = [
        {
            title: "Gói Premium Shop 90 ngày",
            code: "PKG-003",
            type: "Mua gói",
            date: "01/12/2025",
            amount: "799.000 đ"
        },
        {
            title: "Gói Premium Shop 90 ngày",
            code: "PKG-003",
            type: "Mua gói",
            date: "01/12/2025",
            amount: "799.000 đ"
        },
        {
            title: "Gói Premium Shop 90 ngày",
            code: "PKG-003",
            type: "Mua gói",
            date: "01/12/2025",
            amount: "799.000 đ"
        },
        {
            title: "Gói Premium Shop 90 ngày",
            code: "PKG-003",
            type: "Mua gói",
            date: "01/12/2025",
            amount: "799.000 đ"
        },
        {
            title: "Gói Premium Shop 90 ngày",
            code: "PKG-003",
            type: "Mua gói",
            date: "01/12/2025",
            amount: "799.000 đ"
        },
        {
            title: "Mua lượt đăng tin",
            code: "PKG-004",
            type: "Mua lượt",
            date: "05/12/2025",
            amount: "49.000 đ"
        }
    ];


    return (
        <>
            <div className="space-y-4 grid grid-cols-4 gap-2">
                {transactions.map((item, index) => (
                    <PackageTransactionCard key={index} transaction={item} setSelectedTransaction={setSelectedTransaction}/>
                ))}
            </div>
            {selectedTransaction && (
                <PackageTransactionModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </>
    );
}
