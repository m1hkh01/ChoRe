using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChoRe.Dto;

namespace ChoRe.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context)
        {
            _context = context;
        }

        // ===================== GET COMMENT THEO POST =====================
        [AllowAnonymous]
        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetCommentsByPost(int postId)
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .Include(c => c.User)
                .OrderByDescending(c => c.CreateAt)
                .Select(c => new
                {
                    c.CmtId,
                    c.Content,
                    c.CreateAt,
                    user = new
                    {
                        c.User.UserId,
                        c.User.FullName
                    }
                })
                .ToListAsync();

            return Ok(comments);
        }

        // ===================== CREATE COMMENT =====================
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto dto)
        {
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest("Nội dung không được để trống");

            // ===================== CHECK GIỚI HẠN COMMENT =====================
            var fromDate = DateTime.Now.AddMonths(-1);

            var commentCount = await _context.Comments
                .CountAsync(c =>
                    c.UserId == userId &&
                    c.PostId == dto.PostId &&
                    c.CreateAt >= fromDate
                );

            if (commentCount >= 5)
            {
                return BadRequest("Bạn chỉ được bình luận tối đa 5 lần cho bài đăng này trong 1 tháng");
            }

            // ===================== TẠO COMMENT =====================
            var comment = new Comment
            {
                PostId = dto.PostId,
                UserId = userId,
                Content = dto.Content,
                CreateAt = DateTime.Now
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Bình luận thành công"
            });
        }

    }
}
