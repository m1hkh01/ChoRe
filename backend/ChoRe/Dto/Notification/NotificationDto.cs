public class NotificationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public NotificationType Type { get; set; }
    public int RelatedId { get; set; } //TransactionId / PostId
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}