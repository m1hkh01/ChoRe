using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

public class DisputeNotificationStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(AppDbContext context, IServiceProvider serviceProvider, CancellationToken token)
    {
        var notificationService = serviceProvider.GetRequiredService<INotificationService>();

        var now = DateTime.Now;

        // Lấy dispute đang mở và chưa có quyết định
        var disputes = await context.Disputes
            .Include(d => d.EscrowTransation)
            .Include(d => d.DisputeEvidences)
            .Where(d =>
                d.Decision == "" &&
                d.CreateAt.AddHours(1) <= now
            )
            .ToListAsync();

        foreach (var dispute in disputes)
        {
            var transaction = dispute.EscrowTransation;

            var buyerId = transaction.BuyerUserId;
            var sellerId = transaction.SellerUserId;

            bool buyerSubmitted = dispute.DisputeEvidences
                .Any(e => e.SubmitByUserId == buyerId);

            bool sellerSubmitted = dispute.DisputeEvidences
                .Any(e => e.SubmitByUserId == sellerId);

            // Nếu cả 2 đã gửi thì bỏ qua
            if (buyerSubmitted && sellerSubmitted)
                continue;

            int targetUserId;

            if (!buyerSubmitted)
                targetUserId = buyerId;
            else
                targetUserId = sellerId;

            // Check đã notify chưa
            bool alreadyNotified = await context.Notifications
                .AnyAsync(n =>
                    n.RelatedId == dispute.DisputeId &&
                    n.Type == NotificationType.AwaitingEvidence);

            if (alreadyNotified)
                continue;

            var dto = new NotificationDto
            {
                UserId = targetUserId,
                Title = "Cần gửi bằng chứng tranh chấp",
                Message = "Bạn chưa gửi bằng chứng cho tranh chấp và hệ thống đã chờ hơn 1 giờ.",
                Type = NotificationType.AwaitingEvidence,
                RelatedId = dispute.DisputeId
            };

            await notificationService.CreateNotificationAsync(dto);
        }
    }
}