using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ChoRe.Models;

public class Review
{
    [Key]
    public int ReviewId { get; set; }
    public int Rating { get; set; }
    [Required]
    [MaxLength(1000, ErrorMessage = "đánh giá không được vượt quá 1000 ký tự")]
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public ReviewType ReviewType { get; set; }

    [ForeignKey("Reviewer")]
    public int ReviewerId { get; set; }
    [ForeignKey("Seller")]
    public int SellerId { get; set; }
    [ForeignKey("ChatRoom")]
    public int ChatRoomId { get; set; }
    [ForeignKey("Post")]
    public int? PostId { get; set; }
    [ForeignKey("Order")]
    public int? OrderId { get; set; }

    // Navigation properties
    public virtual User? Reviewer { get; set; }
    public virtual User? Seller { get; set; }
    public virtual ChatRoom? ChatRoom { get; set; }
    public virtual Post? Post { get; set; }
    public virtual EscrowTransation? Order { get; set; }
    public virtual ICollection<ReviewImage> ReviewImages { get; set; } = new List<ReviewImage>();
    public virtual ICollection<ReviewTag> ReviewTags { get; set; } = new List<ReviewTag>();
}

public enum ReviewType
{
    ChatOnly = 0,        // chỉ chat đủ điều kiện
    CompletedOrder = 1   // đã giao dịch hoàn tất
}