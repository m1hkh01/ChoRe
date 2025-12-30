using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class UserSubscription
    {
        [Key]
        public int UserSubId { get; set; }

        [ForeignKey("User")]
        [Required(ErrorMessage = "Người dùng là bắt buộc")]
        public int UserId { get; set; }

        [ForeignKey("SubscriptionPlan")]
        [Required(ErrorMessage = "Gói dịch vụ là bắt buộc")]
        public int SubPlanId { get; set; }

        [Required(ErrorMessage = "Ngày bắt đầu là bắt buộc")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc là bắt buộc")]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual User User { get; set; }
        public virtual SubscriptionPlan SubscriptionPlan { get; set; }
    }
}
