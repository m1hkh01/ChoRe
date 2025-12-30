using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class PostSpecification
    {
        [Key]
        public int PostSpecId { get; set; }

        [ForeignKey("Post")]
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }

        [ForeignKey("Specification")]
        [Required(ErrorMessage = "Thông số là bắt buộc")]
        public int SpecId { get; set; }

        [Required(ErrorMessage = "Giá trị là bắt buộc")]
        [StringLength(255, ErrorMessage = "Giá trị không được vượt quá 255 ký tự")]
        public string SpecValue { get; set; }

        // Navigation properties
        public virtual Post Post { get; set; }
        public virtual Specification Specification { get; set; }
    }
}
