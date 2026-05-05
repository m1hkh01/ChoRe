// ReviewForm.jsx
import { useEffect, useState } from 'react';
import { X, Video, ImagePlus } from 'lucide-react';
import { StarRating } from './StarRating';
import { TagSelector } from './TagSelector';
import { Toast } from '../../utils/toast';
import api from '../../api';

export default function ReviewForm({ review, transactionId, sellerId, postId, chatRoomId, postImage, postTitle, userId, reload, onClose }) {
    const [rating, setRating] = useState(review ? review.rating : 0);
    const [comment, setComment] = useState(review ? review.comment : "");
    const [selectedTags, setSelectedTags] = useState(review ? review.reviewTags : []);
    const [images, setImages] = useState(review ? review.reviewImages?.map(img => ({ previewUrl: img.fileUrl, type: img.type, isServer: true })) : []);
    // console.log("Review data: ", review);
    const MAX_FILES = 5;
    const MAX_SIZE_MB = 10;
    const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;
    const tags = [
        'Người bán không thân thiện',
        'Giao tiếp lịch sự thân thiện',
        'Chất lượng sản phẩm người bán tốt',
        'Đáng tin cậy',
        'Phan hồi nhanh chóng',
        'Sản phẩm không đúng mô tả',
        'Sản phẩm chất lượng tốt',
        'Sản phẩm giá tốt'
    ];
    const ratingTexts = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

    useEffect(() => {
        // Khóa scroll khi mở modal
        document.body.style.overflow = 'hidden';

        return () => {
            // Mở lại scroll khi đóng modal
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const toggleTag = (tag) => {
        setSelectedTags((prev) => {
            const exists = prev.some((t) => t.tag === tag);

            return exists
                ? prev.filter((t) => t.tag !== tag)
                : [...prev, { tag }];
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Tổng file sau khi thêm
        if (images.length + files.length > MAX_FILES) {
            Toast.fire({
                icon: 'error',
                title: `Chỉ được tải tối đa ${MAX_FILES} ảnh/video`
            });
            return;
        }

        const validFiles = [];

        for (const file of files) {
            if (file.size > MAX_SIZE) {
                Toast.fire({
                    icon: 'error',
                    title: `File "${file.name}" vượt quá ${MAX_SIZE_MB}MB`
                });
                continue;
            }

            validFiles.push({
                file,
                previewUrl: URL.createObjectURL(file),
                type: file.type,
                isServer: false
            });
        }

        setImages((prev) => [...prev, ...validFiles]);
    };
    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [images]);
    const removeImage = (index) => {
        setImages((prev) => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].previewUrl);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ========================
            // VALIDATION
            // ========================

            if (!rating || rating < 1 || rating > 5) {
                alert("Vui lòng chọn số sao hợp lệ");
                return;
            }

            if (images.length > MAX_FILES) {
                alert(`Chỉ được upload tối đa ${MAX_FILES} file`);
                return;
            }

            for (const img of images) {
                if (img.file?.size > MAX_SIZE) {
                    alert(`File ${img.file.name} vượt quá 10MB`);
                    return;
                }
            }

            // ========================
            // BUILD FORMDATA
            // ========================

            const formData = new FormData();

            formData.append("Rating", rating);
            formData.append("Comment", comment.trim());
            formData.append("ReviewerId", userId); // truyền thêm nếu cần
            formData.append("SellerId", sellerId ?? 0);
            formData.append("TransactionId", transactionId ?? "");
            formData.append("PostId", postId ?? 0);
            formData.append("ChatRoomId", chatRoomId);

            selectedTags.forEach(tag => {
                formData.append("Tags", tag.tag);
            });

            // Files
            images.forEach(img => {
                formData.append("Files", img.file);
            });

            // ========================
            // CALL API
            // ========================
            if (review) {
                const res = await api.post(`/api/review/${review.reviewId}`, formData);
                Toast.fire({
                    icon: 'success',
                    title: res.data.message || "Cập nhật đánh giá thành công"
                });
            }
            else {
                const res = await api.post("/api/review", formData);
                Toast.fire({
                    icon: 'success',
                    title: res.data.message || "Đánh giá thành công"
                });
            }
            // alert("Đánh giá thành công 🎉");

            // Optional reset
            // setRating(0);
            // setComment("");
            // setSelectedTags([]);
            // setImages([]);

            reload();
            onClose();

        } catch (err) {
            console.error("Review error:", err);
            Toast.fire({
                icon: 'error',
                title: err.response?.data || err.message || "Có lỗi xảy ra"
            });
            // alert(err.message || "Có lỗi xảy ra");
        }
    };

    const isSubmitDisabled = rating === 0;

    return (
        <div className="fixed inset-0 z-990 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl p-2 transform overflow-hidden rounded-sm bg-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="relative flex items-center justify-center pt-0 pb-4">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute right-0 top-0 rounded-full p-2 text-gray-500 hover:bg-gray-100 active:scale-95 transition"
                        >
                            <X size={30} />
                        </button>
                    )}
                </div>

                <div className="flex text-lg font-semibold mt-1 mx-3 text-gray-900 border-b pb-1 border-gray-200">
                    {postTitle && (<img src={"https://api.chore123.cloud/uploads/" + postImage} alt={postTitle} className="h-15 w-15 object-cover rounded-lg mr-3" />)}
                    {
                        postTitle ?
                            (
                                <span className="self-center text-base font-medium! truncate">{postTitle}</span>
                            )
                            :
                            (
                                <span className="self-center text-2xl font-medium! truncate">Đánh giá cuộc trò chuyện</span>
                            )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pb-8 pt-4 space-y-6">
                    <div className='flex  items-center gap-2 mb-2 '>
                        <span className="text-sm text-gray-500">Đánh giá sản phẩm/Người bán</span>
                        {/* Stars */}
                        <StarRating rating={rating} onRatingChange={handleRatingClick} />
                        <span className="text-sm text-yellow-500">{ratingTexts[rating - 1]}</span>
                    </div>

                    {/* Comment */}
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Viết đánh giá của bạn..."
                        rows={4}
                        required
                        className="w-full rounded-sm resize-none! border border-gray-300 px-4 py-3 text-sm focus:ring-blue-200 outline-none transition"
                    />

                    {/* Tags */}
                    <TagSelector tags={tags} selectedTags={selectedTags} onToggle={toggleTag} />

                    {/* Upload images */}
                    <div className="space-y-3">
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-4! py-2! mb-2 text-center hover:bg-amber-50 transition">
                            <ImagePlus size={32} className="mb-2 text-amber-600" />
                            <span className="text-sm font-medium text-amber-700">Thêm ảnh / video</span>
                            <span className="mt-1 text-xs text-gray-500">PNG, JPG, MP4 (tối đa 5 ảnh / video và tối đa 10MB)</span>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        {/* Preview */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative h-20 w-20 shadow-sm"
                                    >
                                        {img.type?.startsWith("video") ? (
                                            <div className="relative h-full w-full">
                                                <video
                                                    src={img.isServer ? ("https://api.chore123.cloud/uploads/reviews/" + img.previewUrl) : img.previewUrl}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Video size={16}></Video>
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={img.isServer ? ("https://api.chore123.cloud/uploads/reviews/" + img.previewUrl) : img.previewUrl}
                                                alt="preview"
                                                className="h-full w-full object-cover rounded-lg"
                                            />
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute right-0 top-0 flex h-5 w-5 items-center z-10 justify-center bg-black/70 text-white transition"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`
              w-full rounded-xl! py-3.5! mt-2 font-semibold text-white transition-all
              ${isSubmitDisabled
                                ? 'cursor-not-allowed bg-gray-300'
                                : 'bg-green-600 hover:bg-green-700 active:scale-[0.98] shadow-md'
                            }
            `}
                    >
                        Gửi đánh giá
                    </button>
                </form>
            </div>
        </div>
    );
}