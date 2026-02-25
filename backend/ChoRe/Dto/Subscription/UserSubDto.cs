using ChoRe.Models;

public class UserSubDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? ExpiredAt { get; set; }
    // usage
    public int RemainingSubPost { get; set; }
    public int RemainingFreePost { get; set; }
    public decimal RemainingSubFPF { get; set; }
    public SubPlanDto? subscriptionPlanDto { get; set; }
}