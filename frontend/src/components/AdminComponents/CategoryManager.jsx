import { useEffect, useState } from "react";
import api from "@/api";

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ cateId: null, cateName: "", description: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    const loadData = async () => {
        const res = await api.get("/api/admin/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const submit = async () => {
        if (!form.cateName.trim())
            return setError("Tên danh mục là bắt buộc");

        try {
            if (isEditing) {
                await api.put(`/api/admin/categories/${form.cateId}`, form);
            } else {
                await api.post("/api/admin/categories", form);
            }
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data || "Có lỗi xảy ra");
        }
    };

    const edit = (c) => {
        setIsEditing(true);
        setForm(c);
    };

    const del = async (id) => {
        if (!confirm("Xóa danh mục này?")) return;
        try {
            await api.delete(`/api/admin/categories/${id}`);
            loadData();
        } catch (err) {
            alert(err.response?.data);
        }
    };

    const resetForm = () => {
        setForm({ cateId: null, cateName: "", description: "" });
        setIsEditing(false);
        setError("");
    };

    return (
        <div className="p-4">
            <h3>Quản lý danh mục</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4">
                <div className="card-body">
                    <h5>{isEditing ? "Cập nhật" : "Thêm mới"} danh mục</h5>

                    <input
                        className="form-control mb-2"
                        placeholder="Tên danh mục"
                        value={form.cateName}
                        onChange={e => setForm({ ...form, cateName: e.target.value })}
                    />

                    <textarea
                        className="form-control mb-2"
                        placeholder="Mô tả"
                        value={form.description}
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
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Số thương hiệu</th>
                        <th width="120">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(c => (
                        <tr key={c.cateId}>
                            <td>{c.cateName}</td>
                            <td>{c.description || "-"}</td>
                            <td>{c.brandCount}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-1" onClick={() => edit(c)}>Sửa</button>
                                <button className="btn btn-sm btn-danger" onClick={() => del(c.cateId)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryManager;
