using Microsoft.EntityFrameworkCore;
using ChoRe.DTO;
using ChoRe.Models;
using ChoRe.Data;

public class PostNotificationStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var notificationService =
            serviceProvider.GetRequiredService<INotificationService>();

        var now = DateTime.UtcNow;

        var posts = await context.Posts
            .Include(p => p.User)
            .ToListAsync(token);

        foreach (var post in posts)
        {
            // ===== BÀI VIẾT ĐƯỢC DUYỆT =====
            if (post.PostStatusId == 2) //2 = Approved
            {
                bool alreadyNotified = await context.Notifications
                    .AnyAsync(n =>
                        n.RelatedId == post.PostId &&
                        n.Type == NotificationType.PostApproved,
                        token);

                if (!alreadyNotified)
                {
                    await notificationService.CreateNotificationAsync(new NotificationDto
                    {
                        UserId = post.UserId,
                        Title = "Bài viết đã được duyệt",
                        Message = $"Bài viết \"{post.Title}\" của bạn đã được duyệt.",
                        Type = NotificationType.PostApproved,
                        RelatedId = post.PostId
                    });
                }
            }

            // ===== BÀI VIẾT BỊ TỪ CHỐI =====
            if (post.PostStatusId == 3) // 3 = Rejected
            {
                bool alreadyNotified = await context.Notifications
                    .AnyAsync(n =>
                        n.RelatedId == post.PostId &&
                        n.Type == NotificationType.PostRejected,
                        token);

                if (!alreadyNotified)
                {
                    await notificationService.CreateNotificationAsync(new NotificationDto
                    {
                        UserId = post.UserId,
                        Title = "Bài viết bị từ chối",
                        Message = $"Bài viết \"{post.Title}\" bị từ chối. Lý do: {post.RejectReason}",
                        Type = NotificationType.PostRejected,
                        RelatedId = post.PostId
                    });
                }
            }

            // ===== CẦN THANH TOÁN =====
            if (post.PostStatusId == 7) // 7 = NeedPayment
            {
                bool alreadyNotified = await context.Notifications
                    .AnyAsync(n =>
                        n.RelatedId == post.PostId &&
                        n.Type == NotificationType.PostNeedPayment,
                        token);

                if (!alreadyNotified)
                {
                    await notificationService.CreateNotificationAsync(new NotificationDto
                    {
                        UserId = post.UserId,
                        Title = "Bài viết cần thanh toán",
                        Message = $"Bài viết \"{post.Title}\" cần thanh toán để được hiển thị.",
                        Type = NotificationType.PostNeedPayment,
                        RelatedId = post.PostId
                    });
                }
            }
        }
    }
}