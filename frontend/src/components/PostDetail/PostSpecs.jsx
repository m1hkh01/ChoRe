import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip } from "@fortawesome/free-solid-svg-icons";
import "@/assets/PostSpecs.css";

function PostSpecs({ specs }) {
    if (!specs || specs.length === 0) return null;

    return (
        <div className="specs-card">
            {/* Header */}
            <div className="specs-header">
                {/* <div className="specs-icon">
                    <FontAwesomeIcon icon={faMicrochip} />
                </div> */}
                <h2 className="specs-title">Thông số kỹ thuật</h2>
            </div>

            <div className="specs-divider"></div>

            {/* Specs Table */}
            <div className="specs-table">
                {specs.map((s, i) => (
                    <div key={i} className="spec-row">
                        <div className="spec-label">{s.specName}</div>
                        <div className="spec-value">{s.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostSpecs;