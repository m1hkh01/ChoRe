using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [ForeignKey("BuyerUser")]
        [Required(ErrorMessage = "Người mua là bắt buộc")]
        public int BuyerUserId { get; set; }

        [ForeignKey("SellerUser")]
        [Required(ErrorMessage = "Người bán là bắt buộc")]
        public int SellerUserId { get; set; }

        [ForeignKey("Post")]
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }

        [ForeignKey("OrderStatus")]
        [Required(ErrorMessage = "Trạng thái đơn hàng là bắt buộc")]
        public int OrdStatusId { get; set; }

        public bool IsShippedBySeller { get; set; } = false;

        public bool IsReceivedByBuyer { get; set; } = false;

        public DateTime CreateAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User BuyerUser { get; set; }
        public virtual User SellerUser { get; set; }
        public virtual Post Post { get; set; }
        public virtual OrderStatus OrderStatus { get; set; }
        public virtual Escrow Escrow { get; set; }
        public virtual ICollection<Dispute> Disputes { get; set; }
    }
}
