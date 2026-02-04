
import { DecisionModal } from "./DecisionModal";

export default function DisputeAction({ transaction, setOpenDecision, setDisputeData }) {
    return (
        <div className="border shadow-sm border-red-200 bg-red-100 rounded-xl p-3 mt-2">
            <h3 className="font-semibold text-red-600 mb-2">
                Tranh chấp đang xử lý
            </h3>

            <p className="text-sm text-gray-700 mb-4">
                <b>Lý do:</b> {transaction.disputeReason}
            </p>
            <div className="text-sm text-gray-700 mb-4 flex flex-wrap justify-center">
                <div className="text-lg font-bold w-full text-center mb-2 ">Bằng chứng</div>
                {
                    transaction.disEvidence ? transaction.disEvidence.map((d,index) => (
                        <>
                            <div className="w-1/2 flex flex-col items-center">
                                {transaction.buyerId == d.submitByUserId ? <p key={index} className="text-gray-600 font-semibold text-md ">Người mua</p> : <p key={index} className="text-gray-600 font-semibold text-md">Người bán</p>}
                                {
                                    d.evidences.length > 0 ? d.evidences.map((e,index)=>
                                        <>
                                            <div key={index}>
                                                <p className="truncate w-40"><b>Link:</b> <a href={e.disEvidenceLink} title={e.disEvidenceLink}>{e.disEvidenceLink}</a></p>
                                                <p><b>Mô tả: </b> {e.description} </p>
                                            </div>
                                        </>
                                    ) : <span>Không có bằng chứng</span>
                                }
                            </div>
                        </>
                    )) : <span>Không có bằng chứng</span>
                }
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-4 py-2 !rounded-lg bg-red-600
                  hover:bg-red-700 text-white
                    text-sm font-medium"
                    onClick={() => {
                        setDisputeData(prev => ({ ...prev, DisputeSatatus: 3 }))
                        setOpenDecision(true)
                    }}
                >
                    Từ chối hoàn tiền
                </button>
                <button className="px-4 py-2 !rounded-lg bg-green-600 
                    hover:bg-green-700 text-white
                    text-sm font-medium"
                    onClick={() => {
                        setDisputeData(prev => ({ ...prev, DisputeSatatus : 2 }))
                        setOpenDecision(true)
                    }}
                >
                    Hoàn tiền
                </button>
            </div>
        </div>
    );
}
