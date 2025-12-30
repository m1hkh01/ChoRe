using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Escrow
    {
        [Key]
        public int EscrowId { get; set; }

        [ForeignKey("Order")]
        [Required(ErrorMessage = "Đơn hàng là bắt buộc")]
        public int OrderId { get; set; }

        [Required(ErrorMessage = "Tổng tiền là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required(ErrorMessage = "Giá sản phẩm là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PostPrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phí nền tảng phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PlatformFee { get; set; }

        [ForeignKey("EscrowStatus")]
        [Required(ErrorMessage = "Trạng thái ký quỹ là bắt buộc")]
        public int EscStatusId { get; set; }

        // Navigation properties
        public virtual Order Order { get; set; }
        public virtual EscrowStatus EscrowStatus { get; set; }
    }
}
