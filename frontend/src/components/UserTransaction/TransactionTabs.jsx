export default function TransactionTabs({ activeTab, setActiveTab }) {
    return (
        <div className="flex gap-8 mb-2 py-3 px-4 border-gray-200 bg-white rounded-2xl">
            <button
                onClick={() => setActiveTab("escrow")}
                className={`pb-2 font-medium ${activeTab === "escrow"
                        ? "border-b-3 border-green-600 text-green-600"
                        : "text-gray-500"
                    }`}
            >
                Giao dịch trung gian
            </button>

            <button
                onClick={() => setActiveTab("package")}
                className={`pb-2 font-medium ${activeTab === "package"
                        ? "border-b-3 border-green-600 text-green-600"
                        : "text-gray-500"
                    }`}
            >
                Giao dịch gói dịch vụ
            </button>
        </div>
    );
}
