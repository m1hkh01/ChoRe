function PostImages({ images }) {
    return (
        <div className="mb-3">
            <img
                src={`http://localhost:5121/uploads/${images[0]}`}
                className="img-fluid rounded mb-2"
            />

            <div className="d-flex gap-2">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={`http://localhost:5121/uploads/${img}`}
                        width={80}
                        height={60}
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        className="rounded"
                    />
                ))}
            </div>
        </div>
    );
}

export default PostImages;
