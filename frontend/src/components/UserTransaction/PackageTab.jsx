import { useState } from "react";
import PackageTransactionCard from "./PackageTransactionCard";
import PackageTransactionModal from "./PackageTransactionModal";

export default function PackageTab({ transactions }) {
    // console.log("Service Transaction: ",transactions)
    const [selectedTransaction, setSelectedTransaction] = useState(null);

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
