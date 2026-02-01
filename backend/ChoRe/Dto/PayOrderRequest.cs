public class PayOrderRequest
{
    public string? OrderCode { get; set; }
    public int SellerId { get; set; }
    public int BuyerId { get; set; }
    public int PostId { get; set; }
    public string? ChatRoomId { get; set; }
}
