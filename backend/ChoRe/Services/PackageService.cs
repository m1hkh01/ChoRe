using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

public interface IPackageService
{
    Task<List<SubscriptionPlan>> GetAllSubPlan();
    Task<UserSubDto?> GetSubPlanByUserId(int id);
    Task<ServiceTransactionDto> CreateSubPlanOrder(int userId, SubscriptionPlan subscription);
    Task PaySubPlanOrder(UserSubUsage userSubUsage, UserSubscription userSubscription, string orderCode);
    Task<ServiceTransactionDto> GetServiceOrder(int id);
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

    public async Task<UserSubDto?> GetSubPlanByUserId(int id)
    {
        return await _context.UserSubscriptions
                            .Include(usSub => usSub.User)
                            .Include(usSub => usSub.SubscriptionPlan)
                            .Where(usSub => usSub.UserId == id)
                            .Select(uSub => new UserSubDto
                            {
                                StartDate = uSub.StartDate,
                                ExpiredAt = uSub.EndDate,
                                RemainingSubPost = uSub.User.UserSubUsage.RemainingSubPost,
                                RemainingFreePost = uSub.User.UserSubUsage.RemainingFreePost,
                                RemainingSubFPF = uSub.User.UserSubUsage.RemainingSubFPF,
                                RemainingFeaturedPosts = uSub.User.UserSubUsage.RemainingFeaturedPosts,
                                subscriptionPlanDto = new SubPlanDto
                                {
                                    SubPlanId = uSub.SubscriptionPlan.SubPlanId,
                                    SubPlanName = uSub.SubscriptionPlan.SubPlanName,
                                    Price = uSub.SubscriptionPlan.SubPlanPrice,
                                    DurationDays = uSub.SubscriptionPlan.DurationDays,
                                    MaxFreePost = uSub.SubscriptionPlan.MaxFreePost,
                                    MaxFreePlatform = uSub.SubscriptionPlan.MaxFreePlatformFeePerSub,
                                    MaxPost = uSub.SubscriptionPlan.MaxPostPerSub,
                                    MaxFeaturedPosts = uSub.SubscriptionPlan.MaxFeaturedPosts,
                                    Title = uSub.SubscriptionPlan.SubPlanTitle,
                                }
                            }).FirstOrDefaultAsync();
    }

    public async Task<ServiceTransactionDto> CreateSubPlanOrder(int userId, SubscriptionPlan subscription)
    {
        var existingOrder = await _context.SubscriptionOrders
                                .Include(s => s.SubscriptionPlan)
                                .FirstOrDefaultAsync(s =>
                                s.UserId == userId &&
                                s.SubPlanId == subscription.SubPlanId &&
                                s.OrdStatusId == EscrowStatus.PendingPayment);
        var now = DateTime.UtcNow;
        if (existingOrder != null)
        {
            existingOrder.CreatedAt = now;
            existingOrder.ExpiredAt = now.AddMinutes(15);

            await _context.SaveChangesAsync();


            return new ServiceTransactionDto
            {
                OrderId = existingOrder.OrderId,
                ServiceName = existingOrder.SubscriptionPlan.SubPlanName,
                ServiceCode = existingOrder.OrderCode,
                ServicePrice = existingOrder.Amount,
            };
        }

        var datePart = DateTime.Now.ToString("yyyyMMddHHmmss");
        var randomPart = Guid.NewGuid().ToString("N")[..4].ToUpper();
        var orderCode = $"SUB{userId}S{datePart}{randomPart}";
        var subPlanOrder = new SubscriptionOrder
        {
            OrderCode = orderCode,
            UserId = userId,
            SubPlanId = subscription.SubPlanId,
            Amount = subscription.SubPlanPrice,
            OrdStatusId = EscrowStatus.PendingPayment,
            CreatedAt = now,
            ExpiredAt = now.AddMinutes(15)
        };
        _context.SubscriptionOrders.Add(subPlanOrder);
        await _context.SaveChangesAsync();
        await _context.Entry(subPlanOrder).Reference(s => s.SubscriptionPlan).LoadAsync();

        var query = new ServiceTransactionDto
        {
            OrderId = subPlanOrder.OrderId,
            ServiceName = subPlanOrder.SubscriptionPlan.SubPlanName,
            ServiceCode = orderCode,
            ServicePrice = subPlanOrder.Amount,
        };

        return query;
    }

    public async Task PaySubPlanOrder(UserSubUsage userSubUsage, UserSubscription userSubscription, string orderCode)
    {
        var subOrder = await _context.SubscriptionOrders.Include(subOrd => subOrd.SubscriptionPlan).FirstOrDefaultAsync(subOrd => subOrd.OrderCode == orderCode);
        if (subOrder is null)
        {
            throw new KeyNotFoundException("Không tìm thấy đơn hàng");
        }
        subOrder.OrdStatusId = EscrowStatus.Paid;

        var now = DateTime.UtcNow;
        subOrder.PaidAt = now;
        subOrder.PaymentMessage = "Thanh toán thành công";


        userSubscription.SubPlanId = subOrder.SubPlanId;
        userSubscription.StartDate = now;
        userSubscription.EndDate = now.AddDays(subOrder.SubscriptionPlan.DurationDays);

        userSubUsage.RemainingSubFPF = subOrder.SubscriptionPlan.MaxFreePlatformFeePerSub;
        userSubUsage.RemainingFreePost = (int)subOrder.SubscriptionPlan.MaxFreePost;
        userSubUsage.RemainingSubPost = subOrder.SubscriptionPlan.MaxPostPerSub;
        userSubUsage.RemainingFeaturedPosts = subOrder.SubscriptionPlan.MaxFeaturedPosts;

        await _context.SaveChangesAsync();
    }

    public async Task<ServiceTransactionDto> GetServiceOrder(int id)
    {
        var order = await _context.SubscriptionOrders
                        .Include(s => s.SubscriptionPlan)
                        .Include(s => s.OrderStatus)
                        .FirstOrDefaultAsync(s => s.OrderId == id);
        if (order is null)
        {
            return new ServiceTransactionDto();
        }
        var query = new ServiceTransactionDto
        {
            OrderId = order.OrderId,
            ServiceName = order.SubscriptionPlan.SubPlanName,
            ServiceCode = order.OrderCode,
            ServicePrice = order.Amount,
            Status = order.OrderStatus.StatusName,
            StatusDescription = order.OrderStatus.Description,
        };
        return query;
    }
}