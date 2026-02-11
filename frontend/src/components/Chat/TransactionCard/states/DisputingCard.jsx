import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function DisputingCard() {
    return (
        <BaseCard title="Giao dịch đang tranh chấp">
            <div className={`${STATUS_STYLES["Disputing"]} p-3 rounded text-md text-center`}>
                Giao dịch đang được hệ thống xử lý tranh chấp
            </div>
        </BaseCard>
    );
}
