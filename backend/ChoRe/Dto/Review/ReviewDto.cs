public class ReviewDto
{
    public int? ReviewId { get; set; }
    // public int? ReviewerId { get; set; }
    // public string? ReviewerName { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public ReviewType ReviewType { get; set; }
    public List<ReviewTagDto> ReviewTags { get; set; } = new List<ReviewTagDto>();
    public DateTime? CreatedAt { get; set; }
    public List<ReviewImageDto> ReviewImages { get; set; } = new List<ReviewImageDto>();
    public ReviewerDto Reviewer { get; set; } = new ReviewerDto();
}