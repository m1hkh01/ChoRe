import { useState, useEffect } from "react";
import axios, { API_BASE_URL } from "../api.js";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();

    /* ===================== STATE ===================== */
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [specValues, setSpecValues] = useState({});
    const [images, setImages] = useState([]);

    const [brandId, setBrandId] = useState("");
    const [cateId, setCateId] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        status: "",
    });

    const [errorMsg, setErrorMsg] = useState("");

    /* ===================== LOAD INIT ===================== */
    useEffect(() => {
        axios.get("/api/brands").then(res => setBrands(res.data));
        axios.get("/api/categories").then(res => setCategories(res.data));
    }, []);

    /* ===================== BRAND → CATEGORY ===================== */
    useEffect(() => {
        if (!brandId) {
            setCategories([]);
            setCateId("");
            setSpecs([]);
            setSpecValues({});
            return;
        }

        axios
            .get(`/api/categories/by-brand/${brandId}`)
            .then(res => {
                setCategories(res.data);
                setCateId("");
                setSpecs([]);
                setSpecValues({});
            });
    }, [brandId]);

    /* ===================== CATEGORY → SPEC ===================== */
    useEffect(() => {
        if (!cateId) {
            setSpecs([]);
            setSpecValues({});
            return;
        }

        axios
            .get(`/api/specifications/by-category/${cateId}`)
            .then(res => {
                setSpecs(res.data);
                setSpecValues({});
            });
    }, [cateId]);

    /* ===================== HANDLERS ===================== */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (specId, value) => {
        setSpecValues(prev => ({
            ...prev,
            [specId]: value
        }));
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length + images.length > 5) {
            alert("Chỉ được chọn tối đa 5 ảnh");
            return;
        }

        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await axios.post(
                    "/api/posts/upload-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                setImages(prev => [...prev, res.data.fileName]);
            } catch {
                alert("Upload ảnh thất bại");
            }
        }

        e.target.value = null;
    };

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!brandId || !cateId) {
            setErrorMsg("Vui lòng chọn hãng và danh mục");
            return;
        }

        // ✅ VALIDATE SPEC
        for (let spec of specs) {
            const value = specValues[spec.specId];

            if (!value || value.trim() === "") {
                setErrorMsg(`Vui lòng nhập ${spec.specName}`);
                return;
            }

            if (value.length > 25) {
                setErrorMsg(`${spec.specName} không được vượt quá 25 ký tự`);
                return;
            }
        }

        try {
            await axios.post("/api/posts", {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                address: form.address,
                status: form.status,
                brandId: Number(brandId),
                cateIds: [Number(cateId)],
                specifications: specValues,
                images
            });

            alert("Đăng tin thành công, chờ duyệt");
            navigate("/");
        } catch (err) {
            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === "string") {
                    setErrorMsg(data);
                    return;
                }

                if (data.error) {
                    setErrorMsg(data.error);
                    return;
                }

                if (data.errors) {
                    setErrorMsg(
                        Object.values(data.errors).flat().join(", ")
                    );
                    return;
                }
            }

            setErrorMsg("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    /* ===================== UI ===================== */
    return (
        <div className="container mt-4">
            <h3>Đăng tin mới</h3>

            {errorMsg && (
                <div className="alert alert-danger">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* ===== IMAGES ===== */}
                <input
                    type="file"
                    accept="image/*"
                    multiple
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
                                onClick={() =>
                                    setImages(images.filter((_, idx) => idx !== i))
                                }
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    background: "red",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    border: "none"
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* ===== BASIC INFO ===== */}
                <input name="title" className="form-control mb-2" placeholder="Tiêu đề" onChange={handleChange} />
                <textarea name="description" className="form-control mb-2" placeholder="Mô tả" onChange={handleChange} />
                <input name="price" type="number" className="form-control mb-2" placeholder="Giá" onChange={handleChange} />
                <input name="address" className="form-control mb-2" placeholder="Địa chỉ" onChange={handleChange} />

                <select name="status" className="form-control mb-2" onChange={handleChange}>
                    <option value="">-- Tình trạng thiết bị --</option>
                    <option value="NEW">Mới 100%</option>
                    <option value="LIKE_NEW">Như mới</option>
                    <option value="GOOD">Còn tốt</option>
                    <option value="USED">Đã sử dụng</option>
                    <option value="BROKEN">Hư hỏng</option>
                </select>

                {/* ===== BRAND / CATEGORY ===== */}
                <select className="form-control mb-2" value={brandId} onChange={e => setBrandId(e.target.value)}>
                    <option value="">-- Chọn hãng --</option>
                    {brands.map(b => (
                        <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                    ))}
                </select>

                <select className="form-control mb-3" value={cateId} disabled={!brandId} onChange={e => setCateId(e.target.value)}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                        <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                    ))}
                </select>

                {/* ===== SPEC ===== */}
                {specs.length > 0 && (
                    <div className="border rounded p-3 mb-3">
                        <h6 className="fw-bold mb-2">Thông số kỹ thuật</h6>

                        {specs.map(spec => (
                            <div key={spec.specId} className="mb-2">
                                <label className="form-label">
                                    {spec.specName} <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={25}
                                    className="form-control"
                                    value={specValues[spec.specId] || ""}
                                    onChange={e => handleSpecChange(spec.specId, e.target.value)}
                                />
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
