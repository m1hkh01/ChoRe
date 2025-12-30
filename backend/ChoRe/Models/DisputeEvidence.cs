using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class DisputeEvidence
    {
        [Key]
        public int DisEvidenceId { get; set; }

        [ForeignKey("Dispute")]
        [Required(ErrorMessage = "Tranh chấp là bắt buộc")]
        public int DisputeId { get; set; }

        [ForeignKey("SubmitByUser")]
        [Required(ErrorMessage = "Người nộp bằng chứng là bắt buộc")]
        public int SubmitByUserId { get; set; }

        [Required(ErrorMessage = "Liên kết file là bắt buộc")]
        [StringLength(255)]
        public string FileLink { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual Dispute Dispute { get; set; }
        public virtual User SubmitByUser { get; set; }
    }
}
