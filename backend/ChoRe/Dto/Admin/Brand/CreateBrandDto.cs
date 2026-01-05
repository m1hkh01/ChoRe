using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto.Admin
{
    public class CreateBrandDto
    {
        [Required(ErrorMessage = "Tên thương hiệu là bắt buộc")]
        [StringLength(100)]
        public string BrandName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public List<int> CateIds { get; set; }
    }
}
