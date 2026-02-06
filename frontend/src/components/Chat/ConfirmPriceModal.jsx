import { useState } from "react";

export function ConfirmPriceModal({ onClose, onSubmit }) {
    const [price, setPrice] = useState(0);
    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            </div>
            <div className="absolute top-[20%] left-[35%] w-110 h-auto rounded-2xl bg-white z-100 show-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-b-2 border-gray-200">
                    <h2 className="text-lg font-semibold">
                        Xác nhận giá bán
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
                    <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); onSubmit(price) }}>
                        <div className="mt-3 w-1/1">
                            <label htmlFor="selectDicision" className="block font-bold text-gray-500">Nhập giá</label>
                            <div className="mt-2">
                                <input type="text"
                                    placeholder="Nhập giá bán VD: 200.000"
                                    className="rounded-xl p-2 w-1/1 
                                    me-2 shadow-sm border focus:outline-none"
                                    onChange={(e) => {
                                        const newPrice = e.target.value.replace(/\D/g, "");
                                        e.target.value = newPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                        setPrice(newPrice);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-3 flex gap-2 justify-end">
                            <button onClick={onClose} className="px-3 !py-2 !rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600">Hủy</button>
                            <button type="submit"
                                className="px-3 py-2 !rounded-xl font-semibold 
                                text-white bg-green-500 hover:bg-green-600"
                            >Xác nhận</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}