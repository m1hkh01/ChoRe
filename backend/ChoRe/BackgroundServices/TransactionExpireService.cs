using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

public class TransactionExpireService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public TransactionExpireService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var expiredTransactions = await context.EscrowTransations
                .Where(t => t.EscrowTransStatusId == EscrowStatus.Confirming && t.ExpiredAt < DateTime.UtcNow)
                .ToListAsync(stoppingToken);

            if (expiredTransactions.Any())
            {
                foreach (var transation in expiredTransactions)
                    transation.EscrowTransStatusId = EscrowStatus.Expired;

                await context.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
