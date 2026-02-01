// utils/alert.js
import Swal from "sweetalert2";

export const successAlert = (msg) =>
    Swal.fire({
        icon: "success",
        title: "Thành công",
        text: msg,
        buttonsStyling: false,
        customClass: {
            confirmButton:
                "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
        },
    });

export const errorAlert = (msg) =>
    Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: msg,
        buttonsStyling: false,
        customClass: {
            confirmButton:
                "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        },
    });

