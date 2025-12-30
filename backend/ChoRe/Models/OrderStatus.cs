using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class OrderStatus
    {
        [Key]
        public int OrdStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string OrdStatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<Order> Orders { get; set; }
    }

}
