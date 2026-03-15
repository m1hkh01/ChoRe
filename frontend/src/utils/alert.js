import Swal from "sweetalert2";

// ── Global CSS override — chỉ chạy 1 lần ──────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("swal-override")) {
  const style = document.createElement("style");
  style.id = "swal-override";
  style.textContent = `
    .swal2-close {
      display: flex !important;
      visibility: visible !important;
      opacity: 0.5;
      font-size: 1.6rem;
      color: #6b7280;
      transition: opacity 0.15s, color 0.15s;
    }
    .swal2-close:hover {
      opacity: 1;
      color: #111827;
    }
  `;
  document.head.appendChild(style);
}

// ── Base config ───────────────────────────────────────────────────────────────

const BASE = {
  showCloseButton: true,
  buttonsStyling:  false,
};

// ── Exports ───────────────────────────────────────────────────────────────────

export const successAlert = (msg) =>
  Swal.fire({
    ...BASE,
    icon:  "success",
    title: "Thành công",
    text:  msg,
    customClass: {
      confirmButton: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
    },
  });

export const errorAlert = (msg) =>
  Swal.fire({
    ...BASE,
    icon:  "error",
    title: "Thất bại",
    text:  msg,
    customClass: {
      confirmButton: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
    },
  });