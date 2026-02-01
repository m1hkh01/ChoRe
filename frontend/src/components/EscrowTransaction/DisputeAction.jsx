export default function DisputeAction({ transaction }) {
    console.log("transaction: ", transaction);
    return (
        <div className="border border-red-200 bg-red-50 rounded-xl p-3 mt-2">
            <h3 className="font-semibold text-red-600 mb-2">
                Tranh chấp đang xử lý
            </h3>

            <p className="text-sm text-gray-700 mb-4">
                <b>Lý do:</b> {transaction.disputeReason}
            </p>
            <div className="text-sm text-gray-700 mb-4">
                <p className="text-md font-bold">Bằng chứng:</p>
                {
                    transaction.disEvidence ? transaction.disEvidence.map((d)=>(
                        <>
                            <b>Link:</b> <a href={d.disEvidenceLink}>{d.disEvidenceLink}</a>
                            <p><b>Mô tả: </b> {d.description} </p>
                        </>
                    )) : <span>Không có bằng chứng</span>
                }
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-4 py-2 !rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium">
                    Từ chối tranh chấp
                </button>
                <button className="px-4 py-2 !rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium">
                    Hoàn tiền
                </button>
            </div>
        </div>
    );
}
