using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ChoRe.Models;

public class ReportReview
{
    [Key]
    public int ReportReviewId { get; set; }
    [Required]
    public string Reason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    [ForeignKey("Review")]
    public int ReviewId { get; set; }
    [ForeignKey("Reporter")]
    public int ReporterId { get; set; }
    // Navigation properties
    public virtual Review Review { get; set; }
    public virtual User Reporter { get; set; }
}