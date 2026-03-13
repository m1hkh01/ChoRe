import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api";
import "@/assets/edit.css";
import {
    AlertCircle,
    FileText,
    Check,
    Upload,
    X,
    Eye
} from "lucide-react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();

    /* ===================== FORM STATE ===================== */
    const [form, setForm] = useState({
        title: "",
        description: "",
        priceType: "",
        price: "",
        minPrice: "",
        maxPrice: "",
        status: ""
    });

    /* ===================== IMAGE STATE ===================== */
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [originalImages, setOriginalImages] = useState([]); // Lưu danh sách gốc từ API

    /* ===================== UI STATE ===================== */
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    /* ===================== PREVIEW STATE ===================== */
    const [previewData, setPreviewData] = useState({
        title: "",
        description: "",
        priceType: "",
        price: "",
        minPrice: "",
        maxPrice: "",
        thumbnail: null
    });

    /* ===================== LOAD POST DATA ===================== */
    useEffect(() => {
        if (!postId) return;

        api.get(`/api/posts/${postId}`)
            .then(res => {
                const p = res.data;
                console.log("loaded post for edit", p);

                setForm({
                    title: p.title,
                    description: p.description || "",
                    priceType: p.priceType || "",
                    price: p.price || "",
                    minPrice: p.minPrice || "",
                    maxPrice: p.maxPrice || "",
                    status: p.status || ""
                });

                // Set existing images
                setExistingImages(p.images || []);
                setOriginalImages(p.images || []); // Lưu danh sách gốc

                // Set preview data
                setPreviewData({
                    title: p.title,
                    description: p.description || "",
                    priceType: p.priceType || "",
                    price: p.price || "",
                    minPrice: p.minPrice || "",
                    maxPrice: p.maxPrice || "",
                    thumbnail: p.images && p.images.length > 0 ? p.images[0] : null
                });
            })
            .catch(err => {
                console.error(err);
                alert("Không thể tải bài đăng");
                navigate("/profile");
            })
            .finally(() => setLoading(false));
    }, [postId, navigate]);

    /* ===================== UPDATE PREVIEW ===================== */
    useEffect(() => {
        let thumbnail = null;
        if (existingImages.length > 0) {
            thumbnail = existingImages[0];
        } else if (imagePreviews.length > 0) {
            thumbnail = imagePreviews[0]; // This is a blob URL
        }

        setPreviewData({
            title: form.title,
            description: form.description,
            priceType: form.priceType,
            price: form.price,
            minPrice: form.minPrice,
            maxPrice: form.maxPrice,
            thumbnail: thumbnail
        });
    }, [form, existingImages, imagePreviews]);

    /* ===================== FORM HANDLERS ===================== */
    const handleChange = e => {
        const { name, value } = e.target;
        if (name === "priceType") {
            setForm({
                ...form,
                priceType: value,
                price: "",
                minPrice: "",
                maxPrice: ""
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    /* ===================== IMAGE HANDLERS ===================== */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + imageFiles.length + existingImages.length > 5) {
            alert("Chỉ được chọn tối đa 5 ảnh");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));

        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        e.target.value = null;
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);

        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageUrl) => {
        setExistingImages(prev => prev.filter(img => img !== imageUrl));
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    /* ===================== VALIDATION ===================== */
    const stripHtml = html => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const renderPrice = () => {
        switch (previewData.priceType) {
            case "NEGOTIABLE":
                return <span className="text-green-600 font-semibold">Thương lượng</span>;
            case "FIXED":
                return (
                    <span className="text-red-600 font-semibold">
                        {previewData.price
                            ? previewData.price.toLocaleString("vi-VN") + " ₫"
                            : "Liên hệ"}
                    </span>
                );
            case "RANGE":
                return (
                    <span className="text-blue-600 font-semibold">
                        {previewData.minPrice?.toLocaleString("vi-VN")} -{" "}
                        {previewData.maxPrice?.toLocaleString("vi-VN")} ₫
                    </span>
                );
            default:
                return <span className="text-gray-600 font-semibold">Liên hệ</span>;
        }
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            setErrorMsg("Tiêu đề không được để trống");
            return false;
        }

        if (!form.priceType) {
            setErrorMsg("Vui lòng chọn kiểu giá");
            return false;
        }

        if (form.priceType === "FIXED") {
            if (!form.price || Number(form.price) <= 0) {
                setErrorMsg("Vui lòng nhập giá hợp lệ");
                return false;
            }
        }

        if (form.priceType === "RANGE") {
            if (!form.minPrice || !form.maxPrice) {
                setErrorMsg("Vui lòng nhập khoảng giá");
                return false;
            }
            if (Number(form.minPrice) <= 0 || Number(form.maxPrice) <= 0) {
                setErrorMsg("Giá phải lớn hơn 0");
                return false;
            }
            if (Number(form.minPrice) >= Number(form.maxPrice)) {
                setErrorMsg("Giá tối thiểu phải nhỏ hơn giá tối đa");
                return false;
            }
        }

        if (!form.description || !stripHtml(form.description).trim()) {
            setErrorMsg("Vui lòng nhập mô tả chi tiết");
            return false;
        }

        return true;
    };

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async e => {
        e.preventDefault();
        setErrorMsg("");

        if (!validateForm()) return;

        setUploading(true);

        try {
            // Upload new images if any
            let uploadedFileNames = [];
            if (imageFiles.length > 0) {
                for (let file of imageFiles) {
                    try {
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await api.post("/api/posts/upload-image", formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        uploadedFileNames.push(res.data.fileName);
                    } catch (uploadError) {
                        console.error("Failed to upload image:", file.name, uploadError);
                        setErrorMsg(`Không thể upload ảnh ${file.name}: ${uploadError.response?.data || uploadError.message}`);
                        return;
                    }
                }
            }

            // Combine existing and new images - đảm bảo thứ tự đúng
            // Giữ thứ tự: hình cũ còn lại + hình mới
            const allImages = [...existingImages, ...uploadedFileNames];

            console.log("Original images:", originalImages);
            console.log("Current existing images:", existingImages);
            console.log("New uploaded images:", uploadedFileNames);
            console.log("Final images to send:", allImages);

            // Update post
            await api.put(`/api/profile/${postId}`, {
                title: form.title,
                description: form.description,
                priceType: form.priceType,
                price: form.priceType === "FIXED" ? Number(form.price) : undefined,
                minPrice: form.priceType === "RANGE" ? Number(form.minPrice) : undefined,
                maxPrice: form.priceType === "RANGE" ? Number(form.maxPrice) : undefined,
                images: allImages // Add images to update
            });

            alert("Cập nhật tin đăng thành công");
            navigate("/profile");
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setUploading(false);
        }
    };

    /* ===================== CKEDITOR CONFIG ===================== */
    const editorConfiguration = {
        toolbar: {
            items: [
                'heading', '|',
                'fontSize', 'fontFamily', '|',
                'fontColor', 'fontBackgroundColor', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'alignment', '|',
                'bulletedList', 'numberedList', '|',
                'outdent', 'indent', '|',
                'link', 'blockQuote', 'insertTable', '|',
                'undo', 'redo'
            ],
            shouldNotGroupWhenFull: true
        },
        language: 'vi',
        placeholder: 'Mô tả tình trạng, nguồn gốc, lý do bán...'
    };

    if (loading) return <div className="text-center py-5">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Chỉnh sửa tin đăng</h1>
                    <p className="text-gray-600 text-sm">Sửa thông tin rồi gửi lại để chờ duyệt</p>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* FORM COLUMN */}
                    <div className="space-y-6 lg:col-span-2" style={{ margin: 15 }}>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* SECTION 1: IMAGES */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200" style={{ padding: 15, margin: 15 }}>
                                <div className="mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Hình ảnh sản phẩm</h2>
                                        <p className="text-sm text-gray-500">Tối đa 5 ảnh</p>
                                    </div>
                                </div>

                                <div className="image-grid">

                                    {/* Existing Images */}
                                    {existingImages.map((image, i) => (
                                        <div key={`existing-${i}`} className="image-box">

                                            <img
                                                src={`https://api.chore123.cloud/uploads/${image}`}
                                                className="image-existing"
                                                alt={`Existing ${i + 1}`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(image)}
                                                className="image-remove-btn"
                                            >
                                                <X size={14} />
                                            </button>

                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {imagePreviews.map((preview, i) => (
                                        <div key={`new-${i}`} className="image-box">

                                            <img
                                                src={preview}
                                                className="image-new"
                                                alt={`New ${i + 1}`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="image-remove-btn"
                                            >
                                                <X size={14} />
                                            </button>

                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {(existingImages.length + imageFiles.length) < 5 && (
                                        <label className="upload-box">

                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                hidden
                                            />

                                            <Upload className="upload-icon" size={24} />

                                            <span className="upload-text">
                                                Thêm ảnh
                                            </span>

                                        </label>
                                    )}

                                </div>
                            </div>

                            {/* SECTION 2: BASIC INFO */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200" style={{ padding: 15, margin: 15 }}>
                                <div className="mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h2>
                                        <p className="text-sm text-gray-500">Mô tả sản phẩm của bạn</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {/* Title */}
                                    <div style={{ paddingTop: 10 }}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tiêu đề <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="VD: iPhone 13 Pro Max 256GB"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div style={{ paddingTop: 10 }}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Mô tả chi tiết <span className="text-red-500">*</span>
                                        </label>
                                        <div className="border border-gray-300 rounded-lg overflow-visible focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent relative z-20">
                                            <div className="ck-editor-wrapper" style={{ maxHeight: '280px', overflow: 'auto' }}>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    config={editorConfiguration}
                                                    data={form.description}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setForm({ ...form, description: data });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Type */}
                                    <div style={{ paddingTop: 10 }}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kiểu giá <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="priceType"
                                            value={form.priceType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                            required
                                        >
                                            <option value="">-- chọn kiểu --</option>
                                            <option value="NEGOTIABLE">Thương lượng</option>
                                            <option value="FIXED">Giá cố định</option>
                                            <option value="RANGE">Khoảng giá</option>
                                        </select>
                                    </div>

                                    {/* Price Inputs */}
                                    {form.priceType === "FIXED" && (
                                        <div style={{ paddingTop: 10 }}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Giá (₫) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={form.price}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    )}

                                    {form.priceType === "RANGE" && (
                                        <div className="grid grid-cols-2 gap-4" style={{ paddingTop: 10 }}>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Giá tối thiểu (₫) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="minPrice"
                                                    value={form.minPrice}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Giá tối đa (₫) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="maxPrice"
                                                    value={form.maxPrice}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4" style={{ margin: 15 }}>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                                >
                                    {uploading ? "Đang cập nhật..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* PREVIEW COLUMN */}
                    <div className="space-y-4 lg:col-span-1" style={{ margin: 15 }}>
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 sticky top-6" style={{ padding: 15 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-800">Xem trước bài đăng</h2>
                                    <p className="text-xs text-gray-500">Bài đăng sẽ hiển thị như thế này trên trang chủ</p>
                                </div>
                            </div>

                            {/* Preview Card - Like PostCard */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                                {/* Image */}
                                <div className="relative bg-gray-100 aspect-[4/3] flex items-center justify-center">
                                    {previewData.thumbnail ? (
                                        previewData.thumbnail.startsWith('blob:') ? (
                                            <img
                                                src={previewData.thumbnail}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={`https://api.chore123.cloud/uploads/${previewData.thumbnail}`}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        )
                                    ) : (
                                        <Upload size={28} className="text-gray-400" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">
                                        {previewData.title || "Tiêu đề bài đăng"}
                                    </h3>

                                    <div className="mb-1 text-sm font-semibold">
                                        {renderPrice()}
                                    </div>

                                    {previewData.description && (
                                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                            {stripHtml(previewData.description)}
                                        </p>
                                    )}

                                    <div className="space-y-1 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <span className="truncate">Phường Tân Mỹ, TPHCM</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>userKhoi</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700">
                                    <strong>Lưu ý:</strong> Đây là bản xem trước. Bài đăng thực tế sẽ hiển thị đầy đủ thông tin sau khi được duyệt.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPost;
