using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class EscrowTransation
    {
        [Key]
        public int EscrowTransId { get; set; }

        [ForeignKey("BuyerUser")]
        [Required(ErrorMessage = "Người mua là bắt buộc")]
        public int BuyerUserId { get; set; }

        [ForeignKey("SellerUser")]
        [Required(ErrorMessage = "Người bán là bắt buộc")]
        public int SellerUserId { get; set; }

        [ForeignKey("Post")]
        [Required(ErrorMessage = "Bài đăng là bắt buộc")]
        public int PostId { get; set; }

        [ForeignKey("EscrowTransStatus")]
        [Required(ErrorMessage = "Trạng thái đơn hàng là bắt buộc")]
        public int EscrowTransStatusId { get; set; }

        [Required(ErrorMessage = "Tổng tiền là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0")]
        public decimal TotalAmount { get; set; }

        [Required(ErrorMessage = "Giá sản phẩm là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm phải lớn hơn hoặc bằng 0")]
        public decimal PostPrice { get; set; }

        [Required(ErrorMessage = "Phí là bắt buộc")]
        [Range(0, double.MaxValue, ErrorMessage = "Phí sàn phải lớn hơn hoặc bằng 0")]
        public decimal PlatformFee { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime ExpiredAt { get; set; } = DateTime.Now.AddHours(1);
        public bool BuyerConfirmed { get; set; } = false;
        public bool SellerConfirmed { get; set; } = false;
        public string? TransactionOrderCode{ get; set; }


        // Navigation properties
        public virtual User BuyerUser { get; set; }
        public virtual User SellerUser { get; set; }
        public virtual Post Post { get; set; }
        public virtual EscrowTransStatus EscrowTransStatus { get; set; }
        public virtual Dispute Disputes { get; set; }
        public virtual ChatMessage ChatMessage { get; set; }
    }
}
