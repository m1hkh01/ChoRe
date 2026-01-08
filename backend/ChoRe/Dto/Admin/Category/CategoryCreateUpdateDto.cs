using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto
{
    public class CategoryCreateUpdateDto
    {
        [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
        [StringLength(100)]
        public string CateName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }
    }
}
