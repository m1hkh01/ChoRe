import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function EscrowTable({ data, onPreview }) {
    return (
        <div className="bg-white rounded-xl mt-2 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="p-3">Mã GD</th>
                        <th className="p-3">Người mua</th>
                        <th className="p-3">Người bán</th>
                        <th className="p-3">Tiền sản phẩm</th>
                        <th className="p-3">Phí giao dịch (3%)</th>
                        <th className="p-3">Tổng tiền</th>
                        <th className="p-3 text-center">Trạng thái</th>
                        <th className="p-3 text-center">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map(t => (
                        <tr key={t.transactionId} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-medium truncate max-w-2" title={ t.transactionOrderCode }>{t.transactionOrderCode}</td>
                            <td className="p-3">{t.buyerName}</td>
                            <td className="p-3">{t.sellerName}</td>
                            <td className="p-3 text-green-600 font-bold">
                                {t.postPrice.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="p-3 text-green-600 font-bold">
                                {t.platformFee.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="p-3 text-green-600 font-bold">
                                {t.amount.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="p-3 text-center">
                                <span className={`${t.status == "Disputing" ? 'bg-red-500 text-white' : ''} text-sm font-bold py-2 px-2 rounded-2xl `}>{t.statusDescription}</span>
                            </td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => onPreview(t)}
                                    className="text-blue-600 font-semibold"
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
