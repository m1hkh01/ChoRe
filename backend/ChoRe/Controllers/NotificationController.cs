using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetNotificationsByUserId(int id)
    {
        var notifications = await _notificationService.GetNotificationsByUserIdAsync(id);
        return Ok(notifications);
    }
    [HttpPut("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        await _notificationService.MarkAsReadAsync(id);
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] NotificationDto dto)
    {
        await _notificationService.CreateNotificationAsync(dto);
        return Ok();
    }
}