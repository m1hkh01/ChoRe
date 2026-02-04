public class ResolveDisputeRequest
{
    public int EscrowTransId { get; set; }
    public int DisputeId { get; set; }
    public string? Decision { get; set; }
    public string? DecisionNote { get; set; }
    public int DisputeSatatus{ set; get; }
}
