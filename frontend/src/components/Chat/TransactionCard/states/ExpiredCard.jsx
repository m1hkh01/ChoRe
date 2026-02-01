import BaseCard from "./BaseCard";

export default function ExpiredCard() {
    return (
        <BaseCard title="Giao dịch quá hạn">
            <div className="bg-red-100 p-3 rounded text-red-700 text-sm text-center">
                Giao dịch đã bị hủy do quá thời gian
            </div>
        </BaseCard>
    );
}
