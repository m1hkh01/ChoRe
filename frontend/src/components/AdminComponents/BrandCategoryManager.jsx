import { useEffect, useState } from "react";
import api from "@/api";

function BrandCategoryManager() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandId, setBrandId] = useState("");
    const [cateIds, setCateIds] = useState([]);

    useEffect(() => {
        api.get("/api/admin/brands").then(res => setBrands(res.data));
        api.get("/api/admin/categories").then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (!brandId) return;
        api.get(`/api/admin/brand-categories/${brandId}`)
            .then(res => setCateIds(res.data));
    }, [brandId]);

    const save = async () => {
        await api.put("/api/admin/brand-categories", {
            brandId,
            cateIds
        });
        alert("Đã lưu phân loại");
    };

    return (
        <div className="p-4">
            <h3>Phân loại thương hiệu</h3>

            <select
                className="form-control mb-3"
                value={brandId}
                onChange={e => setBrandId(Number(e.target.value))}
            >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map(b => (
                    <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                ))}
            </select>

            {brandId && (
                <>
                    <select
                        multiple
                        className="form-control mb-3"
                        style={{ minHeight: 200 }}
                        value={cateIds}
                        onChange={e =>
                            setCateIds(Array.from(e.target.selectedOptions, o => Number(o.value)))
                        }
                    >
                        {categories.map(c => (
                            <option key={c.cateId} value={c.cateId}>
                                {c.cateName}
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={save}>
                        Lưu phân loại
                    </button>
                </>
            )}
        </div>
    );
}

export default BrandCategoryManager;
