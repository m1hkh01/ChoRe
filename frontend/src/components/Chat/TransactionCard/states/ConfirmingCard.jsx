import BaseCard from "./BaseCard";

export default function ConfirmingCard({ transaction, isBuyer, isSeller, confirmedByCurrentUser, canConfirm, onConfirm, timeRemaining }) {
    return (
        <BaseCard title="Chờ xác nhận giao dịch" footer={`⏱ Tự động hủy sau: ${timeRemaining}`}>
            <p className="text-sm text-gray-700 mb-4 text-center">
                Hai bên cần xác nhận để tạo giao dịch trung gian
            </p>

            {confirmedByCurrentUser ? (
                <div className="text-center bg-gray-200 w-70 mx-auto p-2 rounded-md text-gray-600 text-sm">
                    {isBuyer ? "Chờ người bán xác nhận" : "Chờ người mua xác nhận"}
                </div>
            ) : (
                <div className="text-center">
                    <button
                        onClick={onConfirm}
                        disabled={!canConfirm}
                        className="bg-green-500 text-white px-[1.5rem_!important] py-2 rounded font-bold hover:bg-green-600 disabled:opacity-50"
                    >
                        Xác nhận
                    </button>
                </div>
            )}
        </BaseCard>
    );
}
