using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class DisputeStatus
    {
        [Key]
        public int DisStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string DisStatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<Dispute> Disputes { get; set; }
    }
}
public static class DisStatus
{
    public const int Processing = 1;
    public const int Refunded = 2;
    public const int Rejected = 3;

}