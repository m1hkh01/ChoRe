import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume, faXmark } from "@fortawesome/free-solid-svg-icons";
import "@/assets/FloatingContact.css";

export default function FloatingContact() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fc-wrapper">

            {/* Options */}
            {open && (
                <div className="fc-menu">
                    <a href="tel:19001234" className="fc-item">
                        <FontAwesomeIcon icon={faPhoneVolume} />
                        <span>0836 044 008</span>
                    </a>

                    <a
                        href="https://zalo.me/0836044008"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fc-item"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                            alt="Zalo"
                            className="fc-icon"
                        />
                        Zalo
                    </a>
                </div>
            )}

            {/* Main Button */}
            <button className="fc-button" onClick={() => setOpen(!open)}>
                <FontAwesomeIcon icon={open ? faXmark : faPhoneVolume} />
            </button>
        </div>
    );
}