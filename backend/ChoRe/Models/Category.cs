using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        // Foreign key for parent category (nullable for root categories)
        public int? ParentCateId { get; set; }

        // Navigation properties

        // Self-referencing relationship
        [ForeignKey("ParentCateId")]
        public virtual Category ParentCategory { get; set; }

        public virtual ICollection<Category> SubCategories { get; set; }

        public virtual ICollection<Post> Posts { get; set; }
        public virtual ICollection<BrandCate> BrandCates { get; set; }
        public virtual ICollection<PostCate> PostCates { get; set; }
        public virtual ICollection<Specification> Specifications { get; set; }
    }
}