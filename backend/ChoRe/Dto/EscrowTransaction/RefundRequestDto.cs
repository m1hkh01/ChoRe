public class RefundRequestDto
{
    public int EscrowTransId { get; set; }
    public int OpenedByUserId { get; set; }
    public string? DisputeReason{ get; set; }
}