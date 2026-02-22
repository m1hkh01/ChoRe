import { useEffect, useState } from "react";
import EscrowFilter from "@/components/EscrowTransaction/EscrowFilter";
import EscrowTable from "@/components/EscrowTransaction/EscrowTable";
import EscrowPreviewModal from "@/components/EscrowTransaction/EscrowPreviewModal";
import api from "../../api";
import { usePagination } from "../../Hooks/usePagination";
import { EscrowPagination } from "../../components/EscrowTransaction/EscrowPagination";

export default function EscrowTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState({});
    const [selected, setSelected] = useState(null);


    const {
        currentPage,
        setCurrentPage,
        totalPages,
        visiblePages
    } = usePagination({
        totalItems: transactions.length,
        itemsPerPage: 6,
        maxPageIndex: 5
    });

    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = transactions.slice(startIndex, startIndex + itemsPerPage);

    const loadData = async () => {
        console.log("Filter: ",filter)
        const res = await api.post('api/admin/transactions/filter',filter);
        setTransactions(res.data);
    };
    useEffect(() => {
        loadData();
    },[filter])

    return (
        <div className="m-3 ">
            <h2 className="text-md font-bold">Quản lý giao dịch trung gian</h2>

            <EscrowFilter onChange={setFilter} />

            <EscrowTable
                data={paginatedData}
                onPreview={(t) => setSelected(t)}
            />
            <EscrowPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                visiblePages={visiblePages} />

            {selected && (
                <EscrowPreviewModal
                    transaction={selected}
                    onClose={() => setSelected(null)}
                    reload={loadData}
                />
            )}
        </div>
    );
}
