public class RefundRequestDto
{
    public int EscrowTransId { get; set; }
    public int OpenedByUserId { get; set; }
    public string? DisputeReason { get; set; }

    // buyer's bank info to receive refund
    public string? BankCode { get; set; }
    public string? BankName { get; set; }
    public string? BankNumber { get; set; }
}