using System.ComponentModel.DataAnnotations.Schema;
using ChoRe.Models;

public class Notification
{
    public int Id { get; set; }
    [ForeignKey("User")]
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; }
    public int RelatedId { get; set; } //TransactionId / PostId
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; }

}
public enum NotificationType
{
    Transaction,
    PostApproved,
    PostRejected,
    PendingPayment,
    PendingPaymentPackage,
    // PaymentReceived,
    AwaitingEvidence,
    Confirming,
    ReviewReminder
}