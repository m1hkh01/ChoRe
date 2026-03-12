using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class SubscriptionOrder
    {
        [Key]
        public int OrderId { get; set; }

        [Required(ErrorMessage = "Mã đơn hàng là bắt buộc")]
        [StringLength(50, ErrorMessage = "Mã đơn hàng không được vượt quá 50 ký tự")]
        public string OrderCode { get; set; }

        [Required(ErrorMessage = "Người dùng là bắt buộc")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Gói dịch vụ là bắt buộc")]
        public int SubPlanId { get; set; }

        [Required(ErrorMessage = "Số tiền là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Trạng thái đơn hàng là bắt buộc")]
        public int OrdStatusId { get; set; } = EscrowStatus.PendingPayment;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PaidAt { get; set; }

        public DateTime? ExpiredAt { get; set; }
        public string? PaymentMessage { get; set; }

        // ======================
        // Navigation properties
        // ======================
        public virtual User User { get; set; }
        public virtual SubscriptionPlan SubscriptionPlan { get; set; }
        public virtual EscrowTransStatus OrderStatus{ get; set; }
    }
}