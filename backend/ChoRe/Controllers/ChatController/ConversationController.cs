using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/chat")]
public class ConversationController : ControllerBase
{
    private readonly IConvertationService _convertationService;
    public ConversationController(IConvertationService convertationService)
    {
        _convertationService = convertationService;
    }
    [HttpPost]
    public async Task<IActionResult> CreateConversation(ConversationDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if(userId == dto.SellerId)
            {
                return BadRequest("Không thể chat với chính mình");
            }
            await _convertationService.CreateConversationAsync(dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Có lỗi xảy ra : " + ex.Message });
        }
    }
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAllConversationsByUserId(int userId)
    {
        try
        {
            var conversations = await _convertationService.GetAllConversationsByUserIdAsync(userId);
            return Ok(conversations);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Có lỗi xảy ra : " + ex.Message });
        }
    }
}
