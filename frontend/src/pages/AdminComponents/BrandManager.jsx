import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "@/api";
import "@/assets/brand-manager.css";

function BrandManager() {
    const [brands, setBrands] = useState([]);            // flat list (admin list)
    const [brandTree, setBrandTree] = useState([]);      // parent–child tree
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        brandId: null,
        brandName: "",
        description: "",
        parentBrandId: "",
        cateIds: []
    });

    const [logo, setLogo] = useState(null);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // ================= LOAD DATA =================
    const loadBrands = async () => {
        const res = await api.get("/api/admin/brands");
        setBrands(res.data);
    };

    const loadBrandTree = async () => {
        const res = await api.get("/api/admin/brands/tree");
        setBrandTree(res.data);
    };

    const loadCategories = async () => {
        const res = await api.get("/api/admin/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        loadBrands();
        loadBrandTree();
        loadCategories();
    }, []);

    // ================= SUBMIT =================
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
        if (form.parentBrandId)
            fd.append("ParentBrandId", Number(form.parentBrandId));
        // nếu không chọn cha → KHÔNG append gì cả

        form.cateIds.forEach(id => fd.append("CateIds", Number(id)));
        if (logo) fd.append("logo", logo);

        try {
            if (isEditing) {
                await api.put(`/api/admin/brands/${form.brandId}`, fd);
            } else {
                await api.post("/api/admin/brands", fd);
            }

            resetForm();
            loadBrands();
            loadBrandTree();
        } catch (err) {
            const errorData = err.response?.data;

            if (typeof errorData === 'string') setError(errorData);
            else if (errorData?.title) setError(errorData.title);
            else if (errorData?.errors) {
                const messages = Object.values(errorData.errors).flat();
                setError(messages.join(", "));
            } else setError("Có lỗi xảy ra");

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
            parentBrandId: brand.parentBrandId || "",
            cateIds: brand.cateIds || []
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
            loadBrandTree();
        } catch (err) {
            const errorData = err.response?.data;
            alert(typeof errorData === 'string' ? errorData : "Không thể xóa thương hiệu");
        }
    };

    // ================= RESET =================
    const resetForm = () => {
        setForm({
            brandId: null,
            brandName: "",
            description: "",
            parentBrandId: "",
            cateIds: []
        });
        setLogo(null);
        setError("");
        setIsEditing(false);
    };

    // ================= RENDER TREE OPTIONS =================
    const renderTreeOptions = (nodes, level = 0) => {
        return nodes.flatMap(b => [
            <option key={`brand-${b.brandId}`} value={b.brandId}>
                {"—".repeat(level)} {b.brandName}
            </option>,
            ...(b.subBrands ? renderTreeOptions(b.subBrands, level + 1) : [])
        ]);
    };

    return (
        <div className="p-4">
            <h3 className="mb-4">Quản lý thương hiệu (Cha – Con)</h3>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
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
                        <label className="form-label">Thương hiệu cha</label>
                        <select
                            className="form-control"
                            value={form.parentBrandId}
                            onChange={e => setForm({ ...form, parentBrandId: e.target.value })}
                        >
                            <option value="">-- Không có (Brand gốc) --</option>
                            {renderTreeOptions(brandTree)}
                        </select>
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
                        <label className="form-label">Logo</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={e => setLogo(e.target.files?.[0] || null)}
                        />
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
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={submit}>
                            {isEditing ? "Cập nhật" : "Thêm mới"}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
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
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th width="80">Logo</th>
                                <th>Tên</th>
                                <th>Cha</th>
                                <th width="150">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(b => (
                                <tr key={b.brandId}>
                                    <td className="text-center">
                                        {b.brandLogo ? (
                                            <img
                                                src={`${API_BASE_URL}/brands/${b.brandLogo}`}
                                                width={50}
                                                height={50}
                                                style={{ objectFit: "contain" }}
                                            />
                                        ) : "-"}
                                    </td>
                                    <td>{b.brandName}</td>
                                    <td>{b.parentBrandName || "-"}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => editBrand(b)}>Sửa</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteBrand(b.brandId)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BrandManager;
