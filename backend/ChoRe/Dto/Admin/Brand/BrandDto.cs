public class BrandTreeDto
{
    public int BrandId { get; set; }
    public string BrandName { get; set; }

    public List<BrandTreeDto> SubBrands { get; set; }
}