using ChoRe.Models;

public class ConversationMessageDto
{
    public string? SenderName { get; set; }
    public string? SenderAvatar { get; set; }
    public PostConvertationDto? PostInfo { get; set; }
    public IEnumerable<MessageDto>? ChatMessages { set; get; }
}