import { useEffect, useState } from "react";
import TransactionTabs from "@/components/UserTransaction/TransactionTabs";
import EscrowTab from "@/components/UserTransaction/EscrowTab";
import PackageTab from "@/components/UserTransaction/PackageTab";
import EscrowFilter from "../components/UserTransaction/EscrowFilter";
import { useAuthStore } from "../store/auth";
import api from "../api";

export default function TransactionManagementPage() {
    const [activeTab, setActiveTab] = useState("escrow");
    const [filter, setFilter] = useState({});
    const [escrowTransaction, setEscrowTransaction] = useState([]);
    const [serviceTransaction, setServiceTransaction] = useState([]);
    const { user } = useAuthStore();

    const userId = user.userId;
    const fetchData = async () => {
        if (activeTab === "escrow") {
            const res = await api.post(
                `api/transaction/escrow/${user.userId}`,
                filter
            );
            setEscrowTransaction(res.data);
        } else {
            const res = await api.post(
                `api/transaction/service/${user.userId}`,
                filter
            );
            setServiceTransaction(res.data);
        }
    };
    useEffect(() => {
       fetchData();
    }, [filter,userId]);

    return (
        <div className="!p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-1">Quản lý giao dịch</h1>
            <p className="text-gray-500 mb-6">
                Theo dõi và quản lý tất cả giao dịch của bạn
            </p>
            <EscrowFilter onChange={setFilter} currentTab={activeTab}/>
            <TransactionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-6">
                {activeTab === "escrow" && <EscrowTab transactions={escrowTransaction} userId={user.userId} reload={fetchData} />}
                {activeTab === "package" && <PackageTab transactions= {serviceTransaction} />}
            </div>
        </div>
    );
}
