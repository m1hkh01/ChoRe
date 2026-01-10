import "@/assets/pay.css"
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
function Pay({ pkg, orderCode, onClose}) {
    const qrcode = `https://qr.sepay.vn/img?acc=0379530805&bank=MB&amount=${pkg.subPlanPrice}&des=${orderCode}`;
    const [isQrCode, setIsQrCode] = useState(true);
    const handlePay = async () => {
        const res = await api.post("/api/package/pay-order", { orderCode })
        console.log("handle Pay subPlanOrder: ", res.data);
        onClose();
        alert(res.data.message);
    }
    return (
        <div className="pay-container">
            <div className="info-section">
                <h2>Thông tin thanh toán</h2>
                <div className="pay-summary">
                    <div className="mb-2">
                        <h4>Gói dịch vụ đã chọn:</h4>
                        <span>{pkg.subPlanName}</span>
                    </div>
                    <div className="pay-info">
                        <p className="item-label">Mã đơn hàng</p>
                        <p className="item-value">{orderCode}</p>
                    </div>
                    <div className="total-pay">
                        <p className="total-pay-label">Tổng tiền: </p>
                        <p className="total-pay-value">{pkg.subPlanPrice.toLocaleString("vi-VN")}</p>
                    </div>
                    <div className="comfirm-pay">
                        <p>
                            Nếu bạn đã chuyển khoản thành công,
                            <br />
                            vui lòng nhấn nút "Thanh toán thành công"
                        </p>
                        <button className="comfirm-btn" onClick={handlePay}>Thanh toán thành công</button>
                    </div>
                </div>
                <div className="info-warning">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-danger mt-3" />
                    <p className="warning-text"><strong className="text-danger">Lưu ý: </strong>
                        Chợ Rẻ không hoàn tiền cho các giao dịch phát sinh do lỗi hoặc nhầm lẫn từ phía khách hàng.
                    </p>
                </div>
                <div className="d-flex justify-content-center mt-2">
                    <button className="return-btn" onClick={onClose}>
                        Quay về
                    </button>
                </div>
            </div>
            <div className="qr-section">
                <div className="switch-category" style={{ "--posX": isQrCode ? "5px" : "165px" }}>
                    <div className="switch-item" onClick={() => setIsQrCode(true)}>Quét mã QR</div>
                    <div className="switch-item active" onClick={() => setIsQrCode(false)}>Chuyển khoản</div>
                </div>
                <div className="content">
                    {
                        isQrCode ? (
                            <div className="qr-code">
                                <img src={qrcode} alt="" />
                                <div className="guide">
                                    <span className="qr-text">
                                        Sử dụng ứng dụng ngân hàng có
                                        chức năng <FontAwesomeIcon icon={faQrcode} /> <strong>QR Code</strong> để quét mã
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="transfer">
                                <div>
                                    <p className="tranfer-label">Tên tài khoản</p>
                                    <p className="tranfer-value">Nguyen cu nhat</p>
                                </div>
                                <div>
                                    <p className="tranfer-label">Số tài khoản</p>
                                    <p className="tranfer-value">0379530805</p>
                                </div>
                                <div>
                                    <p className="tranfer-label">Số tiền</p>
                                    <p className="tranfer-value">{pkg.subPlanPrice.toLocaleString("vi-VN")}</p>
                                </div>
                                <div>
                                    <p className="tranfer-label">Nội dung chuyển khoản</p>
                                    <p className="tranfer-value">{orderCode}</p>
                                </div>
                                <div className="tranfer-warning">
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-danger mt-3" />
                                    <p className="warning-text"><strong className="text-danger">Lưu ý: </strong>
                                        Hãy nhập đúng thông tin tài khoản,
                                        nội dung chuyển khoản để đảm bảo giao dịch thành công
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default Pay;