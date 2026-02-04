import { faArrowRightArrowLeft, faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import api from "../../api";
import { useAuthStore } from "../../store/auth";
import Swal from "sweetalert2";

export function ChatInput({ connectionRef, conversationId, post,buyerId }) {
    const [message, setMessage] = useState("");
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isTransation, setIsTransation] = useState(false);
    const [transactionData, setTransactionData] = useState(null);
    const inputRef = useRef();
    // const [notification, setNotification] = useState("");
    const { user: currentUser } = useAuthStore();
    const confirmCreateTransaction = () => {
        Swal.fire({
            title: "Bạn có chắc muốn tạo giao dịch trung gian không?",
            text: "Lưu ý : Người mua cần thanh toán cả phí giao dịch và sản phẩm",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ",
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    "bg-green-600 text-white text-md me-2 px-4 py-2 rounded mr-2 hover:bg-green-700",
                cancelButton:
                    "bg-red-500 text-white text-md px-4 py-2 rounded hover:bg-red-700",
            },
        }).then(async(result) => {
            if (result.isConfirmed) {
                // const canCreate = await connectionRef.current.invoke(
                //     "CheckExistingTransaction",
                //     Number(conversationId)
                // );

                // if (!canCreate) return;

                handleCreateTransaction();
            }
            else {
                return;
            }
        });
    };

    const sendMessage = async (options = {}) => {

        const {
            forceTransaction = false,
            transactionPayload = null
        } = options;

        if (!message.trim() && selectedFiles.length === 0 && !forceTransaction) return;

        let imageUrls = [];
        if (selectedFiles.length > 0) {
            const form = new FormData();
            selectedFiles.forEach((f) => form.append("files", f));
            try {
                const res = await api.post("/api/upload", form, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                imageUrls = res.data.imageUrls || [];
            } catch (err) {
                console.error("Upload failed:", err);
                imageUrls = [];
            }
        }

        try {
            if (forceTransaction && transactionPayload) {


                // Gửi transaction data
                await connectionRef.current.invoke(
                    "SendMessage",
                    conversationId.toString(),
                    "", // empty message
                    imageUrls,
                    true, // isTransaction
                    transactionPayload
                );
            } else {

                // Gửi message thường
                await connectionRef.current.invoke(
                    "SendMessage",
                    conversationId.toString(),
                    message,
                    imageUrls,
                    false,
                    null
                );
            }
        } catch (err) {
            console.error("SignalR send failed:", err);
        }

        setMessage("");
        setPreviewImages([]);
        setSelectedFiles([]);
        setIsTransation(false);
        setTransactionData(null);
    };

    const handleCreateTransaction = async () => {
        if (!post) {
            alert("Không có thông tin sản phẩm");
            return;
        }



        const platformFee = Math.round(post.postPrice * 0.05);
        const totalAmount = post.postPrice + platformFee;
        const txData = {
            postId: post.postId,
            buyerId: buyerId,
            sellerId: post.userId,
            amount: totalAmount,
            postPrice: post.postPrice,
            platformFee: platformFee,
            buyerConfirmed: currentUser.userId != post.userId,
            sellerConfirmed: currentUser.userId == post.userId,
        };

        setTransactionData(txData);
        setIsTransation(true);
        await sendMessage({
            forceTransaction: true,
            transactionPayload: txData
        });
        // setMessage("Yêu cầu tạo giao dịch trung gian");
    };

    const handlePreviewImages = (e) => {
        const files = [...e.target.files];
        files.forEach(item => {
            if (item) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setPreviewImages((prev) => [...prev, ev.target.result]);
                }
                reader.readAsDataURL(item);
            }
        });
        setSelectedFiles((prev) => [...prev, ...files]);
        inputRef.current.focus();
    }

    const handleRemoveImage = (index) => {
        setPreviewImages(previewImages.filter((img, i) => i !== index));
        setSelectedFiles(selectedFiles.filter((f, i) => i !== index));
    }
    return (
        <div className="p-3 border-t-[rgba(220,207,207,0.3)] border-t-2 flex items-center gap-2 flex-wrap">
            {
                previewImages.length > 0 && (
                    <div className="w-full d-flex gap-2">
                        {
                            previewImages.map((img, i) => (
                                <div className="relative w-14 h-14 rounded-4 shadow-sm" id={i}>
                                    <img src={img} className="w-full h-full rounded-4 p-1" />
                                    <div onClick={() => handleRemoveImage(i)} className="absolute top-0 right-0 w-4 h-4 bg-black text-white rounded-full text-xs font-bold flex justify-center items-center cursor-pointer">
                                        X
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }

            <div className="flex p-2 rounded-4 font-medium bg-[#EDEDED] hover:bg-[#E0E0E0] text-sm cursor-pointer justify-center items-center">
                <button onClick={confirmCreateTransaction} className="rounded font-medium border-0"><FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-md" /> Giao dịch trung gian </button>
            </div>
            <label for="image-upload" className="flex p-2 rounded-4 font-medium bg-[#EDEDED] hover:bg-[#E0E0E0] text-sm cursor-pointer justify-center items-center">
                <FontAwesomeIcon icon={faImage} className="text-md" /> Hình ảnh
                <input type="file" className="hidden" multiple accept="image/*" id="image-upload" onChange={handlePreviewImages} />
            </label>

            <form onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
            }} className="flex flex-1">
                <input
                    type="text"
                    placeholder={isTransation ? "Giao dịch trung gian..." : "Nhập tin nhắn"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-full outline-none"
                    disabled={isTransation}
                    ref={inputRef}
                />
                <button type="submit" disabled={!message && !isTransation} className={`${(message || isTransation) ? "text-green-600 cursor" : "text-black cursor-[not-allowed_!important]"} p-2 flex justify-center items-center text-md rounded-circle`}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
        </div>
    );
}
