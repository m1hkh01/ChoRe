using ChoRe.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Area("Censor")]
[Authorize(Roles = "Censor")]
[ApiController]
[Route("api/censor/posts")]
public class PostCensorController : ControllerBase
{
    private readonly IPostService _service;

    public PostCensorController(IPostService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetPostsByCensor()
    {
        var posts = await _service.GetPostsByAsync();
        return Ok(posts);
    }

    [HttpPost("{id}/accept")]
    public async Task<IActionResult> AcceptPost(int id)
    {
        try
        {
            await _service.ApprovePostAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException err)
        {
            return NotFound(new { Error = err.Message });
        }
        catch (Exception err)
        {
            return BadRequest(new { Error = "Có lỗi xảy ra khi duyệt tin: ", err.Message });
        }
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> CancelPost(int id, [FromBody] RejectPostDto dto)
    {
        try
        {
            await _service.RejectPostAsync(id, dto.RejectReason);
            return NoContent();
        }
        catch (KeyNotFoundException err)
        {
            return NotFound(new { Error = err.Message });
        }
        catch (Exception err)
        {
            return BadRequest(new { Error = "Có lỗi xảy ra khi từ chối tin: ", err.Message });
        }
    }
}
