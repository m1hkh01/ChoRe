using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class UserSubUsage
    {
        [Key]
        public int UsuId { get; set; }

        [ForeignKey("User")]
        [Required(ErrorMessage = "Người dùng là bắt buộc")]
        public int UserId { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Phí còn lại phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal RemainingSubFPF { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Số bài còn lại phải lớn hơn hoặc bằng 0")]
        public int RemainingSubPost { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
    }
}
