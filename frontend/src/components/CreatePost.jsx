import { useEffect, useState } from "react";
import axios, { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();

    /* ===================== BRAND ===================== */
    const [brandParents, setBrandParents] = useState([]);
    const [brandChildren, setBrandChildren] = useState([]);
    const [parentBrandId, setParentBrandId] = useState("");
    const [brandId, setBrandId] = useState("");

    /* ===================== CATEGORY ===================== */
    const [cateParents, setCateParents] = useState([]);
    const [cateChildren, setCateChildren] = useState([]);
    const [parentCateId, setParentCateId] = useState("");
    const [cateIds, setCateIds] = useState([]); // nhiều danh mục con

    /* ===================== SPEC ===================== */
    const [specs, setSpecs] = useState([]);
    const [specValues, setSpecValues] = useState({});

    /* ===================== IMAGES ===================== */
    const [images, setImages] = useState([]);

    /* ===================== FORM ===================== */
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        status: "",
    });

    const [errorMsg, setErrorMsg] = useState("");

    /* ===================== LOAD BRAND TREE ===================== */
    useEffect(() => {
        axios.get("/api/brands/tree")
            .then(res => setBrandParents(res.data))
            .catch(err => console.error(err));
    }, []);

    /* ===================== BRAND CHA → BRAND CON ===================== */
    useEffect(() => {
        const parent = brandParents.find(b => b.brandId === Number(parentBrandId));
        setBrandChildren(parent ? parent.subBrands : []);

        // reset toàn bộ phía dưới
        setBrandId("");
        setCateParents([]);
        setCateChildren([]);
        setParentCateId("");
        setCateIds([]);
        setSpecs([]);
        setSpecValues({});
    }, [parentBrandId]);

    /* ===================== BRAND CON → CATEGORY TREE ===================== */
    useEffect(() => {
        if (!brandId) return;

        axios.get(`/api/categories/tree/by-brand/${brandId}`)
            .then(res => {
                setCateParents(res.data);
                setParentCateId("");
                setCateChildren([]);
                setCateIds([]);
                setSpecs([]);
                setSpecValues({});
            })
            .catch(err => console.error(err));
    }, [brandId]);

    /* ===================== CATEGORY CHA → CATEGORY CON ===================== */
    useEffect(() => {
        const parent = cateParents.find(c => c.cateId === Number(parentCateId));
        setCateChildren(parent ? parent.subCategories : []);

        setCateIds([]);
        setSpecs([]);
        setSpecValues({});
    }, [parentCateId]);

    /* ===================== LOAD SPEC THEO NHIỀU CATEGORY ===================== */
    useEffect(() => {
        if (cateIds.length === 0) {
            setSpecs([]);
            setSpecValues({});
            return;
        }

        Promise.all(
            cateIds.map(id =>
                axios.get(`/api/specifications/by-category/${id}`)
            )
        ).then(results => {
            const merged = results.flatMap(r => r.data);

            // loại trùng specId
            const unique = Array.from(
                new Map(merged.map(s => [s.specId, s])).values()
            );

            setSpecs(unique);
            setSpecValues({});
        }).catch(err => console.error(err));
    }, [cateIds]);

    /* ===================== HANDLERS ===================== */
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (specId, value) => {
        setSpecValues(prev => ({ ...prev, [specId]: value }));
    };

    const handleImageChange = async e => {
        const files = Array.from(e.target.files);

        if (files.length + images.length > 5) {
            alert("Chỉ được chọn tối đa 5 ảnh");
            return;
        }

        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "/api/posts/upload-image",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setImages(prev => [...prev, res.data.fileName]);
        }

        e.target.value = null;
    };

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async e => {
        e.preventDefault();
        setErrorMsg("");

        if (!brandId || cateIds.length === 0) {
            setErrorMsg("Vui lòng chọn ít nhất 1 danh mục con");
            return;
        }

        for (let spec of specs) {
            if (!specValues[spec.specId]?.trim()) {
                setErrorMsg(`Vui lòng nhập ${spec.specName}`);
                return;
            }
        }

        await axios.post("/api/posts", {
            ...form,
            price: Number(form.price),
            brandId: Number(brandId),
            cateIds: cateIds.map(id => Number(id)),
            specifications: specValues,
            images
        });

        alert("Đăng tin thành công, chờ duyệt");
        navigate("/");
    };

    /* ===================== UI ===================== */
    return (
        <div className="container mt-4">
            <h3>Đăng tin mới</h3>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>

                {/* UPLOAD ẢNH */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={handleImageChange}
                />

                <div className="d-flex gap-2 flex-wrap mb-3">
                    {images.map((img, i) => (
                        <div key={i} style={{ position: "relative" }}>
                            <img
                                src={`${API_BASE_URL}/uploads/${img}`}
                                width={100}
                                height={100}
                                style={{ objectFit: "cover", borderRadius: 6 }}
                            />
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    background: "red",
                                    color: "white",
                                    border: "none"
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* THÔNG TIN CƠ BẢN */}
                <input name="title" className="form-control mb-2" placeholder="Tiêu đề" onChange={handleChange} />
                <textarea name="description" className="form-control mb-2" placeholder="Mô tả" onChange={handleChange} />
                <input name="price" type="number" className="form-control mb-2" placeholder="Giá" onChange={handleChange} />
                <input name="address" className="form-control mb-2" placeholder="Địa chỉ" onChange={handleChange} />

                <select name="status" className="form-control mb-2" onChange={handleChange}>
                    <option value="">-- Tình trạng --</option>
                    <option value="NEW">Mới</option>
                    <option value="LIKE_NEW">Như mới</option>
                    <option value="USED">Đã sử dụng</option>
                    <option value="BROKEN">Hư hỏng</option>
                </select>

                {/* BRAND */}
                <select className="form-control mb-2" value={parentBrandId}
                    onChange={e => setParentBrandId(e.target.value)}>
                    <option value="">-- Hãng chính --</option>
                    {brandParents.map(b => (
                        <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                    ))}
                </select>

                <select className="form-control mb-2" disabled={!parentBrandId}
                    value={brandId} onChange={e => setBrandId(e.target.value)}>
                    <option value="">-- Dòng sản phẩm --</option>
                    {brandChildren.map(b => (
                        <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                    ))}
                </select>

                {/* CATEGORY CHA */}
                <select className="form-control mb-2" disabled={!brandId}
                    value={parentCateId} onChange={e => setParentCateId(e.target.value)}>
                    <option value="">-- Danh mục chính --</option>
                    {cateParents.map(c => (
                        <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                    ))}
                </select>

                {/* CATEGORY CON - CHECKBOX */}
                {parentCateId && cateChildren.length > 0 && (
                    <div className="border rounded p-3 mb-3">
                        <h6 className="fw-bold mb-2">Chọn danh mục con</h6>

                        {cateChildren.map(c => (
                            <div key={c.cateId} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={cateIds.includes(String(c.cateId))}
                                    onChange={e => {
                                        const id = String(c.cateId);

                                        if (e.target.checked) {
                                            setCateIds(prev => [...prev, id]);
                                        } else {
                                            setCateIds(prev => prev.filter(x => x !== id));
                                        }
                                    }}
                                />
                                <label className="form-check-label">
                                    {c.cateName}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* HIỂN THỊ DANH MỤC ĐÃ CHỌN */}
                {cateIds.length > 0 && (
                    <div className="mb-3">
                        <strong>Danh mục đã chọn:</strong>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {cateIds.map(id => {
                                const cate = cateChildren.find(c => String(c.cateId) === id);
                                return (
                                    <span key={id}
                                        className="badge bg-primary d-flex align-items-center gap-2"
                                        style={{ padding: "8px 12px", borderRadius: 20 }}
                                    >
                                        {cate?.cateName}
                                        <button
                                            type="button"
                                            onClick={() => setCateIds(cateIds.filter(x => x !== id))}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SPEC */}
                {specs.length > 0 && (
                    <div className="border rounded p-3 mb-3">
                        <h6 className="fw-bold">Thông số kỹ thuật</h6>
                        {specs.map(s => (
                            <div key={s.specId} className="mb-2">
                                <input
                                    className={`form-control ${!specValues[s.specId] ? "border-danger" : ""}`}
                                    placeholder={s.specName + " *"}
                                    value={specValues[s.specId] || ""}
                                    onChange={e => handleSpecChange(s.specId, e.target.value)}
                                />
                                {!specValues[s.specId] && (
                                    <small className="text-danger">Bắt buộc nhập</small>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn btn-warning fw-bold">Đăng tin</button>
            </form>
        </div>
    );
}

export default CreatePost;
