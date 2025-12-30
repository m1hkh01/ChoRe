using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Specification
    {
        [Key]
        public int SpecId { get; set; }

        [Required(ErrorMessage = "Tên thông số là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên thông số không được vượt quá 100 ký tự")]
        public string SpecName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [ForeignKey("Category")]
        [Required(ErrorMessage = "Danh mục là bắt buộc")]
        public int CateId { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual ICollection<PostSpecification> PostSpecifications { get; set; }
    }
}
