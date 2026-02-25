public class CreateUpdateSubscriptionPlanDto
{
    public string SubPlanName { get; set; }
    public string SubPlanTitle { get; set; }
    public string? SubPlanPromo { get; set; }
    public decimal SubPlanPrice { get; set; }
    public int DurationDays { get; set; }
    public int MaxPostPerSub { get; set; }
    public int MaxFreePlatformFeePerSub { get; set; }
    public int MaxFreePost { get; set; }
}
