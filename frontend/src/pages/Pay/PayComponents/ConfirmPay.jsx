export default function ConfirmPay({ onPay }) {
    return (
        <div className="mt-2 text-center">
            <p className="text-xs text-gray-500 mb-1">
                Sau khi chuyển khoản thành công vui lòng chờ vài giây rồi,
                <br />
                nhấn nút bên dưới
            </p>
            <button
                onClick={onPay}
                className="w-full py-2 !rounded-lg font-semibold hover:bg-gray-100"
            >
                Xác nhận thanh toán
            </button>
        </div>
    );
}
