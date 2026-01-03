using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChoRe.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/posts")]
    public class PostAdminController : ControllerBase
    {
        private readonly IPostService _service;
        public PostAdminController(IPostService service)
        {
            _service = service;
        }

        [HttpGet("/admin-posts")]
        public async Task<IActionResult> GetPostsByAdmin()
        {
            var posts = await _service.GetPostsByAsync();
            return Ok(posts);
        }
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptPost(int id)
        {
            try
            {
                Console.WriteLine("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: " + id);
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
        public async Task<IActionResult> CancelPost(int id, [FromBody] string rejectReason)
        {
            try
            {
                await _service.RejectPostAsync(id, rejectReason);
                return NoContent();
            }
            catch (KeyNotFoundException err)
            {
                return NotFound(new { Error = err.Message });

            }
            catch (Exception err)
            {
                return BadRequest(new { Error = "Có lỗi xảy ra khi từ chối tin tin: ", err.Message });
            }
        }
    }
}
