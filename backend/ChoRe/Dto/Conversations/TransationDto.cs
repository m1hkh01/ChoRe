public class TransactionDto
{
    public int PostId { get; set; }
    public int SellerId { get; set; }
    public int BuyerId{ get; set; }
    public decimal Amount { get; set; }
    public decimal PlatformFee { get; set; }
    // public string Status { get; set; }
    public DateTime? ExpiredAt { get; set; }

    public bool BuyerConfirmed { get; set; }
    public bool SellerConfirmed { get; set; }

    public string? Status{ get; set; }
}
