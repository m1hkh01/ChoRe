public class SubscriptionPlanDto
{
    public int SubPlanId { get; set; }
    public string SubPlanName { get; set; }
    public string SubPlanTitle { get; set; }
    public string? SubPlanPromo { get; set; }
    public decimal SubPlanPrice { get; set; }
    public int DurationDays { get; set; }
    public int MaxPostPerSub { get; set; }
    public decimal MaxFreePlatformFeePerSub { get; set; }
    public decimal MaxFreePost { get; set; }
    public bool IsActive { get; set; }
}
