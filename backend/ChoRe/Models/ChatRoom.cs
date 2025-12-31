using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class ChatRoom
    {
        [Key]
        public int ChatRoomId { get; set; }

        [Required(ErrorMessage = "Người dùng 1 là bắt buộc")]
        public int User1Id { get; set; }

        [Required(ErrorMessage = "Người dùng 2 là bắt buộc")]
        public int User2Id { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User? User1 { get; set; }
        public virtual User? User2 { get; set; }
        public virtual ICollection<ChatMessage>? ChatMessages { get; set; }
    }
}
