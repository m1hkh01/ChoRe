import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function CancelledCard() {
    return (
        <BaseCard title="Giao dịch đã huỷ">
            <div className={`${STATUS_STYLES["Cancelled"]} p-3 rounded text-md text-center`}>
                Giao dịch đã bị huỷ
            </div>
        </BaseCard>
    );
}
