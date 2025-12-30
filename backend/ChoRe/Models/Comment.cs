using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Comment
    {
        [Key]
        public int CmtId { get; set; }

        [ForeignKey("Post")]
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }

        [ForeignKey("User")]
        [Required(ErrorMessage = "Người dùng là bắt buộc")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Nội dung là bắt buộc")]
        [StringLength(1000, ErrorMessage = "Nội dung không được vượt quá 1000 ký tự")]
        public string Content { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual Post Post { get; set; }
        public virtual User User { get; set; }
    }
}
