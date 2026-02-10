import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes, faUser, faPhone,
    faMapMarkerAlt, faLock, faSave,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api";

export default function EditProfileModal({ profile, onClose, onSaved }) {
    const [tab,     setTab]     = useState("info");
    const [saving,  setSaving]  = useState(false);

    const [form, setForm] = useState({
        fullName:    profile.fullName    ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address:     profile.address     ?? "",
    });

    const [pw, setPw] = useState({ old: "", next: "", confirm: "" });
    const [pwMsg, setPwMsg]         = useState({ text: "", type: "" }); // type: ok | err

    // ── save info ──────────────────────────────────────────────────────────────
    const saveInfo = async () => {
        setSaving(true);
        try {
            await api.put("/api/profile/me", {
                fullName:    form.fullName,
                phoneNumber: form.phoneNumber,
                address:     form.address,
            });
            onSaved();
        } catch (err) {
            alert(err.response?.data || "Không thể lưu");
        } finally {
            setSaving(false);
        }
    };

    // ── change password ────────────────────────────────────────────────────────
    const changePw = async () => {
        setPwMsg({ text: "", type: "" });
        if (pw.next !== pw.confirm) {
            setPwMsg({ text: "Mật khẩu mới không khớp", type: "err" }); return;
        }
        if (pw.next.length < 6) {
            setPwMsg({ text: "Mật khẩu mới cần ít nhất 6 ký tự", type: "err" }); return;
        }
        setSaving(true);
        try {
            await api.post("/api/profile/me/change-password", {
                oldPassword: pw.old,
                newPassword: pw.next,
            });
            setPwMsg({ text: "Đổi mật khẩu thành công!", type: "ok" });
            setPw({ old: "", next: "", confirm: "" });
        } catch (err) {
            setPwMsg({ text: err.response?.data || "Thất bại", type: "err" });
        } finally {
            setSaving(false);
        }
    };

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

                {/* Tab switcher */}
                <div className="pf-modal-tabs">
                    <button
                        className={`pf-modal-tab ${tab === "info" ? "pf-modal-tab--active" : ""}`}
                        onClick={() => setTab("info")}
                    >
                        <FontAwesomeIcon icon={faUser} /> Thông tin
                    </button>
                    {/* <button
                        className={`pf-modal-tab ${tab === "pw" ? "pf-modal-tab--active" : ""}`}
                        onClick={() => setTab("pw")}
                    >
                        <FontAwesomeIcon icon={faLock} /> Mật khẩu
                    </button> */}
                </div>

                {/* Body — Info */}
                {tab === "info" && (
                    <div className="pf-modal-body">
                        <Field icon={faUser} label="Họ và tên">
                            <input
                                value={form.fullName}
                                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                                placeholder="Họ và tên..."
                            />
                        </Field>
                        <Field icon={faPhone} label="Số điện thoại">
                            <input
                                type="tel"
                                value={form.phoneNumber}
                                onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))}
                                placeholder="Số điện thoại..."
                            />
                        </Field>
                        <Field icon={faMapMarkerAlt} label="Địa chỉ">
                            <input
                                value={form.address}
                                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                placeholder="Địa chỉ..."
                            />
                        </Field>
                        <button className="pf-modal-save" onClick={saveInfo} disabled={saving}>
                            <FontAwesomeIcon icon={faSave} />
                            {saving ? " Đang lưu..." : " Lưu thay đổi"}
                        </button>
                    </div>
                )}

                {/* Body — Password */}
                {tab === "pw" && (
                    <div className="pf-modal-body">
                        {pwMsg.text && (
                            <div className={`pf-alert pf-alert--${pwMsg.type}`}>
                                {pwMsg.text}
                            </div>
                        )}
                        <Field icon={faLock} label="Mật khẩu hiện tại">
                            <input
                                type="password"
                                value={pw.old}
                                onChange={e => setPw(p => ({ ...p, old: e.target.value }))}
                                placeholder="••••••••"
                            />
                        </Field>
                        <Field icon={faLock} label="Mật khẩu mới">
                            <input
                                type="password"
                                value={pw.next}
                                onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                                placeholder="Ít nhất 6 ký tự"
                            />
                        </Field>
                        <Field icon={faLock} label="Xác nhận mật khẩu mới">
                            <input
                                type="password"
                                value={pw.confirm}
                                onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                                placeholder="••••••••"
                            />
                        </Field>
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

// ── small helper ──────────────────────────────────────────────────────────────
function Field({ icon, label, children }) {
    return (
        <div className="pf-field">
            <label className="pf-field-label">
                <FontAwesomeIcon icon={icon} />
                {label}
            </label>
            {children}
        </div>
    );
}