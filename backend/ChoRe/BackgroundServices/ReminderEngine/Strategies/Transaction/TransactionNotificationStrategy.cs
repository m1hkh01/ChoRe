using Microsoft.EntityFrameworkCore;
using ChoRe.DTO;
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
        var mailService =
            serviceProvider.GetRequiredService<ISendMailService>();

        var now = DateTime.UtcNow;

        var transactions = await context.EscrowTransations
            .Include(t => t.BuyerUser)
            .Where(t =>
                ((t.EscrowTransStatusId == EscrowStatus.PendingPayment ||
                  t.EscrowTransStatusId == EscrowStatus.Confirming) && t.ExpiredAt > now) ||
                t.EscrowTransStatusId == EscrowStatus.Shipped)
            .ToListAsync(token);

        foreach (var transaction in transactions)
        {
            // var halfTime = transaction.CreateAt.AddMinutes(1);
            var halfTime = transaction.CreateAt +
               TimeSpan.FromTicks((transaction.ExpiredAt - transaction.CreateAt).Ticks / 2);

            if (transaction.EscrowTransStatusId == EscrowStatus.Shipped && transaction.AutoCompleteAt.HasValue)
            {
                var reminderAt = transaction.AutoCompleteAt.Value.AddHours(-24);
                if (now >= reminderAt && now < transaction.AutoCompleteAt.Value)
                {
                    bool alreadyNotified = await context.Notifications
                        .AnyAsync(n =>
                            n.RelatedId == transaction.EscrowTransId &&
                            n.Type == NotificationType.AutoCompleteReminder,
                            token);

                    if (!alreadyNotified)
                    {
                        await notificationService.CreateNotificationAsync(new NotificationDto
                        {
                            UserId = transaction.BuyerUserId,
                            Title = "Sắp hoàn tất giao dịch",
                            Message = $"Giao dịch đã được gửi hàng và sẽ tự động hoàn tất vào {transaction.AutoCompleteAt:HH:mm 'ngày' dd/MM/yyyy}. Nếu có vấn đề, hãy phản hồi ngay.",
                            Type = NotificationType.AutoCompleteReminder,
                            RelatedId = transaction.EscrowTransId
                        });

                        if (!string.IsNullOrEmpty(transaction.BuyerUser?.Email))
                        {
                            await mailService.SendEmailAsync(
                                transaction.BuyerUser.Email,
                                "Nhắc nhở: giao dịch sắp được tự động hoàn tất",
                                $"<p>Xin chào {transaction.BuyerUser.UserName},</p>" +
                                $"<p>Giao dịch <strong>{transaction.TransactionOrderCode}</strong> đã được gửi hàng và sẽ tự động hoàn tất vào <strong>{transaction.AutoCompleteAt:dd/MM/yyyy HH:mm}</strong>.</p>" +
                                "<p>Nếu bạn cần hỗ trợ hoặc khiếu nại, vui lòng liên hệ ngay với người bán.</p>");
                        }
                    }
                }
            }

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
