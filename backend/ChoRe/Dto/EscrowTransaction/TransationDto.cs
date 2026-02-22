public class TransactionDto
{
    public int ChatRoomId{ get; set; }
    public int TransactionId { get; set; }

    // Post
    public int PostId { get; set; }
    public string? PostImage { get; set; }
    public string? PostTitle { get; set; }
    public decimal Amount { get; set; }
    public decimal PlatformFee { get; set; }
    public decimal PostPrice { get; set; }
    // User
    public int SellerId { get; set; }
    public string? SellerName { get; set; }
    public int BuyerId { get; set; }
    public string? BuyerName { get; set; }
    // public string? Role{ get; set; } // vai trò của ng dùng vd: người mua / bán

    // Trạng thái / thời gian
    public DateTime CreateAt{ get; set; }
    public DateTime ExpiredAt { get; set; }
    public string? Status { get; set; }
    public string? StatusDescription { get; set; }
    public bool IsRated { get; set; }

    // Xác nhận
    public bool BuyerConfirmed { get; set; }
    public bool SellerConfirmed { get; set; }
    public string? TransactionOrderCode { get; set; }

    // Dispute
    public int DisputeId{ get; set; }
    public string? DisputeReason { get; set; }
    public string? DisputeStatus { get; set; }
    public IEnumerable<DisEvidenceGroupDto>? DisEvidence { get; set; }
    // Review
    public ReviewDto? Review { get; set; }
}
