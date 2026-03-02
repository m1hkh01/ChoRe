namespace ChoRe.Dto
{
    public class UpdatePostDTO
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public decimal? Price { get; set; }

        public string PriceType { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }
    }
}
