public class ReviewDto
{
    public int? ReviewId { get; set; }
    // public int? ReviewerId { get; set; }
    // public string? ReviewerName { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public ReviewType ReviewType { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public List<ReviewImageDto> ReviewImages { get; set; } = new List<ReviewImageDto>();
}