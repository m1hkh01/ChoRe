using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class MessageImage
    {
        [Key]
        public int MessageImgId { get; set; }

        [Required(ErrorMessage = "Đường dẫn ảnh là bắt buộc")]
        [StringLength(255)]
        public string ImageUrl { get; set; }

        [ForeignKey("ChatMessage")]
        [Required(ErrorMessage = "Tin nhắn là bắt buộc")]
        public int ChatMessId { get; set; }

        // Navigation properties
        public virtual ChatMessage ChatMessage { get; set; }
    }
}
