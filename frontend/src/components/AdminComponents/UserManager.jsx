import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "@/api";
import "@/assets/user-manager.css";
import { Lock, Unlock, Trash2 } from "lucide-react";

function UserManager() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [lockUser, setLockUser] = useState(null);
    const [lockReason, setLockReason] = useState("");
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            const res = await api.get("/api/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            setError("Không thể tải danh sách người dùng");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const openLockModal = async (user) => {
        try {
            if (user.isLocked) {
                // UNLOCK
                await api.patch(`/api/admin/users/${user.userId}/unlock`);
                loadUsers();
                return;
            }

            // LOCK → mở modal nhập lý do
            setLockUser(user);
            setLockReason("");
        } catch (err) {
            console.error(err);
            alert("Không thể thay đổi trạng thái tài khoản");
        }
    };

    const submitLock = async () => {
        if (!lockReason.trim()) {
            alert("Vui lòng nhập lý do khoá tài khoản");
            return;
        }

        try {
            setLoading(true);

            await api.patch(`/api/admin/users/${lockUser.userId}/lock`, {
                lockReason: lockReason,
            });

            setLockUser(null);
            setLockReason("");
            loadUsers();
        } catch (err) {
            console.error(err);
            alert("Khoá tài khoản thất bại");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!confirm("Xoá người dùng này?")) return;

        try {
            await api.delete(`/api/admin/users/${id}`);
            loadUsers();
        } catch (err) {
            console.error(err);
            alert("Xoá người dùng thất bại");
        }
    };

    return (
        <div className="p-4">
            <h3 className="mb-3">Quản lý người dùng</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card">
                <div className="card-body">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Tên người dùng</th>
                                <th>Vai trò</th>
                                <th>Số điện thoại</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr key={u.userId}>
                                    {/* USER */}
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={
                                                    u.avatar
                                                        ? `${API_BASE_URL}/uploads/${u.avatar}`
                                                        : "/default-avatar.png"
                                                }
                                                className="avatar" alt={u.fullName}
                                            />
                                            <div>
                                                <div className="fw-semibold">{u.fullName}</div>
                                                <small className="text-muted">ID: {u.userId}</small>
                                            </div>
                                        </div>
                                    </td>

                                    {/* ROLE */}
                                    <td>
                                        <span className={`badge role-${u.roleName.toLowerCase()}`}>
                                            {u.roleName}
                                        </span>
                                    </td>

                                    {/* PHONE */}
                                    <td>{u.phoneNumber || "-"}</td>

                                    {/* STATUS */}
                                    <td>
                                        {u.isLocked ? (
                                            <span className="text-danger fw-medium">
                                                ● Ngừng hoạt động
                                            </span>
                                        ) : (
                                            <span className="text-success fw-medium">
                                                ● Đang hoạt động
                                            </span>
                                        )}
                                    </td>

                                    {/* ACTIONS */}
                                    <td>
                                        <div className="action-cell">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                title={u.isLocked ? "Mở khoá" : "Khoá tài khoản"}
                                                onClick={() => openLockModal(u)}
                                            >
                                                {u.isLocked ? (
                                                    <Unlock size={16} />
                                                ) : (
                                                    <Lock size={16} />
                                                )}
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                title="Xoá người dùng"
                                                onClick={() => deleteUser(u.userId)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        Không có người dùng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* LOCK MODAL */}
            {lockUser && (
                <div className="modal-backdrop-custom">
                    <div className="modal-card">
                        <h5 className="mb-2">Khoá tài khoản</h5>

                        <p>
                            Bạn đang khoá: <b>{lockUser.fullName}</b>
                        </p>

                        <textarea
                            className="form-control mb-3"
                            rows={3}
                            placeholder="Nhập lý do khoá tài khoản..."
                            value={lockReason}
                            onChange={(e) => setLockReason(e.target.value)}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setLockUser(null)}
                                disabled={loading}
                            >
                                Huỷ
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={submitLock}
                                disabled={!lockReason.trim() || loading}
                            >
                                {loading ? "Đang khoá..." : "Khoá tài khoản"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManager;
