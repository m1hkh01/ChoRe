import { useState } from "react";
import "@/assets/ImagesSlide.css";

function PostImages({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="post-image-wrapper">
            {/* ẢNH LỚN */}
            <div className="main-image">
                <img
                    src={`http://localhost:5121/uploads/${images[currentIndex]}`}
                    alt=""
                    className="main-img"
                />

                {/* NÚT TRÁI */}
                <button className="nav-btn left" onClick={prevImage}>
                    ‹
                </button>

                {/* NÚT PHẢI */}
                <button className="nav-btn right" onClick={nextImage}>
                    ›
                </button>

                {/* ĐẾM ẢNH */}
                <div className="image-count">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* ẢNH NHỎ */}
            <div className="thumb-list">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={`http://localhost:5121/uploads/${img}`}
                        className={`thumb ${i === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
}

export default PostImages;
