import { useState, useEffect } from "react";
import axios, { API_BASE_URL } from "../api.js"; // axios có interceptor JWT
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();

    // ===== STATE =====
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [images, setImages] = useState([]);
    const [specValues, setSpecValues] = useState({});

    const [brandId, setBrandId] = useState("");
    const [cateId, setCateId] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        status: "",
    });

    // ===== LOAD CATEGORY =====
    useEffect(() => {
        axios.get("/api/categories")
            .then(res => setCategories(res.data));
    }, []);
    // ===== LOAD BRAND =====
    useEffect(() => {
        axios.get("/api/brands")
            .then(res => setBrands(res.data));
    }, []);
    useEffect(() => {
        if (brandId) {
            axios.get(`/api/categories/by-brand/${brandId}`)
                .then(res => {
                    setCategories(res.data);
                    setCateId("");
                    setSpecs([]);
                    setSpecValues({});
                });
        }
    }, [brandId]);
    useEffect(() => {
        if (!brandId) {
            setCategories([]);
            setCateId("");
            return;
        }

        axios.get(`/api/categories/by-brand/${brandId}`)
            .then(res => {
                setCategories(res.data);
                setCateId(""); // reset cate cũ
            });
    }, [brandId]);

    // ===== LOAD BRAND THEO CATEGORY =====
    useEffect(() => {
        if (cateId) {
            axios.get(`/api/brands/by-category/${cateId}`)
                .then(res => setBrands(res.data));
        } else {
            setBrands([]);
        }
    }, [cateId]);
    useEffect(() => {
        if (cateId) {
            axios.get(`/api/specifications/by-category/${cateId}`)
                .then(res => setSpecs(res.data));
        }
    }, [cateId]);

    // ===== HANDLE =====
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!brandId || !cateId) {
            alert("Vui lòng chọn hãng và danh mục");
            return;
        }

        await axios.post("/api/posts", {
            title: form.title,
            description: form.description,
            price: Number(form.price),
            address: form.address,
            status: form.status,
            brandId: Number(brandId),
            cateIds: [Number(cateId)],
            specifications: specValues,
            images: images
        });

        alert("Đăng tin thành công, chờ duyệt");
        navigate("/");
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
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setImages(prev => [...prev, res.data.fileName]);

            } catch (err) {
                console.error(err);
                alert("Upload ảnh thất bại");
            }
        }

        e.target.value = null;
    };

    // ===== UI =====
    return (
        <div className="container mt-4">
            <h3>Đăng tin mới</h3>

            <form onSubmit={handleSubmit}>
                {/* ===== CHỌN ẢNH ===== */}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-control mb-2"
                    onChange={handleImageChange}
                />

                {/* PREVIEW ẢNH */}
                <div className="d-flex gap-2 flex-wrap mb-2">
                    {images.map((img, index) => (
                        <div key={index} style={{ position: "relative" }}>
                            <img
                                src={`${API_BASE_URL}/uploads/${img}`}
                                alt=""
                                width={100}
                                height={100}
                                style={{ objectFit: "cover", borderRadius: 6 }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setImages(images.filter((_, i) => i !== index))
                                }
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    cursor: "pointer"
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    name="title"
                    className="form-control mb-2"
                    placeholder="Tiêu đề"
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    className="form-control mb-2"
                    placeholder="Mô tả"
                    onChange={handleChange}
                />

                <input
                    name="price"
                    type="number"
                    className="form-control mb-2"
                    placeholder="Giá"
                    onChange={handleChange}
                />

                <input
                    name="address"
                    className="form-control mb-2"
                    placeholder="Địa chỉ"
                    onChange={handleChange}
                />

                {/* ===== TRẠNG THÁI THIẾT BỊ ===== */}
                <select
                    name="status"
                    className="form-control mb-2"
                    onChange={handleChange}
                >
                    <option value="">-- Tình trạng thiết bị --</option>
                    <option value="NEW">Mới 100%</option>
                    <option value="LIKE_NEW">Như mới</option>
                    <option value="GOOD">Còn tốt</option>
                    <option value="USED">Đã sử dụng</option>
                    <option value="BROKEN">Hư hỏng</option>
                </select>

                {/* BRAND */}
                <select
                    className="form-control mb-2"
                    value={brandId}
                    onChange={e => setBrandId(e.target.value)}
                >
                    <option value="">-- Chọn hãng --</option>
                    {brands.map(b => (
                        <option key={b.brandId} value={b.brandId}>
                            {b.brandName}
                        </option>
                    ))}
                </select>
                {/* CATEGORY */}
                <select
                    className="form-control mb-2"
                    value={cateId}
                    disabled={!brandId}   // 🔒 KHÓA KHI CHƯA CHỌN BRAND
                    onChange={e => setCateId(e.target.value)}
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                        <option key={c.cateId} value={c.cateId}>
                            {c.cateName}
                        </option>
                    ))}
                </select>

                <button className="btn btn-warning fw-bold">
                    Đăng tin
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
