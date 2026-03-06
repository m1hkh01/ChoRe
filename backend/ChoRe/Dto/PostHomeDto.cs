public class PostHomeDto
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string ShortDescription { get; set; }

    // ✅ THÊM KIỂU GIÁ
    public string PriceType { get; set; }
    public decimal? Price { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    // ✅ THÊM: Để hiển thị giá formatted
    public string PriceDisplay { get; set; }

    public string Address { get; set; }

    public string UserName { get; set; }
    public string Thumbnail { get; set; }
    public bool IsSaved { get; set; }
    public DateTime CreatedAt { get; set; }
}