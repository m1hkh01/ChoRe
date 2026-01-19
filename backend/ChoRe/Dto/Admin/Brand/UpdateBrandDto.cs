using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto.Admin
{
    public class UpdateBrandDto
    {
        [Required]
        public string BrandName { get; set; }

        public string Description { get; set; }
        public int? ParentBrandId { get; set; }
        public List<int> CateIds { get; set; }
    }
}
