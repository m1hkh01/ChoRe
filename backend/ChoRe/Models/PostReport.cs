using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class PostReport
    {
        [Key]
        public int ReportId { get; set; }
        [Required]

        public int ReportedFromUserId { get; set; }

        public int? ReportedPostId { get; set; }

        [Required(ErrorMessage = "Lý do báo cáo là bắt buộc")]
        [StringLength(1000)]
        public string Reason { get; set; }

        [Required(ErrorMessage = "Hình ảnh báo cáo là bắt buộc")]
        [StringLength(255)]
        public string ReportImage { get; set; }

        [Required]
        public int PostRepStatusId { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey(nameof(ReportedFromUserId))]
        public virtual User ReportedUser { get; set; }

        [ForeignKey(nameof(ReportedPostId))]
        public virtual Post ReportedPost { get; set; }

        [ForeignKey(nameof(PostRepStatusId))]
        public virtual PostRepStatus PostRepStatus { get; set; }
    }
}
