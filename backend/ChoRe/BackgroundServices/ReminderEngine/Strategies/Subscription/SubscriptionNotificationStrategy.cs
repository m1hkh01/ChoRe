using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

public class SubscriptionNotificationStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var _notificationService = serviceProvider.GetRequiredService<INotificationService>();

        var now = DateTime.UtcNow;

        var orders = await context.SubscriptionOrders
            .Where(o => o.OrdStatusId == EscrowStatus.PendingPayment)
            .ToListAsync();

        foreach (var order in orders)
        {
            // Nhắc thanh toán giữa thời gian
            if (order.OrdStatusId == EscrowStatus.PendingPayment
                && order.ExpiredAt.HasValue)
            {
                var halfTime = order.CreatedAt +
                    TimeSpan.FromTicks((order.ExpiredAt.Value - order.CreatedAt).Ticks / 2);

                if (now >= halfTime)
                {
                    bool alreadyNotified = await context.Notifications
                        .AnyAsync(n =>
                            n.RelatedId == order.OrderId &&
                            n.Type == NotificationType.PendingPaymentPackage);

                    if (!alreadyNotified)
                    {
                        var dto = new NotificationDto
                        {
                            UserId = order.UserId,
                            Title = "Thanh toán gói dịch vụ chưa hoàn tất",
                            Message = "Bạn có đơn hàng gói dịch vụ đang chờ thanh toán sẽ hết hạn vào " + order.ExpiredAt.Value.ToString("HH:mm 'ngày' dd/MM/yyyy"),
                            Type = NotificationType.PendingPaymentPackage,
                            RelatedId = order.OrderId
                        };

                        await _notificationService.CreateNotificationAsync(dto);
                    }
                }
            }
        }
    }
}