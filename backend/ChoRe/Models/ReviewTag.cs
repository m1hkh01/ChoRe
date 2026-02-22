public class ReviewTag
{
    public int ReviewTagId { get; set; }

    public int ReviewId { get; set; }
    public Review Review { get; set; } = null!;

    public string Tag { get; set; } = null!;
}