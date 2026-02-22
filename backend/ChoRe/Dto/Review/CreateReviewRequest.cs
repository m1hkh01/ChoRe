public class CreateReviewRequest
{
    public int ReviewerId { get; set; }
    public int SellerId { get; set; }
    public int ChatRoomId { get; set; }
    public int? PostId { get; set; }
    public int? TransactionId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public List<IFormFile>? Files { get; set; }
}