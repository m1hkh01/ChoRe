using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChoRe.Models;
using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedPostsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedPostsController(AppDbContext context)
        {
            _context = context;
        }

        // 🔥 Thêm yêu thích
        [HttpPost]
        public async Task<IActionResult> AddSavedPost([FromBody] SavedPost model)
        {
            var exists = await _context.SavedPosts
                .AnyAsync(x => x.UserId == model.UserId && x.PostId == model.PostId);

            if (exists)
                return BadRequest("Đã tồn tại");

            _context.SavedPosts.Add(model);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // 🔥 Xoá yêu thích
        [HttpDelete]
        public async Task<IActionResult> RemoveSavedPost(int userId, int postId)
        {
            var item = await _context.SavedPosts
                .FirstOrDefaultAsync(x => x.UserId == userId && x.PostId == postId);

            if (item == null)
                return NotFound();

            _context.SavedPosts.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // 🔥 Lấy danh sách yêu thích theo user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var posts = await _context.SavedPosts
                .Where(x => x.UserId == userId)
                .Select(x => x.Post)
                .ToListAsync();

            return Ok(posts);
        }
    }
}
