using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Dispute
    {
        [Key]
        public int DisputeId { get; set; }

        [ForeignKey("EscrowTransation")]
        [Required(ErrorMessage = "Giao dịch là bắt buộc")]
        public int EscrowTransId { get; set; }

        [ForeignKey("OpenedByUser")]
        [Required(ErrorMessage = "Người mở tranh chấp là bắt buộc")]
        public int OpenedByUserId { get; set; }

        [Required(ErrorMessage = "Lý do tranh chấp là bắt buộc")]
        [StringLength(1000, ErrorMessage = "Lý do không được vượt quá 1000 ký tự")]
        public string DisputeReason { get; set; }

        [ForeignKey("DisputeStatus")]
        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        public int StatusId { get; set; }

        [ForeignKey("AssignedByAdmin")]
        public int? AssignedByAdminUserId { get; set; }

        [StringLength(50)]
        public string Decision { get; set; } = "";

        [StringLength(1000)]
        public string DecisionNote { get; set; } = "";

        // bank info (copied from escrow when buyer requests refund)
        [StringLength(100)]
        public string? BankName { get; set; }
        [StringLength(50)]
        public string? BankNumber { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual EscrowTransation EscrowTransation { get; set; }
        public virtual User OpenedByUser { get; set; }
        public virtual User AssignedByAdmin { get; set; }
        public virtual DisputeStatus DisputeStatus { get; set; }
        public virtual ICollection<DisputeEvidence> DisputeEvidences { get; set; }
    }
}
