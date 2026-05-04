using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class EscrowTransStatus
    {
        [Key]
        public int EscTransStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string StatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<EscrowTransation> EscrowTransations { get; set; }
    }

}
public static class EscrowStatus
{
    public const int Confirming = 1;
    public const int PendingPayment = 2;
    public const int Paid = 3;
    public const int Cancelled = 4;
    public const int Expired = 5;
    public const int Completed = 6;
    public const int Disputing = 7;
    public const int RefundRequested = 8;
    public const int RefundRejected = 9;
    public const int Refunded = 10;
    public const int Shipped = 11;
}

