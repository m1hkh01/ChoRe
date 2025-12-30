using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class PostRepStatus
    {
        [Key]
        public int PostRepStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string PostRepStatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<PostReport> PostReport { get; set; }
    }
}
