using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

public class SubscriptionExpireStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var expiredOrders = await context.SubscriptionOrders
            .Where(o => o.OrdStatusId == 1 && o.ExpiredAt < DateTime.UtcNow)
            .ToListAsync(token);

        if (!expiredOrders.Any())
            return;

        foreach (var order in expiredOrders)
        {
            order.OrdStatusId = 4; // ⚠️ Expired
        }

        await context.SaveChangesAsync(token);
    }
}