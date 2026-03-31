using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChoRe.Models;
using ChoRe.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ChoRe.Controllers
{
    [Route("api/save-posts")]
    [ApiController]
    [Authorize]
    public class SavedPostsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedPostsController(AppDbContext context)
        {
            _context = context;
        }

        // 🔥 Thêm yêu thích
        [HttpPost]
        public async Task<IActionResult> AddSavedPost(SavedPostRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var exists = await _context.SavedPosts
                .AnyAsync(x => x.UserId == userId && x.PostId == request.PostId);

            if (exists)
                return BadRequest(new { message = "Bài đăng đã được lưu trước đó." });

            var savedPost = new SavedPost
            {
                UserId = userId,
                PostId = request.PostId,
                CreateAt = DateTime.UtcNow
            };

            _context.SavedPosts.Add(savedPost);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã lưu bài đăng." });
        }

        // 🔥 Xoá yêu thích
        [HttpPost("{postId:int}")]
        public async Task<IActionResult> RemoveSavedPost(int postId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var item = await _context.SavedPosts
                .FirstOrDefaultAsync(x => x.UserId == userId && x.PostId == postId);
            Console.WriteLine($"Trying to remove saved post: userId={userId}, postId={postId}, foundItem={item != null}");
            if (item == null)
                return NotFound(new { message = "Không tìm thấy bài đăng đã lưu." });

            _context.SavedPosts.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xoá bài đăng khỏi yêu thích." });
        }

        // 🔥 Kiểm tra bài đăng có được lưu không
        [HttpGet("check/{postId}")]
        public async Task<IActionResult> CheckSaved(int postId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var isSaved = await _context.SavedPosts
                .AnyAsync(x => x.UserId == userId && x.PostId == postId);

            return Ok(new { isSaved });
        }

        // 🔥 Lấy danh sách yêu thích của user hiện tại
        [HttpGet]
        public async Task<IActionResult> GetSavedPosts()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var savedPosts = await _context.SavedPosts
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreateAt)
                .Join(_context.Posts,
                    sp => sp.PostId,
                    p => p.PostId,
                    (sp, p) => new
                    {
                        postId = p.PostId,
                        title = p.Title,
                        price = p.Price,
                        minPrice = p.MinPrice,
                        maxPrice = p.MaxPrice,
                        priceType = p.PriceType,
                        address = p.Address,
                        thumbnail = p.PostImages
                        .Select(i => i.PostImage1)
                        .FirstOrDefault(),
                        shortDescription = p.Description,
                        postStatusId = p.PostStatusId,
                        userName = p.User!.FullName,
                        savedAt = sp.CreateAt
                    })
                .ToListAsync();

            return Ok(savedPosts);
        }
    }

    // DTO
    public class SavedPostRequest
    {
        public int PostId { get; set; }
    }
}
