public class PostAllDto
{
    public int PostId { get; set; }
    public int? BrandId { get; set; }
    public string Title { get; set; }
    public string Address { get; set; }
    public DateTime CreatedAt { get; set; }

    public string PriceType { get; set; }
    public decimal? Price { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    public string UserName { get; set; }
    public string? Thumbnail { get; set; }
    public string ShortDescription { get; set; }
}
