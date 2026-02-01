export default function ConfirmPay({ onPay }) {
    return (
        <div className="mt-5 text-center">
            <p className="text-xs text-gray-500 mb-2">
                Sau khi chuyển khoản thành công,
                <br />
                vui lòng nhấn nút bên dưới
            </p>
            <button
                onClick={onPay}
                className="w-full py-2 rounded-lg font-semibold hover:bg-emerald-100"
            >
                Thanh toán thành công
            </button>
        </div>
    );
}
