import { useEffect, useState } from "react";
import api from "@/api";

function SpecificationManager() {
    const [categories, setCategories] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [cateId, setCateId] = useState("");
    const [form, setForm] = useState({ specId: null, specName: "", description: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/api/admin/categories")
            .then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (!cateId) return;
        api.get(`/api/admin/specifications/by-category/${cateId}`)
            .then(res => setSpecs(res.data));
    }, [cateId]);

    const submit = async () => {
        if (!form.specName.trim())
            return setError("Tên thông số là bắt buộc");

        try {
            const payload = {
                specName: form.specName,
                description: form.description,
                cateId
            };

            if (isEditing) {
                await api.put(`/api/admin/specifications/${form.specId}`, payload);
            } else {
                await api.post("/api/admin/specifications", payload);
            }

            resetForm();
            loadSpecs();
        } catch (err) {
            setError(err.response?.data || "Có lỗi xảy ra");
        }
    };

    const loadSpecs = async () => {
        const res = await api.get(`/api/admin/specifications/by-category/${cateId}`);
        setSpecs(res.data);
    };

    const edit = (s) => {
        setIsEditing(true);
        setForm(s);
    };

    const del = async (id) => {
        if (!confirm("Xóa thông số này?")) return;
        try {
            await api.delete(`/api/admin/specifications/${id}`);
            loadSpecs();
        } catch (err) {
            alert(err.response?.data);
        }
    };

    const resetForm = () => {
        setForm({ specId: null, specName: "", description: "" });
        setIsEditing(false);
        setError("");
    };

    return (
        <div className="p-4">
            <h3>Quản lý cấu hình phân loại</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <select
                className="form-control mb-3"
                value={cateId}
                onChange={e => {
                    setCateId(Number(e.target.value));
                    resetForm();
                }}
            >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => (
                    <option key={c.cateId} value={c.cateId}>
                        {c.cateName}
                    </option>
                ))}
            </select>

            {cateId && (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5>{isEditing ? "Cập nhật" : "Thêm"} thông số</h5>

                            <input
                                className="form-control mb-2"
                                placeholder="Tên thông số"
                                value={form.specName}
                                onChange={e => setForm({ ...form, specName: e.target.value })}
                            />

                            <input
                                className="form-control mb-2"
                                placeholder="Mô tả"
                                value={form.description || ""}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />

                            <button className="btn btn-primary" onClick={submit}>
                                {isEditing ? "Cập nhật" : "Thêm"}
                            </button>

                            {isEditing && (
                                <button className="btn btn-secondary ms-2" onClick={resetForm}>
                                    Hủy
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tên thông số</th>
                                <th>Mô tả</th>
                                <th width="120">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specs.map(s => (
                                <tr key={s.specId}>
                                    <td>{s.specName}</td>
                                    <td>{s.description || "-"}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-1" onClick={() => edit(s)}>
                                            Sửa
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => del(s.specId)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default SpecificationManager;
