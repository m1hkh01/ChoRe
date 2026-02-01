import BaseCard from "./BaseCard";

export default function CompletedCard() {
    return (
        <BaseCard title="Giao dịch hoàn tất">
            <div className="bg-green-100 p-3 rounded text-green-700 text-sm text-center">
                Giao dịch đã hoàn tất thành công 🎉
            </div>
        </BaseCard>
    );
}
