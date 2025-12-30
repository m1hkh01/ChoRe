using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class Category
    {
        [Key]
        public int CateId { get; set; }

        [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên danh mục không được vượt quá 100 ký tự")]
        public string CateName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<Post> Posts { get; set; }
        public virtual ICollection<BrandCate> BrandCates { get; set; }
        public virtual ICollection<PostCate> PostCates { get; set; }
        public virtual ICollection<Specification> Specifications { get; set; }
    }
}
