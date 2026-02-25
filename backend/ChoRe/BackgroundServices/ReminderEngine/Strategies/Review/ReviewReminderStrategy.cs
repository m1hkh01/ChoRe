using Microsoft.EntityFrameworkCore;
using ChoRe.DTOs;
using ChoRe.Models;
using ChoRe.Data;

public class ReviewReminderStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var notificationService =
            serviceProvider.GetRequiredService<INotificationService>();

        var now = DateTime.UtcNow;

        // Lấy các chatRoom đã tạo hơn 1 tiếng
        var chatRooms = await context.ChatRooms
            .Include(c => c.ChatMessages)
            .Include(c => c.CurrentEscrow)
            .Include(c => c.Seller)
            .Where(c =>
                c.CreateAt.AddHours(1) <= now
            )
            .ToListAsync(token);

        foreach (var room in chatRooms)
        {
            // Điều kiện 1: ít nhất 20 tin nhắn
            if (room.ChatMessages == null || room.ChatMessages.Count < 20)
                continue;

            // Điều kiện 2: phải có tin nhắn từ cả 2 bên
            var distinctUsers = room.ChatMessages
                .Select(m => m.FromUserId)
                .Distinct()
                .Count();

            if (distinctUsers < 2)
                continue;

            // var transaction = room.CurrentEscrow;
            // if (transaction == null)
            //     continue;

            // Điều kiện 3: chưa có review
            bool alreadyReviewed = await context.Reviews
                .AnyAsync(r =>
                    r.ChatRoomId == room.ChatRoomId &&
                    r.PostId == room.PostId &&
                    r.ReviewId == room.BuyerId, token
                );

            if (alreadyReviewed)
                continue;

            // Check đã gửi notification chưa
            bool alreadyNotified = await context.Notifications
                .AnyAsync(n =>
                    n.RelatedId == room.ChatRoomId&&
                    n.Type == NotificationType.ReviewReminder,
                    token);

            if (alreadyNotified)
                continue;

            //Gửi notification cho người mua (hoặc cả 2 nếu muốn)
            await notificationService.CreateNotificationAsync(new NotificationDto
            {
                UserId = room.BuyerId,
                Title = "Đánh giá cuộc trò chuyện với " + room.Seller?.UserName,
                Message = "Hay dành chút thời gian để đánh giá cuộc trò chuyện của bạn với người bán. Điều này sẽ giúp cải thiện trải nghiệm cho cả hai bên trong tương lai!",
                Type = NotificationType.ReviewReminder,
                RelatedId = room.ChatRoomId
            });
        }
    }
}