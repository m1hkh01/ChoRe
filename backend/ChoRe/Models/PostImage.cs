using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class PostImage
    {
        [Key]
        public int PostImgId { get; set; }

        [ForeignKey("Post")]
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }

        [Required(ErrorMessage = "Đường dẫn ảnh là bắt buộc")]
        [StringLength(255)]
        public string PostImage1 { get; set; }

        // Navigation properties
        public virtual Post Post { get; set; }
    }
}
