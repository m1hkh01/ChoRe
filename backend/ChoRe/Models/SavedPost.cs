using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class SavedPost
    {
        [Key]
        public int SavedPostId { get; set; }

        [ForeignKey("User")]
        [Required(ErrorMessage = "Người dùng là bắt buộc")]
        public int UserId { get; set; }

        [ForeignKey("Post")]
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Post Post { get; set; }
    }
}
