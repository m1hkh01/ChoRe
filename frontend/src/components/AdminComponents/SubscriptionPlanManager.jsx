import { useEffect, useState } from "react";
import api from "@/api";
import { Pencil, Lock, Unlock, Plus } from "lucide-react";
import "@/assets/subscription-plan.css";
import { Trash } from "lucide-react";

export default function SubscriptionPlanManager() {
    const [plans, setPlans] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const fields = [
        { key: "subPlanName", label: "Tên gói" },
        { key: "subPlanTitle", label: "Mô tả ngắn" },
        { key: "subPlanPromo", label: "Nội dung quảng cáo" },
        { key: "subPlanPrice", label: "Giá gói (VNĐ)", type: "number" },
        { key: "durationDays", label: "Thời hạn (ngày)", type: "number" },
        { key: "maxPostPerSub", label: "Số bài đăng tối đa", type: "number" }
    ];

    const load = async () => {
        const res = await api.get("/api/admin/subscription-plans");
        setPlans(res.data);
    };

    useEffect(() => { load(); }, []);

    const submit = async () => {
        const payload = {
            ...form,
            subPlanPrice: Number(form.subPlanPrice),
            durationDays: Number(form.durationDays),
            maxPostPerSub: Number(form.maxPostPerSub)
        };
        if (editing)
            await api.put(`/api/admin/subscription-plans/${editing.subPlanId}`, payload);
        else
            await api.post("/api/admin/subscription-plans", payload);

        setOpen(false);
        setEditing(null);
        load();
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Quản lý gói dịch vụ</h3>
                <button className="btn btn-success" onClick={() => {
                    setEditing(null);
                    setForm({});
                    setOpen(true);
                }}>
                    <Plus size={16} /> Thêm gói
                </button>
            </div>

            <div className="card">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Tên gói</th>
                            <th>Giá</th>
                            <th>Thời hạn</th>
                            <th>Bài tối đa</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(p => (
                            <tr key={p.subPlanId}>
                                <td>
                                    <b>{p.subPlanName}</b>
                                    <div className="text-muted small">{p.subPlanTitle}</div>
                                </td>
                                <td>{p.subPlanPrice.toLocaleString()} đ</td>
                                <td>{p.durationDays} ngày</td>
                                <td>{p.maxPostPerSub}</td>
                                <td>
                                    <span className={`badge ${p.isActive ? "badge-active" : "badge-inactive"}`}>
                                        {p.isActive ? "Đang bán" : "Ngừng bán"}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <button className="btn btn-outline-secondary btn-sm"
                                            onClick={() => { setEditing(p); setForm(p); setOpen(true); }}>
                                            <Pencil size={16} />
                                        </button>

                                        <button className="btn btn-outline-warning btn-sm"
                                            onClick={async () => {
                                                await api.patch(`/api/admin/subscription-plans/${p.subPlanId}/toggle`);
                                                load();
                                            }}>
                                            {p.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={async () => {
                                                if (!confirm("Bạn có chắc muốn xoá gói này?")) return;
                                                await api.delete(`/api/admin/subscription-plans/${p.subPlanId}`);
                                                load();
                                            }}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {open && (
                <div className="modal-backdrop-custom">
                    <div className="modal-card">
                        <h5>{editing ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ mới"}</h5>

                        {fields.map(f => (
                            <div key={f.key} className="mb-2">
                                <label className="form-label">{f.label}</label>
                                <input
                                    type={f.type || "text"}
                                    className="form-control"
                                    value={form[f.key] ?? ""}
                                    onChange={e =>
                                        setForm({ ...form, [f.key]: e.target.value })
                                    }
                                />
                            </div>
                        ))}

                        <div className="text-end mt-3">
                            <button className="btn btn-secondary me-2" onClick={() => setOpen(false)}>
                                Huỷ
                            </button>
                            <button className="btn btn-success" onClick={submit}>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
