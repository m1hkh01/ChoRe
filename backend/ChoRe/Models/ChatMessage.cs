using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class ChatMessage
    {
        [Key]
        public int ChatMessId { get; set; }

        [ForeignKey("ChatRoom")]
        [Required(ErrorMessage = "Phòng chat là bắt buộc")]
        public int ChatRoomId { get; set; }

        [ForeignKey("FromUser")]
        [Required(ErrorMessage = "Người gửi là bắt buộc")]
        public int FromUserId { get; set; }

        [Required(ErrorMessage = "Nội dung là bắt buộc")]
        [StringLength(5000, ErrorMessage = "Nội dung không được vượt quá 5000 ký tự")]
        public string ChatContent { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual ChatRoom ChatRoom { get; set; }
        public virtual User FromUser { get; set; }
        public virtual ICollection<MessageImage> MessageImages { get; set; }
    }
}
