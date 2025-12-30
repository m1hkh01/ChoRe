using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class EscrowStatus
    {
        [Key]
        public int EscStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string EscStatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<Escrow> Escrows { get; set; }
    }
}
