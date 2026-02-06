import BaseCard from "./BaseCard";

export default function ConfirmingCard(
    {   transaction,
        priceType,
        isBuyer,
        confirmedByCurrentUser,
        canConfirm, onConfirm,
        timeRemaining,
        onChangePrice
    }) {
    ;
    return (
        <BaseCard title="Chờ xác nhận giao dịch" footer={`⏱ Tự động hủy sau: ${timeRemaining}`}>
            <p className="text-sm text-gray-700 mb-2 text-center">
                Hai bên cần xác nhận để tạo giao dịch trung gian
            </p>

            {confirmedByCurrentUser ? (
                <div className="text-center bg-gray-200 w-70 mx-auto p-2 rounded-md text-gray-600 text-sm">
                    {isBuyer ? "Chờ người bán xác nhận" : "Chờ người mua xác nhận"}
                </div>
            ) : (
                <div className="text-center flex items-end justify-center">
                    {((!transaction.postPrice || priceType?.toLowerCase() !== "fixed") && !isBuyer) &&
                        <input type="text"
                            className="rounded-xl p-2 w-[60%] 
                                me-2 shadow-sm border focus:outline-none"
                            placeholder="Nhập giá chốt VD: 200.000 ..."
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                e.target.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                onChangePrice(raw);
                            }
                            }
                        />
                    }

                    <button
                        onClick={onConfirm}
                        disabled={!canConfirm}
                        className="bg-green-500 text-white px-[1.5rem_!important] py-2 w-max h-max rounded font-bold hover:bg-green-600 disabled:opacity-50"
                    >
                        Xác nhận
                    </button>
                    {/* {!isBuyer && <p className="mt-2 font-light text-gray-500 text-sm cursor-pointer hover:text-gray-700">Thay đổi giá</p>} */}
                </div>
            )}
        </BaseCard>
    );
}
