import { useEffect, useState } from "react";

export function ReasonRefundModal({ onSubmit, onClose, setDispute, dispute }) {
    const [isOtherReason, setIsOtherReason] = useState(false);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(dispute?.BankCode || "");
    const [accountNumber, setAccountNumber] = useState(dispute?.BankNumber || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Khóa scroll khi mở modal
        document.body.style.overflow = 'hidden';

        return () => {
            // Mở lại scroll khi đóng modal
            document.body.style.overflow = 'auto';
        };
    }, []);
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await fetch("https://api.vietqr.io/v2/banks");
                const data = await res.json();
                if (data.code === "00" && data.data) {
                    setBanks(data.data);
                }
            } catch (err) {
                console.error("Error loading banks", err);
            }
        };
        fetchBanks();
    }, []);

    

    const handleBankChange = (e) => {
        const code = e.target.value;
        const bank = banks.find(b => b.code === code);
        setSelectedBank(code);
        setDispute(prev => ({ ...prev, BankCode: code, BankName: bank?.name || "" }));
    };

    const onChangeReason = (e) => {
        if (e.target.value == "Khác") {
            setIsOtherReason(true);
            setDispute(prev => ({ ...prev, DisputeReason: "" }))
        }
        else {
            setIsOtherReason(false);
            setDispute(prev => ({ ...prev, DisputeReason: e.target.value }))
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            </div>
            <div className="fixed top-[10%] left-[35%] w-120 h-auto rounded-2xl bg-white z-100 show-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-b-2 border-gray-200">
                    <h2 className="text-lg font-semibold">
                        Lý do hoàn tiền
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 !text-2xl"
                    >
                        ✕
                    </button>
                </div>
                {/* Body */}
                <div className="p-3">
                    <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); setLoading(true); onSubmit() }}>
                        <div className="mt-3">
                            <label htmlFor="selectDicision" className="block font-bold text-gray-500">Chọn lý do (*)</label>
                            <div className="mt-2">
                                <select id="selectDicision"
                                    className="shadow-sm p-3 w-full 
                                        rounded-2xl border focus:outline-none !text-lg"
                                    onChange={(e) => onChangeReason(e)}
                                >
                                    <option value="" className="text-center">------------- Chọn Lý do ---------------</option>
                                    <option value="Hàng không đúng mô tả">Hàng không đúng mô tả</option>
                                    <option value="Hàng bị hư hại">Hàng bị hư hại</option>
                                    <option value="Không có nhu cầu mua nữa">Không có nhu cầu mua nữa</option>
                                    <option value="Khác">Lý do khác</option>
                                </select>
                            </div>
                        </div>
                        {/* bank inputs */}
                        <div className="mt-3">
                            <label htmlFor="bankSelect" className="block font-bold text-gray-500">Chọn ngân hàng</label>
                            <div className="mt-2">
                                <select id="bankSelect"
                                    className="shadow-sm p-3 w-full rounded-2xl border focus:outline-none !text-lg"
                                    value={selectedBank}
                                    onChange={handleBankChange}
                                >
                                    <option value="">--- Chọn ngân hàng ---</option>
                                    {banks.map(b => (
                                        <option key={b.code} value={b.code}>{b.shortName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="accountNumber" className="block font-bold text-gray-500">Số tài khoản</label>
                            <input
                                id="accountNumber"
                                type="text"
                                value={accountNumber}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, "");
                                    setAccountNumber(raw);
                                    setDispute(prev => ({ ...prev, BankNumber: raw }));
                                }}
                                className="shadow-sm p-3 w-full rounded-2xl border focus:outline-none !text-lg"
                            />
                        </div>
                        {
                            isOtherReason && (
                                <div className="mt-2">
                                    {/* <label htmlFor="decisionNote" className="block font-bold text-gray-500">Lý do khá\\</label> */}
                                    <div>
                                        <textarea required id="decisionNote" onChange={(e) => setDispute(prev => ({ ...prev, DisputeReason: e.target.value }))}
                                            className="w-full border p-2 focus:outline-none rounded-xl"
                                            rows={5} placeholder="Nhập lý do ...">
                                        </textarea>
                                    </div>
                                </div>
                            )
                        }
                        
                        <div className="mt-3 flex gap-2 justify-end">
                            <button onClick={onClose} className="px-3 !py-2 !rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600">Hủy</button>
                            <button type="submit"
                                disabled={loading}
                                className="px-3 py-2 !rounded-xl font-semibold 
                                text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
                            >{ loading ? "Chờ xử lý..." : "Xác nhận" }</button>
                        </div>
                    </form>


                </div>

            </div>
        </>
    )
}