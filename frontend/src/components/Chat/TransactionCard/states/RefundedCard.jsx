import BaseCard from "./BaseCard";

export default function RefundedCard() {
    return (
        <BaseCard title="Đã hoàn tiền">
            <div className="bg-purple-100 p-3 rounded text-purple-700 text-sm text-center">
                Tiền đã được hoàn lại cho người mua
            </div>
        </BaseCard>
    );
}
