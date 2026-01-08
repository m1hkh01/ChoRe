import { useState } from "react";

function PostSeller({ user }) {
    const [showPhone, setShowPhone] = useState(false);

    return (
        <div className="card p-3">
            <h5 className="fw-bold mb-2">Người bán</h5>

            <div className="mb-2">
                <strong>{user.fullName}</strong>
            </div>

            {!showPhone ? (
                <button
                    className="btn btn-success w-100"
                    onClick={() => setShowPhone(true)}
                >
                    Hiện số điện thoại
                </button>
            ) : (
                <a
                    href={`tel:${user.phoneNumber}`}
                    className="btn btn-outline-success w-100"
                >
                    {user.phoneNumber}
                </a>
            )}
        </div>
    );
}

export default PostSeller;
