import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function ExpiredCard() {
    return (
        <BaseCard title="Giao dịch quá hạn">
            <div className={`${STATUS_STYLES["Expired"]} p-3 rounded text-md text-center`}>
                Giao dịch đã bị hủy do quá thời gian
            </div>
        </BaseCard>
    );
}
