public class SubPlanDto
{
    public int SubPlanId { get; set; }
    public string? SubPlanName { get; set; }
    public string? Title { get; set; }
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
    public int MaxPost { get; set; }
    public int MaxFreePost { get; set; }
    public int MaxFeaturedPosts { get; set; }
    public int MaxFreePlatform { get; set; }
}