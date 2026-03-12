import { useState, useEffect } from "react";
import { Toast } from "../../../utils/toast";
import api from "../../../api";

export function BankDetailsModal({ isBuyer ,onSubmit, onClose, transactionId, currentBankName, currentBankNumber }) {
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(currentBankName ?? "");
    const [bankName, setBankName] = useState(currentBankName ?? "");
    const [accountNumber, setAccountNumber] = useState(currentBankNumber ?? "");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {

        // Khóa scroll khi mở modal
        document.body.style.overflow = 'hidden';

        return () => {
            // Mở lại scroll khi đóng modal
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://api.vietqr.io/v2/banks");
            const data = await response.json();
            if (data.code === "00" && data.data) {
                setBanks(data.data);
            }
        } catch (error) {
            console.error("Error fetching banks:", error);
            Toast.fire({
                icon: "error",
                title: "Lỗi tải danh sách ngân hàng"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBankChange = (e) => {
        const bankCode = e.target.value;
        const selected = banks.find(b => b.code === bankCode);
        if (selected) {
            setSelectedBank(bankCode);
            setBankName(selected.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBank || !accountNumber) {
            Toast.fire({
                icon: "warning",
                title: "Vui lòng chọn ngân hàng và nhập số tài khoản"
            });
            return;
        }

        // Verify account via backend
        try {
            setVerifying(true);
            const response = await api.post(`api/transaction/verify-bank/${transactionId}`, {
                isBuyer: isBuyer,
                bankCode: selectedBank,
                bankName: bankName,
                accountNumber: accountNumber
            });

            if (response.data.success) {
                Toast.fire({
                    icon: "success",
                    title: "Xác minh tài khoản thành công"
                });
                onSubmit({
                    bankCode: selectedBank,
                    bankName: bankName,
                    accountNumber: accountNumber
                });
                onClose();
            } else {
                Toast.fire({
                    icon: "error",
                    title: response.data.message || "Xác minh tài khoản thất bại"
                });
            }
        } catch (error) {
            console.error("Verification error:", error);
            Toast.fire({
                icon: "error",
                title: error.response?.data?.message || "Có lỗi xảy ra khi xác minh tài khoản"
            });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            </div>
            <div className="fixed top-[10%] left-[50%] translate-middle-x w-120 h-auto rounded-2xl bg-white z-100 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-b-2 border-gray-200">
                    <h2 className="text-2xl! font-semibold! text-blue-900">
                        Nhập thông tin ngân hàng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 !text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Bank Selection */}
                        <div>
                            <label htmlFor="bankSelect" className="block font-semibold text-gray-700 mb-2">
                                Chọn ngân hàng (*)
                            </label>
                            <select
                                id="bankSelect"
                                value={selectedBank}
                                onChange={handleBankChange}
                                disabled={loading}
                                className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {loading ? "Đang tải danh sách ngân hàng..." : "--- Chọn ngân hàng ---"}
                                </option>
                                {banks.map(bank => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.shortName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Account Number */}
                        <div>
                            <label htmlFor="accountNumber" className="block font-semibold text-gray-700 mb-2">
                                Số tài khoản (*)
                            </label>
                            <input
                                id="accountNumber"
                                type="text"
                                placeholder="Nhập số tài khoản"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Info */}
                        <div className="bg-orange-100 border border-blue-200 p-3 rounded-xl text-sm text-black">
                            <p className="font-semibold mb-1">ⓘ Lưu ý:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Thông tin ngân hàng sẽ được xác minh trước khi lưu</li>
                                <li>Chỉ người bán có quyền cập nhật thông tin này</li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl! font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={verifying || loading}
                                className="px-4 py-2 rounded-xl! font-semibold text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {verifying ? "Đang xác minh..." : "Lưu thông tin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
