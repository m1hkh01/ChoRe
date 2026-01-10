using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

public class OrderExpireService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public OrderExpireService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var expiredOrders = await context.SubscriptionOrders
                .Where(o => o.OrdStatusId == 1 && o.ExpiredAt < DateTime.UtcNow)
                .ToListAsync(stoppingToken);

            if (expiredOrders.Any())
            {
                foreach (var order in expiredOrders)
                    order.OrdStatusId = 4;

                await context.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
