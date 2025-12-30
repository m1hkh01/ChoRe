using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class Brand
    {
        [Key]
        public int BrandId { get; set; }

        [Required(ErrorMessage = "Tên thương hiệu là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên thương hiệu không được vượt quá 100 ký tự")]
        public string BrandName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(255)]
        public string BrandLogo { get; set; }

        // Navigation properties
        public virtual ICollection<Post> Posts { get; set; }
        public virtual ICollection<BrandCate> BrandCates { get; set; }
    }
}
