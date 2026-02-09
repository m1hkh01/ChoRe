import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faExpand } from "@fortawesome/free-solid-svg-icons";
import "@/assets/PostImages.css";

function PostImages({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="images-card">
                <div className="images-placeholder">
                    <span>Không có hình ảnh</span>
                </div>
            </div>
        );
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div className="images-card">
                {/* Main Image */}
                <div className="main-image-container">
                    <img
                        src={`http://localhost:5121/uploads/${images[currentIndex]}`}
                        alt={`Image ${currentIndex + 1}`}
                        className="main-image"
                    />

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button className="nav-btn nav-btn-left" onClick={prevImage}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <button className="nav-btn nav-btn-right" onClick={nextImage}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="image-counter">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Fullscreen Button */}
                    <button 
                        className="fullscreen-btn"
                        onClick={() => setIsFullscreen(true)}
                    >
                        <FontAwesomeIcon icon={faExpand} />
                    </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="thumbnails-container">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`thumbnail ${i === currentIndex ? "thumbnail-active" : ""}`}
                                onClick={() => setCurrentIndex(i)}
                            >
                                <img
                                    src={`http://localhost:5121/uploads/${img}`}
                                    alt={`Thumbnail ${i + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fullscreen-modal" onClick={() => setIsFullscreen(false)}>
                    <img
                        src={`http://localhost:5121/uploads/${images[currentIndex]}`}
                        alt={`Fullscreen ${currentIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="close-fullscreen" onClick={() => setIsFullscreen(false)}>
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}

export default PostImages;