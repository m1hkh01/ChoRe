using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class EscrowTransStatus
    {
        [Key]
        public int EscTransStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string StatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<EscrowTransation> EscrowTransations { get; set; }
    }

}
