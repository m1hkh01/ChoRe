namespace ChoRe.Dto
{
    public class PostHomeDto
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public decimal Price { get; set; }
        public string Address { get; set; }

        public string UserName { get; set; }
        public string? Thumbnail { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
