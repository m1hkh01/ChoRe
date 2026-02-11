import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function CompletedCard() {
    return (
        <BaseCard title="Giao dịch hoàn tất">
            <div className={`${STATUS_STYLES["Completed"]} p-3 rounded text-md text-center`}>
                Giao dịch đã hoàn tất thành công
            </div>
        </BaseCard>
    );
}
