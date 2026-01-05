import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "@/api";

function BrandManager() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        brandId: null,
        brandName: "",
        description: "",
        cateIds: []
    });
    const [logo, setLogo] = useState(null);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadBrands();
        loadCategories();
    }, []);

    const loadBrands = async () => {
        try {
            const res = await api.get("/api/admin/brands");
            setBrands(res.data);
        } catch (err) {
            console.error("Load brands error:", err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await api.get("/api/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Load categories error:", err);
        }
    };

    // ================= CREATE / UPDATE =================
    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.brandName.trim())
            return setError("Tên thương hiệu là bắt buộc");

        if (form.cateIds.length === 0)
            return setError("Vui lòng chọn ít nhất 1 danh mục");

        const fd = new FormData();
        fd.append("BrandName", form.brandName);
        fd.append("Description", form.description || "");
        form.cateIds.forEach(id => fd.append("CateIds", Number(id)));
        if (logo) fd.append("logo", logo);

        try {
            if (isEditing) {
                // UPDATE
                await api.put(`/api/admin/brands/${form.brandId}`, fd);
            } else {
                // CREATE
                await api.post("/api/admin/brands", fd);
            }

            resetForm();
            loadBrands();
        } catch (err) {
            const errorData = err.response?.data;

            if (typeof errorData === 'string') {
                setError(errorData);
            } else if (errorData?.title) {
                setError(errorData.title);
            } else if (errorData?.errors) {
                const messages = Object.values(errorData.errors).flat();
                setError(messages.join(", "));
            } else {
                setError("Có lỗi xảy ra");
            }

            console.error("API Error:", errorData);
        }
    };

    // ================= EDIT =================
    const editBrand = (brand) => {
        setIsEditing(true);
        setError("");
        
        setForm({
            brandId: brand.brandId,
            brandName: brand.brandName,
            description: brand.description || "",
            cateIds: [] // User cần chọn lại danh mục
        });
        
        setLogo(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ================= DELETE =================
    const deleteBrand = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;

        try {
            await api.delete(`/api/admin/brands/${id}`);
            loadBrands();
        } catch (err) {
            const errorData = err.response?.data;
            alert(typeof errorData === 'string' ? errorData : "Không thể xóa thương hiệu");
        }
    };

    // ================= RESET FORM =================
    const resetForm = () => {
        setForm({
            brandId: null,
            brandName: "",
            description: "",
            cateIds: []
        });
        setLogo(null);
        setError("");
        setIsEditing(false);
    };

    return (
        <div className="container-fluid p-4">
            <h3 className="mb-4">Quản lý thương hiệu</h3>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError("")}
                    ></button>
                </div>
            )}

            {/* ================= FORM ================= */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        {isEditing ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
                    </h5>

                    <div className="mb-3">
                        <label className="form-label">Tên thương hiệu *</label>
                        <input
                            className="form-control"
                            value={form.brandName}
                            onChange={e => setForm({ ...form, brandName: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Logo {isEditing && "(Bỏ trống nếu không đổi)"}
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={e => setLogo(e.target.files?.[0] || null)}
                        />
                        {logo && (
                            <small className="text-success d-block mt-1">
                                Đã chọn: {logo.name}
                            </small>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Danh mục *</label>
                        <select
                            multiple
                            className="form-control"
                            style={{ minHeight: "120px" }}
                            value={form.cateIds}
                            onChange={e => setForm({
                                ...form,
                                cateIds: Array.from(e.target.selectedOptions, o => Number(o.value))
                            })}
                        >
                            {categories.map(c => (
                                <option key={c.cateId} value={c.cateId}>
                                    {c.cateName}
                                </option>
                            ))}
                        </select>
                        <small className="text-muted d-block mt-1">
                            Giữ Ctrl (Windows) / Cmd (Mac) để chọn nhiều
                        </small>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={submit}
                        >
                            {isEditing ? "Cập nhật" : "Thêm mới"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">Danh sách thương hiệu</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th width="80">Logo</th>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Danh mục</th>
                                    <th width="150" className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted py-4">
                                            Chưa có thương hiệu nào
                                        </td>
                                    </tr>
                                ) : (
                                    brands.map(b => (
                                        <tr key={b.brandId}>
                                            <td className="text-center">
                                                {b.brandLogo ? (
                                                    <img
                                                        src={`${API_BASE_URL}/brands/${b.brandLogo}`}
                                                        alt={b.brandName}
                                                        width={50}
                                                        height={50}
                                                        style={{
                                                            objectFit: "contain",
                                                            border: "1px solid #ddd",
                                                            borderRadius: "4px",
                                                            padding: "4px"
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <strong>{b.brandName}</strong>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {b.description || "-"}
                                                </small>
                                            </td>
                                            <td>
                                                {b.categories?.length > 0
                                                    ? b.categories.join(", ")
                                                    : "-"
                                                }
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => editBrand(b)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => deleteBrand(b.brandId)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BrandManager;