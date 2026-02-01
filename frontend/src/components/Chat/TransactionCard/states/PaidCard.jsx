import BaseCard from "./BaseCard";

export default function PaidCard() {
    return (
        <BaseCard title="Đã thanh toán">
            <div className="bg-blue-100 p-3 rounded text-blue-700 text-sm text-center">
                Người mua đã thanh toán. Chờ người bán giao hàng
            </div>
        </BaseCard>
    );
}
