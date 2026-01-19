import { useEffect, useState } from "react";
import api from "@/api";

function BrandCategoryManager() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]); // tree
    const [brandId, setBrandId] = useState("");
    const [checkedIds, setCheckedIds] = useState([]);

    // Load brands + category tree
    useEffect(() => {
        api.get("/api/admin/brands").then(res => setBrands(res.data));
        api.get("/api/admin/categories/tree").then(res => setCategories(res.data));
    }, []);

    // Load category đã gán cho brand
    useEffect(() => {
        if (!brandId) return;

        api.get(`/api/admin/brand-categories/${brandId}`)
            .then(res => setCheckedIds(res.data));
    }, [brandId]);

    // Lấy tất cả id con của 1 node
    const getAllChildIds = (node) => {
        let ids = [];
        for (let c of node.children) {
            ids.push(c.cateId);
            ids.push(...getAllChildIds(c));
        }
        return ids;
    };

    // Khi tick / bỏ tick
    const toggleCheck = (node, checked) => {
        let newChecked = [...checkedIds];

        const childIds = getAllChildIds(node);

        if (checked) {
            // Tick node + toàn bộ con
            newChecked.push(node.cateId, ...childIds);
        } else {
            // Bỏ tick node + toàn bộ con
            newChecked = newChecked.filter(
                id => id !== node.cateId && !childIds.includes(id)
            );
        }

        // Loại trùng
        newChecked = [...new Set(newChecked)];

        // Tự động cập nhật cha
        updateParentCheck(categories, newChecked);

        setCheckedIds(newChecked);
    };

    // Tự động tick / bỏ tick cha dựa vào con
    const updateParentCheck = (nodes, checked) => {
        for (let node of nodes) {
            if (node.children.length > 0) {
                updateParentCheck(node.children, checked);

                const childIds = getAllChildIds(node);
                const allChecked = childIds.every(id => checked.includes(id));

                if (allChecked && !checked.includes(node.cateId)) {
                    checked.push(node.cateId);
                }

                if (!allChecked && checked.includes(node.cateId)) {
                    const index = checked.indexOf(node.cateId);
                    checked.splice(index, 1);
                }
            }
        }
    };

    // Render tree checkbox
    const renderTree = (nodes, level = 0) => {
        return nodes.map(c => {
            const isChecked = checkedIds.includes(c.cateId);
            const isParent = c.children.length > 0;

            return (
                <div key={c.cateId} style={{ marginLeft: level * 20 }}>
                    <label style={{ fontWeight: isParent ? "bold" : "normal" }}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isParent}   // ❌ Không cho tick cha
                            onChange={e => toggleCheck(c, e.target.checked)}
                        />
                        {" "}{c.cateName}
                    </label>

                    {c.children.length > 0 && (
                        <div>
                            {renderTree(c.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    const save = async () => {
        await api.put("/api/admin/brand-categories", {
            brandId,
            cateIds: checkedIds.filter(id => {
                // Chỉ lưu category lá (không lưu cha)
                const isParent = findNodeById(categories, id)?.children.length > 0;
                return !isParent;
            })
        });

        alert("Đã lưu phân loại");
    };

    // Tìm node theo id
    const findNodeById = (nodes, id) => {
        for (let n of nodes) {
            if (n.cateId === id) return n;
            const found = findNodeById(n.children, id);
            if (found) return found;
        }
        return null;
    };

    return (
        <div className="p-4">
            <h3>Phân loại thương hiệu</h3>

            {/* Chọn thương hiệu */}
            <select
                className="form-control mb-3"
                value={brandId}
                onChange={e => setBrandId(Number(e.target.value))}
            >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map(b => (
                    <option key={b.brandId} value={b.brandId}>
                        {b.brandName}
                    </option>
                ))}
            </select>

            {brandId && (
                <>
                    <div
                        className="border p-3 mb-3"
                        style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                        {renderTree(categories)}
                    </div>

                    <button className="btn btn-primary" onClick={save}>
                        Lưu phân loại
                    </button>
                </>
            )}
        </div>
    );
}

export default BrandCategoryManager;
