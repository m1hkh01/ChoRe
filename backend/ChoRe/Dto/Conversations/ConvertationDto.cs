public class ConversationDto
{
    public int ChatRoomId { get; set; }
    public int BuyerId { get; set; }
    public int SellerId { get; set; }
    public int PostId { get; set; }
    public int SenderId { get; set; }

    public string? LastMessageContent { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public string? SenderName { get; set; }
    public string? SenderAvatar { get; set; }
    public PostConvertationDto? PostInfo { get; set; }
}