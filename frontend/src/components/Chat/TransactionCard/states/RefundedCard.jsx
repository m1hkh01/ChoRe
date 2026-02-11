import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function RefundedCard() {
    return (
        <BaseCard title="Đã hoàn tiền">
            <div className={`${STATUS_STYLES["Refunded"]} p-3 rounded text-md text-center`}>
                Tiền đã được hoàn lại cho người mua
            </div>
        </BaseCard>
    );
}
