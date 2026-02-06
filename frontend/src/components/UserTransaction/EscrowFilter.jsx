import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import api from "@/api";
// import { FaSearch, FaFilter } from "react-icons/fa";

// const STATUS = [
//     { label: "Tất cả", value: "" },
//     { label: "Đang xác nhận", value: "Confirming" },
//     { label: "Chờ thanh toán", value: "PendingPayment" },
//     { label: "Đã thanh toán", value: "Paid" },
//     { label: "Tranh chấp", value: "Disputing" },
//     { label: "Hủy", value: "Cancelled" },
// ];

export default function EscrowFilter({ onChange, currentTab }) {
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState(null);
    const [open, setOpen] = useState(false);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [escrowstatuses, setEscrowStatuses] = useState([]);
    const [servicestatuses, setServiceStatuses] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const [escrow, service] = await Promise.all([
                api.get('api/transaction/escrow-status'),
                api.get('api/transaction/service-status')
            ]);
            setEscrowStatuses(escrow.data);
            setServiceStatuses(service.data);
        }
        fetchData();
    }, [])
    useEffect(() => {
        const resetFilter = () => {
            setKeyword("");
            setStatus(null);
            setFrom("");
            setTo("");
            onChange({});
        }
        resetFilter();
    },[currentTab])
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".filter-dropdown")) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4 mb-3">

            {/* ===== SEARCH ROW ===== */}
            <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center rounded-3xl flex-1 bg-gray-100">
                    <div className="w-7.5 flex justify-end">
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </div>
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            onChange({ keyword: e.target.value, status });
                        }}
                        placeholder="Tìm người mua / người bán / mã giao dịch"
                        className="w-full h-11 px-2 pl-11 pr-4 rounded-3xl bg-gray-100 focus:outline-none transition"
                    />
                </div>

                <div
                    className="h-11 px-4 filter-dropdown relative cursor-pointer flex items-center gap-2 rounded-3xl bg-gray-100 hover:bg-gray-50"
                >
                    <div onClick={() => setOpen(!open)}>
                        <FontAwesomeIcon icon={faFilter} />
                        Lọc
                    </div>
                    {/* ===== ADVANCE FILTER ===== */}
                    {open && (
                        <div className="absolute top-[calc(2.75rem)] right-0 flex items-center flex-col gap-3 p-3 bg-white shadow-sm">
                            <div>
                                <label htmlFor="" className="font-bold text-sm text-gray-500">Từ ngày</label>
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="h-10 px-3 rounded-lg border bg-gray-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="font-bold text-sm text-gray-500">Đến ngày</label>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => { e.preventDefault(); setTo(e.target.value) }}
                                    className="h-10 px-3 rounded-lg border bg-gray-50"
                                />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setKeyword("");
                                        setStatus("");
                                        setFrom("");
                                        setTo("");
                                        onChange({});
                                    }}
                                    className="h-10 px-3 !rounded-lg text-gray-600 bg-red-100 hover:bg-red-200">
                                    Reset
                                </button>
                                <button
                                    onClick={() =>
                                        onChange({ keyword, status, fromDate: from, toDate: to })
                                    }
                                    className="h-10 px-2 !rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium">
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== STATUS TABS ===== */}
            <div className="flex gap-2 flex-wrap mt-2">
                <div
                    onClick={() => {
                        setStatus("");
                        onChange({ keyword, statusId: null });
                    }}
                    className={`
                            px-4 py-2 rounded-3xl text-sm font-medium cursor-pointer transition
                            ${status === null
                            ? "bg-green-600 text-white shadow"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                        `}
                >
                    Tất cả
                </div>
                {(currentTab == "escrow" ? escrowstatuses : servicestatuses).map((s) => (
                    <div
                        key={s.escTransStatusId}
                        onClick={() => {
                            setStatus(s.escTransStatusId);
                            onChange({ keyword, statusId: s.escTransStatusId });
                        }}
                        className={`
                            px-4 py-2 rounded-3xl text-sm font-medium cursor-pointer transition
                            ${status === s.escTransStatusId
                                ? "bg-green-600 text-white shadow"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }
                        `}
                    >
                        {s.description}
                    </div>
                ))}
            </div>
        </div>
    );
}
