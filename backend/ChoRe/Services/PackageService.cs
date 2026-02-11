using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

public interface IPackageService
{
    Task<List<SubscriptionPlan>> GetAllSubPlan();
    Task<UserSubscription?> GetSubPlanByUserId(int id);
    Task<SubscriptionOrder> CreateSubPlanOrder(int userId, SubscriptionPlan subscription);
    Task PaySubPlanOrder(UserSubUsage userSubUsage,UserSubscription userSubscription, string orderCode);
}
public class PackageService : IPackageService
{
    private readonly AppDbContext _context;
    public PackageService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<SubscriptionPlan>> GetAllSubPlan()
    {
        return await _context.SubscriptionPlans.ToListAsync();
    }

    public async Task<UserSubscription?> GetSubPlanByUserId(int id)
    {
        return await _context.UserSubscriptions
                            .Include(usSub => usSub.User)
                            .Include(usSub => usSub.SubscriptionPlan)
                            .FirstOrDefaultAsync(usSub => usSub.UserId == id);
    }

    public async Task<SubscriptionOrder> CreateSubPlanOrder(int userId, SubscriptionPlan subscription)
    {
        var datePart = DateTime.Now.ToString("yyyyMMdd-HHmmss");
        var randomPart = Guid.NewGuid().ToString("N")[..4].ToUpper();
        var orderCode = $"SUB-{userId}-{datePart}-{randomPart}";
        var now = DateTime.UtcNow;
        var subPlanOrder = new SubscriptionOrder
        {
            OrderCode = orderCode,
            UserId = userId,
            SubPlanId = subscription.SubPlanId,
            Amount = subscription.SubPlanPrice,
            OrdStatusId = 1,//Pending
            CreatedAt = now,
            ExpiredAt = now.AddMinutes(15)
        };
        _context.SubscriptionOrders.Add(subPlanOrder);
        await _context.SaveChangesAsync();
        return subPlanOrder;
    }

    public async Task PaySubPlanOrder(UserSubUsage userSubUsage, UserSubscription userSubscription,string orderCode)
    {
        var subOrder = await _context.SubscriptionOrders.Include(subOrd=>subOrd.SubscriptionPlan).FirstOrDefaultAsync(subOrd => subOrd.OrderCode == orderCode);
        if (subOrder is null)
        {
            throw new KeyNotFoundException("Không tìm thấy đơn hàng");
        }
        subOrder.OrdStatusId = 2;

        var now = DateTime.UtcNow;
        subOrder.PaidAt = now;

        userSubscription.SubPlanId = subOrder.SubPlanId;
        userSubscription.StartDate = now;
        userSubscription.EndDate = now.AddDays(subOrder.SubscriptionPlan.DurationDays);

        userSubUsage.RemainingSubFPF = subOrder.SubscriptionPlan.MaxFreePlatformFeePerSub;
        userSubUsage.RemainingFreePost = (int)subOrder.SubscriptionPlan.MaxFreePost;
        userSubUsage.RemainingSubPost = subOrder.SubscriptionPlan.MaxPostPerSub;

        await _context.SaveChangesAsync();
    }
}