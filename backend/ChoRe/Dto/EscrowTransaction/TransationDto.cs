public class TransactionDto
{
    public int ChatRoomId{ get; set; }
    public int TransactionId { get; set; }
    public int PostId { get; set; }
    public int SellerId { get; set; }
    public string? SellerName { get; set; }
    public int BuyerId { get; set; }
    public string? BuyerName{ get; set; }
    public decimal Amount { get; set; }
    public decimal PlatformFee { get; set; }
    public decimal PostPrice { get; set; }
    public DateTime CreateAt{ get; set; }
    public DateTime ExpiredAt { get; set; }
    public string? Status { get; set; }
    public string? StatusDescription { get; set; }

    public bool BuyerConfirmed { get; set; }
    public bool SellerConfirmed { get; set; }
    public string? TransactionOrderCode{ get; set; }

    public int DisputeId{ get; set; }
    public string? DisputeReason { get; set; }
    public IEnumerable<DisEvidenceGroupDto>? DisEvidence{ get; set; }
}
