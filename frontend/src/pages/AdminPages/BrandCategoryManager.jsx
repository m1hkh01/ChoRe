import { useEffect, useState } from "react";
import api from "@/api";

function BrandCategoryManager() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandId, setBrandId] = useState("");
    const [checkedIds, setCheckedIds] = useState([]);

    useEffect(() => {
        api.get("/api/admin/brands").then(res => setBrands(res.data));
        api.get("/api/admin/categories/tree").then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (!brandId) return;
        api.get(`/api/admin/brand-categories/${brandId}`)
            .then(res => setCheckedIds(res.data));
    }, [brandId]);

    // ================= LẤY TẤT CẢ ID CON =================
    const getAllChildIds = (node) => {
        let ids = [];
        for (let c of node.children) {
            ids.push(c.cateId);
            ids.push(...getAllChildIds(c));
        }
        return ids;
    };

    // ================= TÌM TẤT CẢ PARENT IDS =================
    const findAllParents = (targetId, nodes, ancestors = []) => {
        for (let node of nodes) {
            if (node.cateId === targetId) {
                return ancestors;
            }
            if (node.children && node.children.length > 0) {
                const found = findAllParents(targetId, node.children, [...ancestors, node.cateId]);
                if (found) return found;
            }
        }
        return null;
    };

    // ================= TOGGLE CHECK =================
    const toggleCheck = (node, checked) => {
        let newChecked = [...checkedIds];
        const childIds = getAllChildIds(node);

        if (checked) {
            // Tick node + toàn bộ con
            newChecked.push(node.cateId, ...childIds);
            
            // Tự động tick tất cả parent
            const parents = findAllParents(node.cateId, categories);
            if (parents) {
                newChecked.push(...parents);
            }
        } else {
            // Bỏ tick node + toàn bộ con
            newChecked = newChecked.filter(
                id => id !== node.cateId && !childIds.includes(id)
            );
        }

        // Loại trùng
        newChecked = [...new Set(newChecked)];
        setCheckedIds(newChecked);
    };

    // ================= RENDER TREE =================
    const renderTree = (nodes, level = 0) => {
        return nodes.map(c => {
            const isChecked = checkedIds.includes(c.cateId);
            const hasChildren = c.children && c.children.length > 0;

            return (
                <div key={c.cateId} style={{ marginLeft: level * 20 }}>
                    <label style={{ fontWeight: hasChildren ? "bold" : "normal" }}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => toggleCheck(c, e.target.checked)}
                        />
                        {" "}{c.cateName}
                        {hasChildren && isChecked && " (đã chọn)"}
                    </label>

                    {hasChildren && (
                        <div>
                            {renderTree(c.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    // ================= SAVE =================
    const save = async () => {
        // Chỉ gửi category con (lá), backend sẽ tự động thêm cha
        const leafIds = checkedIds.filter(id => {
            const node = findNodeById(categories, id);
            return node && (!node.children || node.children.length === 0);
        });

        await api.put("/api/admin/brand-categories", {
            brandId: Number(brandId),
            cateIds: leafIds
        });

        alert("Đã lưu phân loại");
    };

    // ================= TÌM NODE THEO ID =================
    const findNodeById = (nodes, id) => {
        for (let n of nodes) {
            if (n.cateId === id) return n;
            if (n.children) {
                const found = findNodeById(n.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <div className="p-4">
            <h3>Phân loại thương hiệu</h3>

            <select
                className="form-control mb-3"
                value={brandId}
                onChange={e => setBrandId(e.target.value)}
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