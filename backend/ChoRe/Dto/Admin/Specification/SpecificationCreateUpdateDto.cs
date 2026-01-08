using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto
{
    public class SpecificationCreateUpdateDto
    {
        [Required(ErrorMessage = "Tên thông số là bắt buộc")]
        [StringLength(100)]
        public string SpecName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [Required(ErrorMessage = "Danh mục là bắt buộc")]
        public int CateId { get; set; }
    }
}
