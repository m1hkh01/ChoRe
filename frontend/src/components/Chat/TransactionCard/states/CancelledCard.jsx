import BaseCard from "./BaseCard";

export default function CancelledCard() {
    return (
        <BaseCard title="Giao dịch đã huỷ">
            <div className="bg-gray-100 p-3 rounded text-gray-700 text-sm text-center">
                Giao dịch đã bị huỷ
            </div>
        </BaseCard>
    );
}
