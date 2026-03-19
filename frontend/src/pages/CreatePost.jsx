import { useEffect, useState } from "react";
import axios, { API_BASE_URL } from "@/api";
import { useNavigate } from "react-router-dom";
import provinces from "@/data/sauSapNhap/province.json";
import wards from "@/data/sauSapNhap/ward.json";
import {
    Upload,
    X,
    MapPin,
    Tag,
    FileText,
    DollarSign,
    Package,
    ChevronRight,
    AlertCircle,
    Check
} from "lucide-react";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from "../api";
import { useAuthStore } from "../store/auth";
import { Toast } from "../utils/toast";
import Swal from "sweetalert2";

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
    const [cateIds, setCateIds] = useState([]);

    /* ===================== SPEC ===================== */
    const [specs, setSpecs] = useState([]);
    const [specValues, setSpecValues] = useState({});

    /* ===================== IMAGES ===================== */
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    /* ===================== ADDRESS ===================== */
    const [provinceCode, setProvinceCode] = useState("");
    const [wardCode, setWardCode] = useState("");

    const { user } = useAuthStore();

    const filteredWards = Object.values(wards).filter(
        w => w.parent_code === provinceCode
    );

    /* ===================== FORM ===================== */
    const [form, setForm] = useState({
        title: "",
        description: "",
        priceType: "", // ✅ THÊM MỚI
        price: "",
        minPrice: "", // ✅ THÊM MỚI
        maxPrice: "", // ✅ THÊM MỚI
        status: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [uploading, setUploading] = useState(false);

    /* ===================== LOAD BRAND TREE ===================== */
    useEffect(() => {
        axios.get("/api/brands/tree")
            .then(res => setBrandParents(res.data))
            .catch(console.error);
    }, []);

    /* ===================== BRAND CHA → CON ===================== */
    useEffect(() => {
        const parent = brandParents.find(b => b.brandId === Number(parentBrandId));
        setBrandChildren(parent ? parent.subBrands : []);
        setBrandId("");
    }, [parentBrandId, brandParents]);

    /* ===================== BRAND → CATEGORY ===================== */
    useEffect(() => {
        if (!parentBrandId) return;

        const activeBrandId = brandId || parentBrandId;

        axios.get(`/api/categories/tree/by-brand/${activeBrandId}`)
            .then(res => {
                setCateParents(res.data);
                setParentCateId("");
                setCateChildren([]);
                setCateIds([]);
                setSpecs([]);
                setSpecValues({});
            })
            .catch(console.error);
    }, [brandId, parentBrandId]);

    /* ===================== CATEGORY CHA → CON ===================== */
    useEffect(() => {
        const parent = cateParents.find(c => c.cateId === Number(parentCateId));
        setCateChildren(parent ? parent.subCategories : []);

        setCateIds([]);
        setSpecs([]);
        setSpecValues({});
    }, [parentCateId]);

    /* ===================== LOAD SPEC THEO CATEGORY CHA ===================== */
    useEffect(() => {
        if (!parentCateId) {
            setSpecs([]);
            setSpecValues({});
            return;
        }

        axios.get(`/api/specifications/by-category/${parentCateId}`)
            .then(res => {
                setSpecs(res.data);
                setSpecValues({});
            })
            .catch(console.error);
    }, [parentCateId]);

    /* ===================== HANDLERS ===================== */
    const handleChange = e => {
        const { name, value } = e.target;
        
        // ✅ Reset giá khi đổi kiểu giá
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

    const handleSpecChange = (specId, value) => {
        setSpecValues(prev => ({ ...prev, [specId]: value }));
    };

    /* ===================== IMAGE HANDLERS ===================== */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + imageFiles.length > 5) {
            alert("Chỉ được chọn tối đa 5 ảnh");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));

        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        e.target.value = null;
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);

        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async e => {
        e.preventDefault();
        setErrorMsg("");

        if (!provinceCode || !wardCode) {
            setErrorMsg("Vui lòng chọn đầy đủ địa chỉ");
            return;
        }

        const finalBrandId = brandId || (brandChildren.length === 0 ? parentBrandId : "");

        if (!finalBrandId || cateIds.length === 0) {
            setErrorMsg("Vui lòng chọn hãng và ít nhất 1 danh mục con");
            return;
        }

        // ✅ VALIDATE KIỂU GIÁ
        if (!form.priceType) {
            setErrorMsg("Vui lòng chọn kiểu giá");
            return;
        }

        if (form.priceType === "FIXED") {
            if (!form.price || Number(form.price) <= 0) {
                setErrorMsg("Vui lòng nhập giá hợp lệ");
                return;
            }
        }

        if (form.priceType === "RANGE") {
            if (!form.minPrice || !form.maxPrice) {
                setErrorMsg("Vui lòng nhập khoảng giá");
                return;
            }
            if (Number(form.minPrice) <= 0 || Number(form.maxPrice) <= 0) {
                setErrorMsg("Giá phải lớn hơn 0");
                return;
            }
            if (Number(form.minPrice) >= Number(form.maxPrice)) {
                setErrorMsg("Giá tối thiểu phải nhỏ hơn giá tối đa");
                return;
            }
        }

        for (let spec of specs) {
            if (!specValues[spec.specId]?.trim()) {
                setErrorMsg(`Vui lòng nhập ${spec.specName}`);
                return;
            }
        }

        if (imageFiles.length === 0) {
            setErrorMsg("Vui lòng thêm ít nhất 1 ảnh");
            return;
        }

        const stripHtml = (html) => {
            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        };

        if (!form.description || !stripHtml(form.description).trim()) {
            setErrorMsg("Vui lòng nhập mô tả chi tiết");
            return;
        }

        setUploading(true);

        try {
            const uploadedFileNames = [];

            for (let file of imageFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await axios.post(
                    "/api/posts/upload-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                uploadedFileNames.push(res.data.fileName);
            }

            const provinceName = provinces[provinceCode]?.name_with_type;
            const wardName = wards[wardCode]?.name_with_type;
            const fullAddress = `${wardName}, ${provinceName}`;

            // ✅ GỬI DỮ LIỆU THEO KIỂU GIÁ
            const postData = {
                title: form.title,
                description: form.description,
                status: form.status,
                address: fullAddress,
                priceType: form.priceType,
                brandId: Number(finalBrandId),
                cateIds: cateIds.map(Number),
                specifications: specValues,
                images: uploadedFileNames
            };

            // Thêm giá tùy theo kiểu
            if (form.priceType === "FIXED") {
                postData.price = Number(form.price);
            } else if (form.priceType === "RANGE") {
                postData.minPrice = Number(form.minPrice);
                postData.maxPrice = Number(form.maxPrice);
            }

            await axios.post("/api/posts", postData);

            alert("Đăng tin thành công, chờ duyệt");
            navigate("/");
        } catch (error) {
            setErrorMsg(error.response?.data || "Có lỗi xảy ra, vui lòng thử lại");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    /* ===================== CHECK FREE POST && SUB POST ===================== */
    const hanldeCheck = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get(`/api/posts/check-free-post/${user.userId}`);
            if (res.data) {
                const { freePost, subPost } = res.data;
                console.log("Free Post: ", freePost);
                console.log("Sub Post: ", subPost);
                if (subPost == 0) {
                    Toast.fire({
                        icon: "error",
                        title:"Bạn đã hết lượt đăng tin trong tháng"
                    })
                    return;
                }
                if (freePost == 0) {
                    Swal.fire({
                        title: "Bạn đã hết lượt đăng tin miễn phí ! Bạn có muốn mua thêm lượt đăng tin ?",
                        text: `Lưu ý : Bạn sẽ phải thanh toán sau khi bài đăng được duyệt để hiển thị bài đăng của mình
                                            Giá 10.000đ 1 lượt đăng tin`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Mua",
                        cancelButtonText: "Huỷ",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton:
                                "bg-green-600 text-white text-md me-2 px-4 py-2 rounded mr-2 hover:bg-green-700",
                            cancelButton:
                                "bg-red-500 text-white text-md px-4 py-2 rounded hover:bg-red-700",
                        },
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            handleSubmit(e);
                        }
                        else {
                            return;
                        }
                    });
                }
                if (freePost > 0) {
                    handleSubmit(e);
                }
            }
        }
        catch (e) {
            
            console.log("Đã có lỗi xảy ra khi kiểm tra lượt đăng tin: ", e);
        }
    }

    /* ===================== PROGRESS STEPS ===================== */
    const steps = [
        { id: 1, name: "Hình ảnh" },
        { id: 2, name: "Thông tin" },
        { id: 3, name: "Phân loại" },
        { id: 4, name: "Hoàn thành" }
    ];

    const isStepComplete = (step) => {
        switch (step) {
            case 1: return imageFiles.length > 0;
            case 2: return form.title && form.description && form.priceType && form.status;
            case 3: return brandId && cateIds.length > 0;
            case 4: return specs.every(s => specValues[s.specId]?.trim());
            default: return false;
        }
    };

    /* ===================== CKEDITOR CONFIG ===================== */
    const editorConfiguration = {
        toolbar: {
            items: [
                'heading', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'bulletedList', 'numberedList', '|',
                'outdent', 'indent', '|',
                'link', '|',
                'blockQuote', 'insertTable', '|',
                'undo', 'redo'
            ]
        },
        language: 'vi',
        placeholder: 'Mô tả tình trạng, nguồn gốc, lý do bán...',
    };

    /* ===================== UI ===================== */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" style={{ paddingTop: 30, paddingBottom: 100}}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Đăng tin mới</h1>
                    <p className="text-slate-600">Điền thông tin để đăng tin bán sản phẩm của bạn</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8" style={{ marginBottom: "20px", position: "relative", left: 20}} >
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1" >
                                <div className="flex flex-col items-left flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${isStepComplete(step.id)
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.id
                                            ? 'bg-gray-400 text-slate-800'
                                            : 'bg-slate-200 text-slate-400'
                                        }`}>
                                        {isStepComplete(step.id) ? <Check size={20} /> : step.id}
                                    </div>
                                    <span className={`text-sm mt-2 font-medium ${currentStep === step.id ? 'text-slate-800' : 'text-slate-500'
                                        }`}>
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-2 ${isStepComplete(step.id) ? 'bg-green-500' : 'bg-slate-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={hanldeCheck} className="space-y-6">

                    {/* SECTION 1: IMAGES */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200" style={{ padding: 15, margin: 15 }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center" style={{ marginBottom: 30 }}>
                                <Upload className="text-yellow-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Hình ảnh sản phẩm</h2>
                                <p className="text-sm text-slate-500">Tối đa 5 ảnh</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {imagePreviews.map((preview, i) => (
                                <div key={i} className="relative aspect-square">
                                    <img
                                        src={preview}
                                        className="w-33 h-33 object-contain rounded-lg border-2 border-slate-200"
                                        alt={`Preview ${i + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        style={{ borderRadius: '100%' }}
                                        className="absolute -top-2 -right-2 w-7 h-7  bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}

                            {imageFiles.length < 5 && (
                                <label style={{ marginLeft: 15 }} className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="text-slate-400 mt-1mb-1 ml-2" style={{ marginTop: 40 }} size={24} />
                                        <span className="text-xs text-slate-500 text-center" style={{ marginTop: 10 }}>
                                            Thêm ảnh
                                        </span>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: BASIC INFO */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200" style={{ padding: 15, margin: 15 }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center" style={{ marginBottom: 30 }}>
                                <FileText className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Thông tin cơ bản</h2>
                                <p className="text-sm text-slate-500">Mô tả sản phẩm của bạn</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                    placeholder="VD: iPhone 13 Pro Max 256GB"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div style={{ paddingTop: 10 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Mô tả chi tiết <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent">
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

                            {/* ✅ KIỂU GIÁ */}
                            <div style={{ paddingTop: 10 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Kiểu giá <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        name="priceType"
                                        value={form.priceType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Chọn kiểu giá</option>
                                        <option value="NEGOTIABLE">Thương lượng</option>
                                        <option value="FIXED">Giá cố định</option>
                                        <option value="RANGE">Khoảng giá</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* ✅ GIÁ CỐ ĐỊNH */}
                            {form.priceType === "FIXED" && (
                                <div style={{ paddingTop: 10 }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Giá bán (VNĐ) <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <input
                                        name="price"
                                        type="number"
                                        value={form.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                        placeholder="15000000"
                                        required
                                    />
                                </div>
                            )}

                            {/* ✅ KHOẢNG GIÁ */}
                            {form.priceType === "RANGE" && (
                                <div className="grid grid-cols-2 gap-4" style={{ paddingTop: 10 }}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <label className="text-sm font-medium text-slate-700">
                                                Giá từ (VNĐ) <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <input
                                            name="minPrice"
                                            type="number"
                                            value={form.minPrice}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                            placeholder="10000000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <label className="text-sm font-medium text-slate-700">
                                                Giá đến (VNĐ) <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <input
                                            name="maxPrice"
                                            type="number"
                                            value={form.maxPrice}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                            placeholder="15000000"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div style={{ paddingTop: 10 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Tình trạng <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Chọn tình trạng</option>
                                        <option value="NEW">Mới</option>
                                        <option value="LIKE_NEW">Như mới</option>
                                        <option value="USED">Đã sử dụng</option>
                                        <option value="BROKEN">Hư hỏng</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4" style={{ paddingTop: 10 }}>
                                {/* Province */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Tỉnh / Thành phố <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={provinceCode}
                                            onChange={e => {
                                                setProvinceCode(e.target.value);
                                                setWardCode("");
                                            }}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Chọn tỉnh thành</option>
                                            {Object.values(provinces).map(p => (
                                                <option key={p.code} value={p.code}>
                                                    {p.name_with_type}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Ward */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Phường / Xã <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            disabled={!provinceCode}
                                            value={wardCode}
                                            onChange={e => setWardCode(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                            required
                                        >
                                            <option value="">Chọn phường xã</option>
                                            {filteredWards.map(w => (
                                                <option key={w.code} value={w.code}>
                                                    {w.name_with_type}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: BRAND & CATEGORY */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200" style={{ padding: 15, margin: 15 }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center" style={{ marginBottom: 30 }}>
                                <Tag className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Phân loại sản phẩm</h2>
                                <p className="text-sm text-slate-500">Chọn hãng và danh mục</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Parent Brand */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Hãng chính <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={parentBrandId}
                                            onChange={e => setParentBrandId(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Chọn hãng</option>
                                            {brandParents.map(b => (
                                                <option key={b.brandId} value={b.brandId}>
                                                    {b.brandName}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Child Brand */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Dòng sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            disabled={!parentBrandId}
                                            value={brandId}
                                            onChange={e => setBrandId(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                        >
                                            <option value="">Chọn dòng</option>
                                            {brandChildren.map(b => (
                                                <option key={b.brandId} value={b.brandId}>
                                                    {b.brandName}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Parent Category */}
                            <div style={{ paddingTop: 10 }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Danh mục chính <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        disabled={!parentBrandId}
                                        value={parentCateId}
                                        onChange={e => setParentCateId(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {cateParents.map(c => (
                                            <option key={c.cateId} value={c.cateId}>
                                                {c.cateName}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* CATEGORY CHILDREN */}
                            {parentCateId && cateChildren.length > 0 && (
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200" style={{ marginTop: 10 }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <label className="text-sm font-semibold text-slate-700">
                                            Danh mục con <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {cateChildren.map(c => (
                                            <label
                                                key={c.cateId}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${cateIds.includes(String(c.cateId))
                                                    ? 'border-green-400 bg-green-50 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={cateIds.includes(String(c.cateId))}
                                                    onChange={e => {
                                                        const id = String(c.cateId);
                                                        setCateIds(prev =>
                                                            e.target.checked
                                                                ? [...prev, id]
                                                                : prev.filter(x => x !== id)
                                                        );
                                                    }}
                                                    className="w-4 h-4 text-yellow-500 border-slate-300 rounded focus:ring-yellow-400"
                                                />
                                                <span className="text-sm font-medium text-slate-700" style={{ marginLeft: 10, marginBottom: 10 }}>
                                                    {c.cateName}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 4: SPECIFICATIONS */}
                    {specs.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200" style={{ padding: 15, margin: 15 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center" style={{ marginBottom: 30 }}>
                                    <FileText className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">Thông số kỹ thuật</h2>
                                    <p className="text-sm text-slate-500">Điền đầy đủ thông tin</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {specs.map(s => (
                                    <div key={s.specId}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <label className="text-sm font-medium text-slate-700">
                                                {s.specName} <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <input
                                            value={specValues[s.specId] || ""}
                                            onChange={e => handleSpecChange(s.specId, e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all ${!specValues[s.specId]
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-slate-300'
                                                }`}
                                            placeholder={`Nhập ${s.specName.toLowerCase()}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-content-end gap-3" w-full style={{ margin: 20 }}>
                        <button style={{ borderRadius: 5 }}
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-0 py-3 border-2 w-1/4! border-[var(--cancel)] text-[var(--cancel)] font-semibold rounded-lg hover:bg-[var(--cancel)] hover:text-white transition-all"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            style={{ borderRadius: 5 }}
                            type="submit"
                            disabled={uploading}
                            className="px-0 py-3 w-1/4! bg-[var(--primary-color)] text-[var(--primary-color-text)] font-semibold rounded-lg hover:bg-[var(--primary-color-hover)] transition-all shadow-lg hover:shadow-xl transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Đang tải lên..." : "Gửi tin ngay"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreatePost;