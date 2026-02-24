import { useState, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes, faUser, faPhone,
    faMapMarkerAlt, faLock, faSave,
    faEnvelope, faCamera, faAt,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

// ── Import địa chỉ ─────────────────────────────────────────────────────────
import provinceData from "@/data/sauSapNhap/province.json";
import wardData from "@/data/sauSapNhap/ward.json";

// ── Validation helpers ─────────────────────────────────────────────────────
const RULES = {
    fullName: {
        required: true,
        minLen: 2,
        maxLen: 100,
        label: "Họ và tên",
    },
    userName: {
        required: true,
        minLen: 3,
        maxLen: 50,
        pattern: /^[a-zA-Z0-9_]+$/,
        patternMsg: "Chỉ gồm chữ cái, số và dấu gạch dưới",
        label: "Tên đăng nhập",
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMsg: "Email không hợp lệ",
        label: "Email",
    },
    phoneNumber: {
        required: false,
        pattern: /^(0[3-9]\d{8})?$/,
        patternMsg: "Số điện thoại Việt Nam không hợp lệ (VD: 0912345678)",
        label: "Số điện thoại",
    },
};

function validateField(name, value) {
    const r = RULES[name];
    if (!r) return "";
    if (r.required && !value.trim()) return `${r.label} không được để trống`;
    if (value.trim()) {
        if (r.minLen && value.trim().length < r.minLen)
            return `${r.label} tối thiểu ${r.minLen} ký tự`;
        if (r.maxLen && value.trim().length > r.maxLen)
            return `${r.label} tối đa ${r.maxLen} ký tự`;
        if (r.pattern && !r.pattern.test(value.trim()))
            return r.patternMsg;
    }
    return "";
}

function validateAll(form) {
    const errs = {};
    Object.keys(RULES).forEach(k => {
        const msg = validateField(k, form[k] ?? "");
        if (msg) errs[k] = msg;
    });
    return errs;
}

// ── Address picker helpers ─────────────────────────────────────────────────
const provinces = Object.values(provinceData).sort((a, b) =>
    a.name.localeCompare(b.name, "vi")
);

function wardsForProvince(provinceCode) {
    if (!provinceCode) return [];
    return Object.values(wardData)
        .filter(w => w.parent_code === provinceCode)
        .sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

// ────────────────────────────────────────────────────────────────────────────
export default function EditProfileModal({ profile, onClose, onSaved }) {
    const [tab, setTab] = useState("info");
    const [saving, setSaving] = useState(false);

    // ── info form ────────────────────────────────────────────────────────────
    const [form, setForm] = useState({
        fullName: profile.fullName ?? "",
        userName: profile.userName ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phoneNumber ?? "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [infoMsg, setInfoMsg] = useState({ text: "", type: "" });

    // ── address state ────────────────────────────────────────────────────────
    const [provinceCode, setProvinceCode] = useState("");
    const [wardCode, setWardCode] = useState("");

    const wards = useMemo(() => wardsForProvince(provinceCode), [provinceCode]);

    // Full address string to send
    const buildAddress = () => {
        const prov = provinceCode ? provinceData[provinceCode] : null;
        const ward = wardCode ? wardData[wardCode] : null;
        return [
            ward ? ward.name_with_type : "",
            prov ? prov.name_with_type : "",
        ].filter(Boolean).join(", ");
    };

    // ── avatar ───────────────────────────────────────────────────────────────
    const fileRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(
        profile.avatar
            ? `${import.meta.env.VITE_API_URL}/uploads/${profile.avatar}`
            : null
    );
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarMsg, setAvatarMsg] = useState({ text: "", type: "" });

    // ── password ─────────────────────────────────────────────────────────────
    const [pw, setPw] = useState({ old: "", next: "", confirm: "" });
    const [pwErr, setPwErr] = useState({});
    const [pwMsg, setPwMsg] = useState({ text: "", type: "" });

    // ────────────────────────────────────────────────────────────────────────
    // Handlers
    // ────────────────────────────────────────────────────────────────────────
    const handleChange = (field, value) => {
        setForm(p => ({ ...p, [field]: value }));
        if (touched[field]) {
            setErrors(p => ({ ...p, [field]: validateField(field, value) }));
        }
    };

    const handleBlur = (field) => {
        setTouched(p => ({ ...p, [field]: true }));
        setErrors(p => ({ ...p, [field]: validateField(field, form[field] ?? "") }));
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Client-side file validation
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            setAvatarMsg({ text: "Chỉ chấp nhận jpg, png, webp", type: "err" }); return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setAvatarMsg({ text: "Ảnh tối đa 5MB", type: "err" }); return;
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarMsg({ text: "", type: "" });
    };

    const uploadAvatar = async () => {
        if (!avatarFile) return;
        setSaving(true);
        setAvatarMsg({ text: "", type: "" });
        try {
            const fd = new FormData();
            fd.append("file", avatarFile);
            await api.post("/api/profile/me/avatar", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAvatarMsg({ text: "Cập nhật ảnh đại diện thành công!", type: "ok" });
            setAvatarFile(null);
            onSaved();
        } catch (err) {
            setAvatarMsg({ text: err.response?.data || "Tải ảnh thất bại", type: "err" });
        } finally {
            setSaving(false);
        }
    };

    const saveInfo = async () => {
        // Touch all fields
        const allTouched = Object.fromEntries(Object.keys(RULES).map(k => [k, true]));
        setTouched(allTouched);
        const errs = validateAll(form);
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return;

        setSaving(true);
        setInfoMsg({ text: "", type: "" });
        try {
            await api.put("/api/profile/me", {
                fullName: form.fullName,
                userName: form.userName,
                email: form.email,
                phoneNumber: form.phoneNumber,
                address: buildAddress(),
            });
            setInfoMsg({ text: "Cập nhật thông tin thành công!", type: "ok" });
            onSaved();
        } catch (err) {
            setInfoMsg({ text: err.response?.data || "Không thể lưu", type: "err" });
        } finally {
            setSaving(false);
        }
    };

    const validatePw = () => {
        const e = {};
        if (!pw.old) e.old = "Vui lòng nhập mật khẩu hiện tại";
        if (!pw.next) e.next = "Vui lòng nhập mật khẩu mới";
        else if (pw.next.length < 6) e.next = "Ít nhất 6 ký tự";
        if (!pw.confirm) e.confirm = "Vui lòng xác nhận mật khẩu";
        else if (pw.next !== pw.confirm) e.confirm = "Mật khẩu không khớp";
        return e;
    };

    const changePw = async () => {
        const e = validatePw();
        setPwErr(e);
        if (Object.keys(e).length) return;
        setSaving(true);
        setPwMsg({ text: "", type: "" });
        try {
            await api.post("/api/profile/me/change-password", {
                oldPassword: pw.old,
                newPassword: pw.next,
            });
            setPwMsg({ text: "Đổi mật khẩu thành công!", type: "ok" });
            setPw({ old: "", next: "", confirm: "" });
            setPwErr({});
        } catch (err) {
            setPwMsg({ text: err.response?.data || "Thất bại", type: "err" });
        } finally {
            setSaving(false);
        }
    };

    // ────────────────────────────────────────────────────────────────────────
    return (
        <div className="pf-modal-overlay" onClick={onClose}>
            <div className="pf-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="pf-modal-hd">
                    <h2>Chỉnh sửa hồ sơ</h2>
                    <button className="pf-modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="pf-modal-tabs">
                    {[
                        { key: "info", icon: faUser, label: "Thông tin" },
                        { key: "avatar", icon: faCamera, label: "Ảnh đại diện" },
                        { key: "pw", icon: faLock, label: "Mật khẩu" },
                    ].map(t => (
                        <button
                            key={t.key}
                            className={`pf-modal-tab ${tab === t.key ? "pf-modal-tab--active" : ""}`}
                            onClick={() => setTab(t.key)}
                        >
                            <FontAwesomeIcon icon={t.icon} /> {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Thông tin ── */}
                {tab === "info" && (
                    <div className="pf-modal-body">
                        {infoMsg.text && (
                            <div className={`pf-alert pf-alert--${infoMsg.type}`}>
                                {infoMsg.text}
                            </div>
                        )}

                        <ValidatedField
                            icon={faUser} label="Họ và tên" error={errors.fullName}
                        >
                            <input
                                value={form.fullName}
                                onChange={e => handleChange("fullName", e.target.value)}
                                onBlur={() => handleBlur("fullName")}
                                placeholder="Họ và tên..."
                                className={errors.fullName ? "pf-input--error" : ""}
                            />
                        </ValidatedField>

                        <ValidatedField
                            icon={faAt} label="Tên đăng nhập" error={errors.userName}
                        >
                            <input
                                value={form.userName}
                                onChange={e => handleChange("userName", e.target.value)}
                                onBlur={() => handleBlur("userName")}
                                placeholder="Chỉ chữ, số, gạch dưới..."
                                className={errors.userName ? "pf-input--error" : ""}
                            />
                        </ValidatedField>

                        <ValidatedField
                            icon={faEnvelope} label="Email" error={errors.email}
                        >
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                placeholder="example@email.com"
                                className={errors.email ? "pf-input--error" : ""}
                            />
                        </ValidatedField>

                        <ValidatedField
                            icon={faPhone} label="Số điện thoại" error={errors.phoneNumber}
                        >
                            <input
                                type="tel"
                                value={form.phoneNumber}
                                onChange={e => handleChange("phoneNumber", e.target.value)}
                                onBlur={() => handleBlur("phoneNumber")}
                                placeholder="0912345678"
                                className={errors.phoneNumber ? "pf-input--error" : ""}
                            />
                        </ValidatedField>

                        {/* ── Address picker ── */}
                        <div className="pf-field">
                            <label className="pf-field-label">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ
                            </label>

                            <div className="flex flex-col gap-0 mt-1.5">

                                {/* Step 1 — Province */}
                                <select
                                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:border-blue-400 cursor-pointer"
                                    value={provinceCode}
                                    onChange={e => { setProvinceCode(e.target.value); setWardCode(""); }}
                                >
                                    <option value="">Chọn tỉnh / thành phố…</option>
                                    {provinces.map(p => (
                                        <option key={p.code} value={p.code}>{p.name_with_type}</option>
                                    ))}
                                </select>
                                {/* Step 2 — Ward */}
                                <select
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:border-emerald-400 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    value={wardCode}
                                    onChange={e => setWardCode(e.target.value)}
                                    disabled={!provinceCode}
                                >
                                    <option value="">{provinceCode ? "Chọn xã / phường…" : "Chọn tỉnh trước"}</option>
                                    {wards.map(w => (
                                        <option key={w.code} value={w.code}>{w.name_with_type}</option>
                                    ))}
                                </select>

                                {/* Result preview */}
                                {/* {provinceCode && (
                                    <div className="mt-2.5 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100">
                                        <span className="text-sm leading-relaxed shrink-0">📍</span>
                                        <span className="text-sm font-medium text-blue-800 leading-relaxed">{buildAddress()}</span>
                                    </div>
                                )} */}
                            </div>
                        </div>

                        <button
                            className="pf-modal-save"
                            onClick={saveInfo}
                            disabled={saving}
                        >
                            <FontAwesomeIcon icon={faSave} />
                            {saving ? " Đang lưu..." : " Lưu thay đổi"}
                        </button>
                    </div>
                )}

                {/* ── Tab: Avatar ── */}
                {tab === "avatar" && (
                    <div className="pf-modal-body pf-modal-body--avatar">
                        {avatarMsg.text && (
                            <div className={`pf-alert pf-alert--${avatarMsg.type}`}>
                                {avatarMsg.text}
                            </div>
                        )}
                        <div className="pf-avatar-preview-wrap">
                            {avatarPreview
                                ? <img src={avatarPreview} alt="avatar" className="pf-avatar-preview" />
                                : (
                                    <div className="pf-avatar-placeholder">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                )
                            }
                            <button
                                className="pf-avatar-pick-btn"
                                onClick={() => fileRef.current?.click()}
                            >
                                <FontAwesomeIcon icon={faCamera} /> Chọn ảnh
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                style={{ display: "none" }}
                                onChange={onFileChange}
                            />
                        </div>
                        <p className="pf-avatar-hint">Chấp nhận jpg, png, webp · Tối đa 5MB</p>
                        <button
                            className="pf-modal-save"
                            onClick={uploadAvatar}
                            disabled={saving || !avatarFile}
                        >
                            <FontAwesomeIcon icon={faSave} />
                            {saving ? " Đang tải lên..." : " Lưu ảnh đại diện"}
                        </button>
                    </div>
                )}

                {/* ── Tab: Mật khẩu ── */}
                {tab === "pw" && (
                    <div className="pf-modal-body">
                        {pwMsg.text && (
                            <div className={`pf-alert pf-alert--${pwMsg.type}`}>
                                {pwMsg.text}
                            </div>
                        )}
                        <ValidatedField icon={faLock} label="Mật khẩu hiện tại" error={pwErr.old}>
                            <input
                                type="password"
                                value={pw.old}
                                onChange={e => { setPw(p => ({ ...p, old: e.target.value })); setPwErr(p => ({ ...p, old: "" })); }}
                                placeholder="••••••••"
                                className={pwErr.old ? "pf-input--error" : ""}
                            />
                        </ValidatedField>
                        <ValidatedField icon={faLock} label="Mật khẩu mới" error={pwErr.next}>
                            <input
                                type="password"
                                value={pw.next}
                                onChange={e => { setPw(p => ({ ...p, next: e.target.value })); setPwErr(p => ({ ...p, next: "" })); }}
                                placeholder="Ít nhất 6 ký tự"
                                className={pwErr.next ? "pf-input--error" : ""}
                            />
                        </ValidatedField>
                        <ValidatedField icon={faLock} label="Xác nhận mật khẩu mới" error={pwErr.confirm}>
                            <input
                                type="password"
                                value={pw.confirm}
                                onChange={e => { setPw(p => ({ ...p, confirm: e.target.value })); setPwErr(p => ({ ...p, confirm: "" })); }}
                                placeholder="••••••••"
                                className={pwErr.confirm ? "pf-input--error" : ""}
                            />
                        </ValidatedField>
                        <button className="pf-modal-save" onClick={changePw} disabled={saving}>
                            <FontAwesomeIcon icon={faLock} />
                            {saving ? " Đang xử lý..." : " Đổi mật khẩu"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function ValidatedField({ icon, label, error, children }) {
    return (
        <div className={`pf-field ${error ? "pf-field--invalid" : ""}`}>
            <label className="pf-field-label">
                <FontAwesomeIcon icon={icon} />
                {label}
            </label>
            {children}
            {error && (
                <span className="pf-field-error">
                    <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                </span>
            )}
        </div>
    );
}