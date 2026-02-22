public class UpdateReviewRequest
{
    public int Rating { get; set; }
    public string Comment { get; set; }
    public int ReviewerId { get; set; }

    public List<string>? Tags { get; set; }

    public List<string>? ExistingImageUrls { get; set; }  // Ảnh muốn giữ lại
    public List<IFormFile>? Files { get; set; }           // Ảnh mới
}