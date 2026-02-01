using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class ChatRoom
    {
        [Key]
        public int ChatRoomId { get; set; }

        [Required(ErrorMessage = "Người mua là bắt buộc")]
        public int BuyerId { get; set; }

        [Required(ErrorMessage = "Người bán là bắt buộc")]
        public int SellerId { get; set; }
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }
        public int? CurrentEscrowTransId { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime? LastMessageAt { get; set; }
        public string? LastMessageContent { get; set; }

        // Navigation properties
        public virtual User? Buyer { get; set; }
        public virtual User? Seller { get; set; }
        public virtual Post? Post { get; set; }
        public virtual ICollection<ChatMessage>? ChatMessages { get; set; }
        public virtual EscrowTransation? CurrentEscrow { get; set; }

    }
}
