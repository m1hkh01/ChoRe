import { useEffect, useState } from "react";
import api from "@/api";
import { Eye } from "lucide-react";
import "@/assets/user-subscription.css";

export default function UserSubscriptionManager() {
    const [subs, setSubs] = useState([]);

    const load = async () => {
        const res = await api.get("/api/admin/user-subscriptions");
        setSubs(res.data);
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="p-4">
            <h3>Quản lý gói người dùng</h3>

            <div className="card mt-3">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Người dùng</th>
                            <th>Gói</th>
                            <th>Thời hạn</th>
                            <th>Lượt còn lại</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {subs.map(s => (
                            <tr key={s.userSubId}>
                                <td>
                                    <b>{s.fullName}</b>
                                    <div className="small text-muted">{s.email}</div>
                                </td>

                                <td>
                                    <b>{s.subPlanName}</b>
                                    <div className="small">{s.subPlanPrice.toLocaleString()} đ</div>
                                </td>

                                <td>
                                    {new Date(s.startDate).toLocaleDateString()}  
                                    <br />
                                    <small className="text-muted">
                                        → {new Date(s.endDate).toLocaleDateString()}
                                    </small>
                                </td>

                                <td>
                                    <div>Bài gói: <b>{s.remainingSubPost}</b></div>
                                    <div>Bài free: <b>{s.remainingFreePost}</b></div>
                                </td>

                                <td>
                                    <span className={`badge ${s.isActive ? "badge-active" : "badge-expired"}`}>
                                        {s.isActive ? "Còn hiệu lực" : "Hết hạn"}
                                    </span>
                                </td>

                                <td>
                                    {/* <button className="btn btn-outline-secondary btn-sm">
                                        <Eye size={16} />
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
