public class UserSubscriptionDto
{
    public int UserSubId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }

    public string SubPlanName { get; set; }
    public decimal SubPlanPrice { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }

    // usage
    public int RemainingSubPost { get; set; }
    public int RemainingFreePost { get; set; }
    public decimal RemainingSubFPF { get; set; }
}
