import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function RefundRejectedCard() {
    return (
        <BaseCard title="Từ chối hoàn tiền">
            <div className={`${STATUS_STYLES["RefundRejected"]} p-3 rounded text-md text-center`}>
                Đã từ chối hoàn tiền lại cho người mua
            </div>
        </BaseCard>
    );
}
