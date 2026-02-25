using Microsoft.EntityFrameworkCore;
using ChoRe.Models;
using ChoRe.Data;

public class TransactionExpireStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var expiredTransactions = await context.EscrowTransations
            .Where(t =>
                (t.EscrowTransStatusId == EscrowStatus.Confirming ||
                 t.EscrowTransStatusId == EscrowStatus.PendingPayment)
                && t.ExpiredAt < DateTime.UtcNow)
            .ToListAsync(token);

        if (!expiredTransactions.Any())
            return;

        foreach (var transaction in expiredTransactions)
        {
            // Đổi trạng thái sang Expired
            transaction.EscrowTransStatusId = EscrowStatus.Expired;
        }

        await context.SaveChangesAsync(token);
    }
}