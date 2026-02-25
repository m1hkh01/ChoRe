using ChoRe.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public interface INotificationService
{
    Task<List<NotificationDto>> GetNotificationsByUserIdAsync(int userId);
    Task MarkAsReadAsync(int notificationId);
    Task CreateNotificationAsync(NotificationDto dto);
}
public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public NotificationService(AppDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<List<NotificationDto>> GetNotificationsByUserIdAsync(int userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                RelatedId = n.RelatedId,
                CreatedAt = n.CreatedAt,
                IsRead = n.IsRead
            })
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(int notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task CreateNotificationAsync(NotificationDto dto)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Message = dto.Message,
            Type = dto.Type,
            RelatedId = dto.RelatedId,
            CreatedAt = DateTime.UtcNow,
            IsRead = false,
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        notification.Type = dto.Type; // Gán lại Type để trả về đúng kiểu enum cho client
        // Push realtime nếu online
        await _hubContext.Clients.User(dto.UserId.ToString())
            .SendAsync("ReceiveNotification", notification);
    }
}