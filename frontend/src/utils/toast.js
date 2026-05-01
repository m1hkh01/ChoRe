import Swal from "sweetalert2";

export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",          // góc phải trên
    zindex: 9999,                // ưu tiên hiển thị trên cùng
    showConfirmButton: false,
    timer: 1000,                  // 3 giây
    timerProgressBar: true,       // thanh thời gian
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
