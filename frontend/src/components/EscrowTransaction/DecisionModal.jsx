export function DecisionModal({ onClose, setDisputeData, onSubmit }) {

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            </div>
            <div className="absolute top-[10%] left-[35%] w-120 h-auto rounded-2xl bg-white z-100 show-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-b-2 border-gray-200">
                    <h2 className="text-lg font-semibold">
                        Xử lý tranh chấp
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
                    <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
                        <div className="mt-3">
                            <label htmlFor="selectDicision" className="block font-bold text-gray-500">Chọn lý do (*)</label>
                            <div className="mt-2">
                                <select id="selectDicision"
                                    className="shadow-sm p-3 w-full 
                                        rounded-2xl border focus:outline-none"
                                    onChange={(e) => {setDisputeData(prev => ({ ...prev, Decision: e.target.value }))}}
                                >
                                    <option value="" className="text-center">----- Chọn Lý do ------</option>
                                    <option value="Người mua đưa ra được bằng chứng hợp lệ">Người mua đưa ra được bằng chứng hợp lệ</option>
                                    <option value="Người bán không đưa ra được bằng chứng hợp lệ">Người bán đưa ra được bằng chứng hợp lệ</option>
                                    {/* <option value="Người mua đưa ra được bằng chứng hợp lệ">Người mua đưa ra được bằng chứng hợp lệ</option> */}
                                </select>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="decisionNote" className="block font-bold text-gray-500">Chi tiết lý do</label>
                            <div>
                                <textarea id="decisionNote" onChange={(e) => setDisputeData(prev => ({ ...prev, DecisionNote :e.target.value}))}
                                    className="w-full border p-2 focus:outline-none rounded-xl"
                                    rows={5} placeholder="Nhập lý do chi tiết...">
                                
                                </textarea>
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