public class PostConvertationDto
{
    public int PostId{ get; set; }
    public string? PostTitle { get; set; }
    public decimal? PostPrice { get; set; }
    public decimal? MinPrice{ get; set; }
    public decimal? MaxPrice{ get; set; }
    public string? PriceType{ get; set; }
    public string? PostImageUrl { get; set; }
    public int UserId{ get; set; }
}