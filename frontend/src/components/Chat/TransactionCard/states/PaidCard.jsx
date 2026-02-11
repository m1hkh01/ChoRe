import { STATUS_STYLES } from "../../../../constants/StatusStyles";
import BaseCard from "./BaseCard";

export default function PaidCard() {
    return (
        <BaseCard title="Đã thanh toán">
            <div className={`${STATUS_STYLES["Paid"]} p-3 rounded text-md text-center`}>
                Người mua đã thanh toán. Chờ người bán giao hàng
            </div>
        </BaseCard>
    );
}
