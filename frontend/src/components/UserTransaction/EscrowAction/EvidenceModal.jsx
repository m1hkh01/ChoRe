import { useState } from "react";

export function EvidenceModal({ onSubmit, onClose }) {
    const [evidences, setEvidences] = useState([
        { Description: "", DisEvidenceLink: "" }
    ]);

    const handleChange = (index, field, value) => {
        setEvidences(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addEvidence = () => {
        setEvidences(prev => [
            ...prev,
            { Description: "", DisEvidenceLink: "" }
        ]);
    };

    const removeEvidence = (index) => {
        setEvidences(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(evidences);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[600px] max-h-[80vh] rounded-2xl bg-white z-50 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b">
                    <h2 className="text-lg font-semibold">
                        Thêm bằng chứng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 font-bold !text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-3 !pl-6 !space-y-4 h-full max-h-[70vh] overflow-y-auto">

                    {evidences.map((evidence, index) => (
                        <div
                            key={index}
                            className="border rounded-xl p-3 bg-white"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-600">
                                    Bằng chứng #{index + 1}
                                </h4>
                                {evidences.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeEvidence(index)}
                                        className="text-red-500 hover:text-red-600 text-sm"
                                    >
                                        Xóa
                                    </button>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Mô tả bằng chứng
                                </label>
                                <textarea
                                    required
                                    value={evidence.Description}
                                    onChange={(e) =>
                                        handleChange(index, "Description", e.target.value)
                                    }
                                    className="w-full border rounded-xl p-2 bg-white focus:outline-none"
                                    rows={3}
                                    placeholder="Ví dụ: Hình ảnh sản phẩm bị hư hại..."
                                />
                            </div>

                            {/* Drive link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Link Google Drive
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={evidence.DisEvidenceLink}
                                    onChange={(e) =>
                                        handleChange(index, "DisEvidenceLink", e.target.value)
                                    }
                                    className="w-full border rounded-xl bg-white p-2 focus:outline-none"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Button */}
                    <button
                        type="button"
                        onClick={addEvidence}
                        className="w-full py-2 border-2 border-dashed border-gray-300 !rounded-xl text-gray-500 hover:bg-gray-100 transition"
                    >
                        + Thêm bằng chứng
                    </button>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 !rounded-xl bg-red-500 text-white hover:bg-red-600"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 !rounded-xl bg-green-600 text-white hover:bg-green-700"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
