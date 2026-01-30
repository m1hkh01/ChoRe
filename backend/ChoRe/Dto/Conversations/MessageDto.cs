using ChoRe.Models;

public class MessageDto
{
    public int FromUserId { get; set; }
    public string? ChatContent { get; set; }
    public string? MessageType { get; set; }
    public DateTime? CreateAt{ get; set; }
    public List<MessageImageDto>? MessageImages { get; set; }
    public TransactionDto? Transaction { get; set; }

}