using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ReviewImage
{
    [Key]
    public int ReviewImageId { get; set; }

    [Required]
    [StringLength(255)]
    public string ImageUrl { get; set; }

    // Foreign key
    [ForeignKey("Review")]
    public int ReviewId { get; set; }

    // Navigation property
    public virtual Review Review { get; set; }
}