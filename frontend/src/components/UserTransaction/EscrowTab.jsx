import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { STATUS_STYLES } from "../../constants/StatusStyles";
import { EscrowPagination } from "../EscrowTransaction/EscrowPagination";
import { usePagination } from "../../Hooks/usePagination";
import { EscrowTransactionCard } from "./EscrowTransactionCard";
import { useState } from "react";

export default function EscrowTab({ transactions, userId , reload}) {
    const {
        currentPage,
        setCurrentPage,
        totalPages,
        visiblePages
    } = usePagination({
        totalItems: transactions?.length,
        itemsPerPage: 6,
        maxPageIndex: 5
    });
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = transactions.slice(startIndex, startIndex + itemsPerPage);
    return (
        <div className="space-y-4">
            {/* Map list escrow transactions ở đây */}
            <div className="flex flex-col gap-2">
                {paginatedData.length > 0 ? paginatedData.map((t) => {
                    var currentUserIsSeler = t.sellerId == userId;
                    return (
                        <EscrowTransactionCard
                            transaction={t}
                            currentUserIsSeler={currentUserIsSeler}
                            reload={reload}
                        />
                    )
                }) : <div className="w-full h-60 flex justify-center items-center bg-white">
                    <h4>Bạn chưa có giao dịch nào</h4>
                </div>}
            </div>
            <EscrowPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                visiblePages={visiblePages} />
        </div>
    );
}
