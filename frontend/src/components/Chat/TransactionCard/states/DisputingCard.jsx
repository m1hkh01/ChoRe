import BaseCard from "./BaseCard";

export default function DisputingCard() {
    return (
        <BaseCard title="Giao dịch đang tranh chấp">
            <div className="bg-orange-100 p-3 rounded text-orange-700 text-sm text-center">
                Giao dịch đang được hệ thống xử lý tranh chấp
            </div>
        </BaseCard>
    );
}
