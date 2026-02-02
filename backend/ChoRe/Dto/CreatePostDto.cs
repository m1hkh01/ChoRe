namespace ChoRe.Dto
{
    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }

        // ✅ THÊM MỚI
        public string PriceType { get; set; } // NEGOTIABLE, FIXED, RANGE

        // ✅ SỬA: Optional
        public decimal? Price { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public int BrandId { get; set; }
        public List<int> CateIds { get; set; }
        public Dictionary<int, string> Specifications { get; set; }
        public List<string> Images { get; set; }
    }
}