using ChoRe.Models;

public class PostResponseDto
{
    public int PostId { set; get; }
    public string? Title { set; get; }
    public string? Description { get; set; }

    // ✅ THÊM KIỂU GIÁ
    public string? PriceType { get; set; } // NEGOTIABLE, FIXED, RANGE

    // ✅ SỬA: Price có thể null
    public decimal? Price { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    public string? Address { get; set; }
    public string? CreatedAt { get; set; }
    public UserResponseDto? User { get; set; }
    public Brand? Brand { get; set; }
    public ICollection<PostCate>? PostCates { get; set; }
    public ICollection<PostImage>? PostImages { get; set; }
    public ICollection<PostSpecificationDto>? PostSpecificationsDto { get; set; }
}