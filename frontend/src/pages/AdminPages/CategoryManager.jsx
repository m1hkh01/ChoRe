import { useEffect, useState } from "react";
import api from "@/api";

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        cateId: null,
        cateName: "",
        description: "",
        parentCateId: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    // Load danh sách
    const loadData = async () => {
        const res = await api.get("/api/admin/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Submit thêm / sửa
    const submit = async () => {
        if (!form.cateName.trim())
            return setError("Tên danh mục là bắt buộc");

        try {
            const payload = {
                cateName: form.cateName,
                description: form.description,
                parentCateId: form.parentCateId || null
            };

            if (isEditing) {
                await api.put(`/api/admin/categories/${form.cateId}`, payload);
            } else {
                await api.post("/api/admin/categories", payload);
            }

            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data || "Có lỗi xảy ra");
        }
    };

    // Edit
    const edit = (c) => {
        setIsEditing(true);
        setForm({
            cateId: c.cateId,
            cateName: c.cateName,
            description: c.description || "",
            parentCateId: c.parentCateId || ""
        });
    };

    // Delete
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
        setForm({
            cateId: null,
            cateName: "",
            description: "",
            parentCateId: ""
        });
        setIsEditing(false);
        setError("");
    };

    // Lấy danh mục cha
    const parentCategories = categories.filter(c => c.parentCateId == null);

    return (
        <div className="p-4">
            <h3>Quản lý phân loại</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* FORM */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5>{isEditing ? "Cập nhật" : "Thêm mới"} danh mục</h5>

                    {/* Tên */}
                    <input
                        className="form-control mb-2"
                        placeholder="Tên danh mục"
                        value={form.cateName}
                        onChange={e => setForm({ ...form, cateName: e.target.value })}
                    />

                    {/* Mô tả */}
                    <textarea
                        className="form-control mb-2"
                        placeholder="Mô tả"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />

                    {/* Chọn danh mục cha */}
                    <select
                        className="form-control mb-3"
                        value={form.parentCateId || ""}
                        onChange={e => setForm({ ...form, parentCateId: e.target.value || "" })}
                    >
                        <option value="">-- Danh mục gốc --</option>
                        {parentCategories.map(c => (
                            <option key={c.cateId} value={c.cateId}>
                                {c.cateName}
                            </option>
                        ))}
                    </select>

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

            {/* TABLE */}
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
                    {parentCategories.map(parent => (
                        <>
                            {/* Dòng cha */}
                            <tr key={parent.cateId} className="table-primary">
                                <td><strong>{parent.cateName}</strong></td>
                                <td>{parent.description || "-"}</td>
                                <td>{parent.brandCount}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-1"
                                        onClick={() => edit(parent)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => del(parent.cateId)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>

                            {/* Dòng con */}
                            {categories
                                .filter(c => c.parentCateId === parent.cateId)
                                .map(child => (
                                    <tr key={child.cateId}>
                                        <td style={{ paddingLeft: "30px" }}>
                                            ↳ {child.cateName}
                                        </td>
                                        <td>{child.description || "-"}</td>
                                        <td>{child.brandCount}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-1"
                                                onClick={() => edit(child)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => del(child.cateId)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryManager;
