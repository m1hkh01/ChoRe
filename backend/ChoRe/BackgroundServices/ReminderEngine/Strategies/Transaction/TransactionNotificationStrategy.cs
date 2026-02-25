using Microsoft.EntityFrameworkCore;
using ChoRe.DTOs;
using ChoRe.Models;
using ChoRe.Data;

public class TransactionNotificationStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var notificationService =
            serviceProvider.GetRequiredService<INotificationService>();

        var now = DateTime.UtcNow;

        var transactions = await context.EscrowTransations
            .Where(t =>
                (t.EscrowTransStatusId == EscrowStatus.PendingPayment ||
                 t.EscrowTransStatusId == EscrowStatus.Confirming)
                && t.ExpiredAt > now)
            .ToListAsync(token);

        foreach (var transaction in transactions)
        {
            // var halfTime = transaction.CreateAt.AddMinutes(1);
            var halfTime = transaction.CreateAt +
               TimeSpan.FromTicks((transaction.ExpiredAt - transaction.CreateAt).Ticks / 2);

            if (now < halfTime)
                continue;

            if (transaction.EscrowTransStatusId == EscrowStatus.PendingPayment)
            {
                bool alreadyNotified = await context.Notifications
                    .AnyAsync(n =>
                        n.RelatedId == transaction.EscrowTransId &&
                        n.Type == NotificationType.PendingPayment,
                        token);

                if (alreadyNotified)
                    continue;

                await notificationService.CreateNotificationAsync(new NotificationDto
                {
                    UserId = transaction.BuyerUserId,
                    Title = "Thanh toán chưa hoàn tất",
                    Message = $"Bạn có giao dịch đang chờ thanh toán sẽ hết hạn vào {transaction.ExpiredAt:HH:mm 'ngày' dd/MM/yyyy}",
                    Type = NotificationType.PendingPayment,
                    RelatedId = transaction.EscrowTransId
                });
            }

            if (transaction.EscrowTransStatusId == EscrowStatus.Confirming)
            {
                bool alreadyNotified = await context.Notifications
                    .AnyAsync(n =>
                        n.RelatedId == transaction.EscrowTransId &&
                        n.Type == NotificationType.Confirming,
                        token);

                if (alreadyNotified)
                    continue;

                await notificationService.CreateNotificationAsync(new NotificationDto
                {
                    UserId = transaction.SellerConfirmed
                        ? transaction.BuyerUserId
                        : transaction.SellerUserId,
                    Title = "Cần xác nhận giao dịch",
                    Message = $"Bạn có giao dịch cần xác nhận sẽ hết hạn vào {transaction.ExpiredAt:HH:mm 'ngày' dd/MM/yyyy}",
                    Type = NotificationType.Confirming,
                    RelatedId = transaction.EscrowTransId
                });
            }
        }
    }
}