using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class SubscriptionPlan
    {
        [Key]
        public int SubPlanId { get; set; }

        [Required(ErrorMessage = "Tên gói là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên gói không được vượt quá 100 ký tự")]
        public string SubPlanName { get; set; }

        [Required(ErrorMessage = "Giá gói là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubPlanPrice { get; set; }

        [Required(ErrorMessage = "Số ngày là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Số ngày phải lớn hơn 0")]
        public int DurationDays { get; set; }

        [Required(ErrorMessage = "Số bài đăng tối đa là bắt buộc")]
        [Range(0, int.MaxValue, ErrorMessage = "Số bài đăng phải lớn hơn hoặc bằng 0")]
        public int MaxPostPerSub { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phí miễn phí tối đa phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MaxFreePlatformFeePerSub { get; set; }

        // Navigation properties
        public virtual ICollection<UserSubscription> UserSubscriptions { get; set; }
    }
}
