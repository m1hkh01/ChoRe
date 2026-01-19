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
    [ForeignKey("Reviewer")]
    public int ReviewerId { get; set; }
    [ForeignKey("Seller")]
    public int SellerId { get; set; }
    [ForeignKey("ChatRoom")]
    public int ChatRoomId { get; set; }
    [ForeignKey("Post")]
    public int? PostId { get; set; }

    // Navigation properties
    public virtual User Reviewer { get; set; }
    public virtual User Seller { get; set; }
    public virtual ChatRoom ChatRoom { get; set; }
    public virtual Post Post { get; set; }
    public virtual ICollection<ReviewImage> ReviewImages { get; set; }
}