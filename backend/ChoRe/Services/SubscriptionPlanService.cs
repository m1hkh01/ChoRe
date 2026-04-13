using ChoRe.Data;
using ChoRe.Models;
using Microsoft.EntityFrameworkCore;

public class SubscriptionPlanService : ISubscriptionPlanService
{
    private readonly AppDbContext _context;

    public SubscriptionPlanService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SubscriptionPlanDto>> GetAllAsync()
    {
        return await _context.SubscriptionPlans
            .OrderByDescending(x => x.SubPlanId)
            .Select(x => new SubscriptionPlanDto
            {
                SubPlanId = x.SubPlanId,
                SubPlanName = x.SubPlanName,
                SubPlanTitle = x.SubPlanTitle,
                SubPlanPromo = x.SubPlanPromo,
                SubPlanPrice = x.SubPlanPrice,
                DurationDays = x.DurationDays,
                MaxPostPerSub = x.MaxPostPerSub,
                MaxFreePlatformFeePerSub = x.MaxFreePlatformFeePerSub,
                MaxFreePost = x.MaxFreePost,
                FeaturedPriority = x.FeaturedPriority,
                MaxFeaturedPosts = x.MaxFeaturedPosts,
                FeaturedDurationDays = x.FeaturedDurationDays,
                IsActive = x.IsActive
            }).ToListAsync();
    }

    public async Task CreateAsync(CreateUpdateSubscriptionPlanDto dto)
    {
        var plan = new SubscriptionPlan
        {
            SubPlanName = dto.SubPlanName,
            SubPlanTitle = dto.SubPlanTitle,
            SubPlanPromo = dto.SubPlanPromo,
            SubPlanPrice = dto.SubPlanPrice,
            DurationDays = dto.DurationDays,
            MaxPostPerSub = dto.MaxPostPerSub,
            MaxFreePlatformFeePerSub = dto.MaxFreePlatformFeePerSub,
            MaxFreePost = dto.MaxFreePost,
            FeaturedPriority = dto.FeaturedPriority,
            MaxFeaturedPosts = dto.MaxFeaturedPosts,
            FeaturedDurationDays = dto.FeaturedDurationDays,
            IsActive = true
        };

        _context.SubscriptionPlans.Add(plan);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, CreateUpdateSubscriptionPlanDto dto)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) throw new Exception("Không tìm thấy gói");
        Console.WriteLine("FeateredPriority in DTO: " + dto.FeaturedPriority);
        plan.SubPlanName = dto.SubPlanName;
        plan.SubPlanTitle = dto.SubPlanTitle;
        plan.SubPlanPromo = dto.SubPlanPromo;
        plan.SubPlanPrice = dto.SubPlanPrice;
        plan.DurationDays = dto.DurationDays;
        plan.MaxPostPerSub = dto.MaxPostPerSub;
        plan.MaxFreePlatformFeePerSub = dto.MaxFreePlatformFeePerSub;
        plan.MaxFreePost = dto.MaxFreePost;
        plan.FeaturedPriority = dto.FeaturedPriority;
        plan.MaxFeaturedPosts = dto.MaxFeaturedPosts;
        plan.FeaturedDurationDays = dto.FeaturedDurationDays;

        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(int id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return;

        _context.SubscriptionPlans.Remove(plan);
        await _context.SaveChangesAsync();
    }

    public async Task ToggleAsync(int id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) throw new Exception("Không tìm thấy gói");

        plan.IsActive = !plan.IsActive;
        await _context.SaveChangesAsync();
    }
}
