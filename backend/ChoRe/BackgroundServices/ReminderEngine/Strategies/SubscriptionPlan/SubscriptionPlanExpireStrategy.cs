using ChoRe.Data;
using ChoRe.Models;
using Microsoft.EntityFrameworkCore;

public class SubscriptionPlanExpireStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var expiredSubscriptions = await context.UserSubscriptions
            .Include(x => x.SubscriptionPlan)
            .Where(x => x.IsActive && x.EndDate < DateTime.UtcNow)
            .ToListAsync(token);

        if (!expiredSubscriptions.Any())
            return;

        var freePlan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(x => x.SubPlanId == 1 && x.IsActive, token); // Gói Free

        if (freePlan == null)
            throw new Exception("Không tìm thấy gói Free.");

        foreach (var sub in expiredSubscriptions)
        {
            var userSubUsage = await context.UserSubUsages.FirstOrDefaultAsync(x => x.UserId == sub.UserId, token);
            if (userSubUsage != null){
                userSubUsage.RemainingSubPost = freePlan.MaxPostPerSub;
                userSubUsage.RemainingFreePost = freePlan.MaxFreePost;
                userSubUsage.RemainingSubFPF = freePlan.MaxFreePlatformFeePerSub;
                userSubUsage.RemainingFeaturedPosts = freePlan.MaxFeaturedPosts;
                userSubUsage.FeaturedDurationDays = freePlan.FeaturedDurationDays;
                userSubUsage.FeaturedPriority = freePlan.FeaturedPriority;
            }
            sub.SubPlanId = freePlan.SubPlanId;
            sub.StartDate = DateTime.UtcNow;
            sub.EndDate = null; // Free không hết hạn nếu muốn
        }

        await context.SaveChangesAsync(token);
    }
}