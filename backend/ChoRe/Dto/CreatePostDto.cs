using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto
{
    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Address { get; set; }

        public int BrandId { get; set; }
        public List<int> CateIds { get; set; }

        public string Status { get; set; }

        public Dictionary<int, string>? Specifications { get; set; }
        public List<string>? Images { get; set; }
    }
}
