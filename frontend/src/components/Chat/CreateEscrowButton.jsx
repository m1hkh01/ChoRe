import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * Component: Button & Dialog để tạo giao dịch trung gian
 * 
 * Props:
 * - conversationId: ID của conversation
 * - connectionRef: SignalR connection ref (để invoke CreateEscrow)
 * - onSuccess: callback khi tạo thành công
 */
export function CreateEscrowButton({ conversationId, connectionRef, onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        if (!connectionRef?.current?.state === 1) {
            setError("Mất kết nối SignalR");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Gọi SignalR method
            await connectionRef.current.invoke("CreateEscrow", conversationId, parseFloat(amount));

            // Reset form
            setAmount("");
            setIsOpen(false);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error("Lỗi tạo escrow:", err);
            setError(err.message || "Lỗi khi tạo giao dịch");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition"
            >
                <FontAwesomeIcon icon={faExchangeAlt} />
                Tạo giao dịch
            </button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        {/* Tiêu đề */}
                        <h2 className="text-xl font-bold mb-4">🔒 Tạo giao dịch trung gian</h2>

                        {/* Input số tiền */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số tiền (đ)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError("");
                                }}
                                placeholder="Nhập số tiền"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isLoading}
                                min="1"
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Nút hành động */}
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setError("");
                                    setAmount("");
                                }}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isLoading || !amount}
                                className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition disabled:opacity-50"
                            >
                                {isLoading ? "Đang tạo..." : "Tạo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
