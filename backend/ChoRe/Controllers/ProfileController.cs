using ChoRe.Data;
using ChoRe.DTO.Profile;
using ChoRe.Helpers;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ChoRe.Dto;

namespace ChoRe.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProfileController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ════════════════════════════════════════════════════════════════════
        //  USER PROFILE
        // ════════════════════════════════════════════════════════════════════

        // GET /api/profile/{userId}
        [HttpGet("users/{userId:int}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var currentUserId = GetCurrentUserId();

            var user = await _context.Users
                .Where(u => u.UserId == userId && !u.IsLocked)
                .Select(u => new ProfileDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Avatar = u.Avatar,
                    Address = u.Address,
                    CreateAt = u.CreateAt,
                    TotalPosts = u.Posts!.Count(p => p.Status == "APPROVED"),
                    AvgRating = _context.Reviews.Where(r => r.SellerId == userId).Any()
                                       ? Math.Round(_context.Reviews.Where(r => r.SellerId == userId).Average(r => (double)r.Rating), 1)
                                       : 0,
                    TotalRatings = _context.Reviews.Count(r => r.SellerId == userId),
                    Email = currentUserId == userId ? u.Email : null,
                    PhoneNumber = currentUserId == userId ? u.PhoneNumber : null,
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound("Người dùng không tồn tại");
            return Ok(user);
        }

        // POST /api/profile/me
        [HttpPost("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = GetCurrentUserIdRequired();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                var trimmed = dto.UserName.Trim();
                if (await _context.Users.AnyAsync(u => u.UserName == trimmed && u.UserId != userId))
                    return BadRequest("Tên đăng nhập đã được sử dụng");
                user.UserName = trimmed;
            }

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var trimmed = dto.Email.Trim().ToLower();
                if (await _context.Users.AnyAsync(u => u.Email == trimmed && u.UserId != userId))
                    return BadRequest("Email đã được sử dụng");
                user.Email = trimmed;
            }

            if (!string.IsNullOrWhiteSpace(dto.FullName)) user.FullName = dto.FullName.Trim();
            if (dto.PhoneNumber is not null) user.PhoneNumber = dto.PhoneNumber.Trim();
            if (dto.Address is not null) user.Address = dto.Address.Trim();

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        // POST /api/profile/me/avatar
        [HttpPost("me/avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng chọn ảnh");

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowed.Contains(ext)) return BadRequest("Chỉ chấp nhận jpg, png, webp");
            if (file.Length > 5 * 1024 * 1024) return BadRequest("Ảnh tối đa 5MB");

            var userId = GetCurrentUserIdRequired();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(user.Avatar))
            {
                var oldPath = Path.Combine(_env.WebRootPath, "uploads", user.Avatar);
                if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
            }

            var fileName = $"avatar_{userId}_{Guid.NewGuid()}{ext}";
            var savePath = Path.Combine(_env.WebRootPath, "uploads", fileName);
            await using var stream = new FileStream(savePath, FileMode.Create);
            await file.CopyToAsync(stream);

            user.Avatar = fileName;
            await _context.SaveChangesAsync();
            return Ok(new { avatar = fileName });
        }

        // POST /api/profile/me/change-password
        [HttpPost("me/change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetCurrentUserIdRequired();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (user.PasswordHash != HashPassword(dto.OldPassword))
                return BadRequest("Mật khẩu hiện tại không đúng");

            if (dto.NewPassword.Length < 6)
                return BadRequest("Mật khẩu mới phải ít nhất 6 ký tự");

            user.PasswordHash = HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đổi mật khẩu thành công" });
        }

        // ════════════════════════════════════════════════════════════════════
        //  POSTS  (prefix /posts/{postId} để tách biệt hoàn toàn với /users)
        // ════════════════════════════════════════════════════════════════════

        // GET /api/profile/users/{userId}/posts
        [HttpGet("users/{userId:int}/posts")]
        public async Task<IActionResult> GetPosts(
            int userId,
            [FromQuery] int? statusId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            try
            {
                var isOwner = GetCurrentUserId() == userId;
                var query = _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.PostImages)
                    .Where(p => p.UserId == userId);

                if (!isOwner)
                    query = query.Where(p => p.PostStatusId == 2);
                else if (statusId.HasValue)
                    query = query.Where(p => p.PostStatusId == statusId.Value);

                var total = await query.CountAsync();
                var items = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new PostCardDto
                    {
                        PostId = p.PostId,
                        Title = p.Title,
                        ShortDescription = p.Description.Length > 120
                                               ? p.Description.Substring(0, 120) + "..."
                                               : p.Description,
                        PriceType = p.PriceType,
                        Price = p.Price,
                        MinPrice = p.MinPrice,
                        MaxPrice = p.MaxPrice,
                        Address = p.Address,
                        PostStatusId = p.PostStatusId,
                        CreatedAt = p.CreatedAt,
                        Thumbnail = p.PostImages
                                           .OrderBy(i => i.PostImgId)
                                           .Select(i => i.PostImage1)
                                           .FirstOrDefault(),
                        UserName = p.User.UserName,
                    })
                    .ToListAsync();

                return Ok(new PagedDto<PostCardDto>(items, total, page, pageSize));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetPosts error for user {userId}: {ex}");
                return StatusCode(500, "Đã có lỗi xảy ra");
            }
        }

        // ── DELETE /api/profile/posts/{postId} ──────────────────────────────────────
        [HttpDelete("posts/{postId:int}")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            // ✅ Fix gốc rễ: GetCurrentUserId() trả int? — unwrap trước khi so sánh
            var userId = GetCurrentUserId();
            if (userId is null) return Unauthorized();

            var post = await _context.Posts
                .Include(p => p.PostImages)
                .Include(p => p.PostSpecifications)
                .Include(p => p.PostCates)
                .Include(p => p.SavedPosts)
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null) return NotFound(new { message = "Không tìm thấy bài đăng" });

            // ✅ Fix: dùng userId.Value (int) so với post.UserId (int) — không để int? vs int
            if (post.UserId != userId.Value) return Forbid();

            // Xóa ảnh vật lý
            if (post.PostImages?.Any() == true)
            {
                foreach (var img in post.PostImages)
                {
                    var path = Path.Combine(_env.WebRootPath, "uploads", img.PostImage1);
                    if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
                }
                _context.PostImages.RemoveRange(post.PostImages);
            }

            // ✅ Xóa đủ các quan hệ liên quan (đồng nhất với PostController.DeleteMyPost)
            if (post.PostSpecifications?.Any() == true)
                _context.PostSpecifications.RemoveRange(post.PostSpecifications);

            if (post.PostCates?.Any() == true)
                _context.PostCates.RemoveRange(post.PostCates);

            if (post.SavedPosts?.Any() == true)
                _context.SavedPosts.RemoveRange(post.SavedPosts);

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa vĩnh viễn bài đăng" });
        }

        // ── PUT /api/profile/posts/{postId} ─────────────────────────────────────────
        [HttpPut("posts/{postId:int}")]
        public async Task<IActionResult> UpdatePost(int postId, UpdatePostDTO dto)
        {
            var userId = GetCurrentUserId();
            if (userId is null) return Unauthorized();

            var post = await _context.Posts
                .Include(p => p.PostImages)
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null) return NotFound(new { message = "Không tìm thấy bài đăng" });
            if (post.UserId != userId.Value) return Forbid();

            if (post.PostStatusId != PostStatusHelper.Pending &&
                post.PostStatusId != PostStatusHelper.Rejected)
                return BadRequest("Không thể chỉnh sửa bài đăng đã được duyệt hoặc đã đóng");

            post.Title = dto.Title;
            post.Description = dto.Description;
            post.Price = dto.Price;
            post.PriceType = dto.PriceType;
            post.MinPrice = dto.MinPrice;
            post.MaxPrice = dto.MaxPrice;

            if (dto.Images != null)
            {
                foreach (var img in post.PostImages.ToList())
                {
                    var path = Path.Combine(_env.WebRootPath, "uploads", img.PostImage1);
                    if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
                }
                _context.PostImages.RemoveRange(post.PostImages);

                foreach (var image in dto.Images)
                    _context.PostImages.Add(new PostImage { PostId = post.PostId, PostImage1 = image });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        // ── POST /api/profile/posts/{postId}/hide ────────────────────────────────────
        [HttpPost("posts/{postId:int}/hide")]
        public async Task<IActionResult> HidePost(int postId)
        {
            var userId = GetCurrentUserId();
            if (userId is null) return Unauthorized();

            var post = await _context.Posts.FindAsync(postId);
            if (post == null) return NotFound("Không tìm thấy bài đăng");
            if (post.UserId != userId.Value) return Forbid();
            if (post.PostStatusId == PostStatusHelper.Hidden) return BadRequest("Tin đã bị ẩn");

            post.PostStatusId = PostStatusHelper.Hidden;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã ẩn tin" });
        }

        // ── POST /api/profile/posts/{postId}/unhide ──────────────────────────────────
        [HttpPost("posts/{postId:int}/unhide")]
        public async Task<IActionResult> UnhidePost(int postId)
        {
            var userId = GetCurrentUserId();
            if (userId is null) return Unauthorized();

            var post = await _context.Posts.FindAsync(postId);
            if (post == null) return NotFound("Không tìm thấy bài đăng");
            if (post.UserId != userId.Value) return Forbid();
            if (post.PostStatusId != PostStatusHelper.Hidden) return BadRequest("Tin không ở trạng thái ẩn");

            post.PostStatusId = PostStatusHelper.Approved;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Tin đã được hiển thị lại" });
        }

        // ── POST /api/profile/posts/{postId}/mark-sold ───────────────────────────────
        [HttpPost("posts/{postId:int}/mark-sold")]
        public async Task<IActionResult> MarkAsSold(int postId)
        {
            var userId = GetCurrentUserId();
            if (userId is null) return Unauthorized();

            var post = await _context.Posts.FirstOrDefaultAsync(p => p.PostId == postId);
            if (post == null) return NotFound();
            if (post.UserId != userId.Value) return Forbid();

            post.PostStatusId = PostStatusHelper.Sold;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã đánh dấu là đã bán" });
        }

        // ════════════════════════════════════════════════════════════════════
        //  RATINGS & COMMENTS
        // ════════════════════════════════════════════════════════════════════

        // GET /api/profile/users/{userId}/ratings
        [HttpGet("users/{userId:int}/ratings")]
        public async Task<IActionResult> GetRatings(
            int userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Reviews
                .Where(r => r.SellerId == userId)
                .Include(r => r.Reviewer);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RatingDto
                {
                    RatingId = r.ReviewId,
                    Stars = r.Rating,
                    Comment = r.Comment,
                    CreateAt = r.CreatedAt,
                    RaterUserId = r.Reviewer!.UserId,
                    RaterFullName = r.Reviewer.FullName,
                    RaterAvatar = r.Reviewer.Avatar,
                })
                .ToListAsync();

            return Ok(new PagedDto<RatingDto>(items, total, page, pageSize));
        }

        // GET /api/profile/users/{userId}/comments
        [HttpGet("users/{userId:int}/comments")]
        public async Task<IActionResult> GetComments(
            int userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Comments
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Post)
                    .Include(c => c.User);

                var total = await query.CountAsync();
                var items = await query
                    .OrderByDescending(c => c.CreateAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new CommentDto
                    {
                        CmtId = c.CmtId,
                        Content = c.Content,
                        CreateAt = c.CreateAt,
                        Post = new PostInfoDto
                        {
                            PostId = c.Post.PostId,
                            Title = c.Post.Title,
                        },
                        User = new UserInfoDto
                        {
                            UserId = c.User.UserId,
                            FullName = c.User.FullName,
                            Avatar = c.User.Avatar,
                        },
                    })
                    .ToListAsync();

                return Ok(new PagedDto<CommentDto>(items, total, page, pageSize));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetComments error for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // DELETE /api/comments/{id}  ← giữ nguyên absolute route, không đổi
        [HttpDelete("/api/comments/{id:int}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ════════════════════════════════════════════════════════════════════
        //  PRIVATE HELPERS
        // ════════════════════════════════════════════════════════════════════

        private static string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private int? GetCurrentUserId()
        {
            var c = User.FindFirstValue("UserId");
            return c != null ? int.Parse(c) : null;
        }

        private int GetCurrentUserIdRequired()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}