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
    const [cateId, setCateId] = useState("");

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

        setBrandId("");
        setCateParents([]);
        setCateChildren([]);
        setParentCateId("");
        setCateId("");
        setSpecs([]);
        setSpecValues({});
    }, [parentBrandId]);

    /* ===================== BRAND CON → CATEGORY TREE ===================== */
    useEffect(() => {
        if (!brandId) return;

        axios
            .get(`/api/categories/tree/by-brand/${brandId}`)
            .then(res => {
                setCateParents(res.data);
                setParentCateId("");
                setCateChildren([]);
                setCateId("");
                setSpecs([]);
                setSpecValues({});
            })
            .catch(err => console.error(err));
    }, [brandId]);

    /* ===================== CATEGORY CHA → CATEGORY CON ===================== */
    useEffect(() => {
        const parent = cateParents.find(c => c.cateId === Number(parentCateId));
        setCateChildren(parent ? parent.subCategories : []);

        setCateId("");
        setSpecs([]);
        setSpecValues({});
    }, [parentCateId]);

    /* ===================== CATEGORY CON → SPEC ===================== */
    useEffect(() => {
        if (!cateId) return;

        axios
            .get(`/api/specifications/by-category/${cateId}`)
            .then(res => {
                setSpecs(res.data);
                setSpecValues({});
            })
            .catch(err => console.error(err));
    }, [cateId]);

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

        if (!brandId || !cateId) {
            setErrorMsg("Vui lòng chọn đầy đủ hãng và danh mục");
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
            cateIds: [Number(cateId)],
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
                <input type="file" multiple accept="image/*"
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
                            <button type="button"
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
                                }}>
                                ×
                            </button>
                        </div>
                    ))}
                </div>

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

                {/* CATEGORY */}
                <select className="form-control mb-2" disabled={!brandId}
                    value={parentCateId} onChange={e => setParentCateId(e.target.value)}>
                    <option value="">-- Danh mục chính --</option>
                    {cateParents.map(c => (
                        <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                    ))}
                </select>

                <select className="form-control mb-3" disabled={!parentCateId}
                    value={cateId} onChange={e => setCateId(e.target.value)}>
                    <option value="">-- Danh mục con --</option>
                    {cateChildren.map(c => (
                        <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                    ))}
                </select>

                {specs.length > 0 && (
                    <div className="border rounded p-3 mb-3">
                        <h6 className="fw-bold">Thông số kỹ thuật</h6>
                        {specs.map(s => (
                            <input key={s.specId}
                                className="form-control mb-2"
                                placeholder={s.specName}
                                value={specValues[s.specId] || ""}
                                onChange={e => handleSpecChange(s.specId, e.target.value)}
                            />
                        ))}
                    </div>
                )}

                <button className="btn btn-warning fw-bold">Đăng tin</button>
            </form>
        </div>
    );
}

export default CreatePost;
