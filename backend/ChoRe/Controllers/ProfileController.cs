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

        // ── GET /api/profile/{userId}  — public ─────────────────────────────────
        [HttpGet("{userId:int}")]
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
                    AvgRating = u.RatingsReceived!.Any()
                                    ? Math.Round(u.RatingsReceived.Average(r => (double)r.Star), 1) : 0,
                    TotalRatings = u.RatingsReceived!.Count(),
                    Email = currentUserId == userId ? u.Email : null,
                    PhoneNumber = currentUserId == userId ? u.PhoneNumber : null,
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound("Người dùng không tồn tại");
            return Ok(user);
        }

        // ── PUT /api/profile/me ─────────────────────────────────────────────────
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = GetCurrentUserIdRequired();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            // UserName — kiểm tra trùng (trừ chính mình)
            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                var trimmed = dto.UserName.Trim();
                var conflict = await _context.Users
                    .AnyAsync(u => u.UserName == trimmed && u.UserId != userId);
                if (conflict)
                    return BadRequest("Tên đăng nhập đã được sử dụng");
                user.UserName = trimmed;
            }

            // Email — kiểm tra trùng (trừ chính mình)
            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var trimmed = dto.Email.Trim().ToLower();
                var conflict = await _context.Users
                    .AnyAsync(u => u.Email == trimmed && u.UserId != userId);
                if (conflict)
                    return BadRequest("Email đã được sử dụng");
                user.Email = trimmed;
            }

            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.FullName = dto.FullName.Trim();

            if (dto.PhoneNumber is not null)
                user.PhoneNumber = dto.PhoneNumber.Trim();

            if (dto.Address is not null)
                user.Address = dto.Address.Trim();

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        // ── POST /api/profile/me/avatar ─────────────────────────────────────────
        [HttpPost("me/avatar")]
        [Authorize]
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

            // Xóa avatar cũ
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

        // ── GET /api/profile/{userId}/posts ─────────────────────────────────────
        [HttpGet("{userId:int}/posts")]
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
                    query = query.Where(p => p.PostStatusId == 2); // APPROVED only
                else if (statusId.HasValue)
                    query = query.Where(p => p.PostStatusId == statusId.Value);

                Console.WriteLine($"Fetching posts for user {isOwner} {userId} with statusId={statusId}, page={page}, pageSize={pageSize}");

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

                        UserName = p.User.UserName
                    })
                    .ToListAsync();

                return Ok(new PagedDto<PostCardDto>(items, total, page, pageSize));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching posts for user {userId}: {ex}");
                return StatusCode(401, "Đã có lỗi xảy ra");
            }
        }

        [HttpPut("{postId:int}/mark-sold")]
        public async Task<IActionResult> MarkAsSold(int postId)
        {
            var userId = GetCurrentUserId();

            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null)
                return NotFound();

            if (post.UserId != userId)
            {
                Console.WriteLine($"User {userId} attempted to mark post {postId} as sold but is not the owner.");
                return Forbid();
            }

            post.PostStatusId = PostStatusHelper.Sold;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã đánh dấu là đã bán" });
        }
        [HttpPut("{postId:int}/hide")]
        public async Task<IActionResult> HidePost(int postId)
        {
            var userId = GetCurrentUserId();

            var post = await _context.Posts.FindAsync(postId);

            if (post == null)
                return NotFound("Không tìm thấy bài đăng");

            if (post.UserId != userId)
                return Forbid();

            if (post.PostStatusId == PostStatusHelper.Hidden)
                return BadRequest("Tin đã bị ẩn");

            post.PostStatusId = PostStatusHelper.Hidden;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã ẩn tin"
            });
        }
        [HttpPut("{postId:int}/unhide")]
        public async Task<IActionResult> UnhidePost(int postId)
        {
            var userId = GetCurrentUserId();

            var post = await _context.Posts.FindAsync(postId);

            if (post == null)
                return NotFound("Không tìm thấy bài đăng");

            if (post.UserId != userId)
                return Forbid();

            if (post.PostStatusId != PostStatusHelper.Hidden)
                return BadRequest("Tin không ở trạng thái ẩn");

            post.PostStatusId = PostStatusHelper.Approved;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tin đã được hiển thị lại"
            });
        }
        [HttpDelete("{postId:int}")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            var userId = GetCurrentUserId();

            // lấy post + images
            var post = await _context.Posts
                .Include(p => p.PostImages)
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null)
                return NotFound(new { message = "Không tìm thấy bài đăng" });

            // chỉ chủ bài đăng mới được xóa
            if (post.UserId != userId)
                return Forbid();

            // XÓA FILE ẢNH TRÊN Ổ CỨNG (nếu có)
            if (post.PostImages != null)
            {
                foreach (var img in post.PostImages)
                {
                    var filePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot/uploads",
                        img.PostImage1
                    );

                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                // xóa record ảnh trong DB
                _context.PostImages.RemoveRange(post.PostImages);
            }

            // XÓA POST
            _context.Posts.Remove(post);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã xóa vĩnh viễn bài đăng"
            });
        }
        [HttpPut("{postId:int}")]
        public async Task<IActionResult> UpdatePost(int postId, UpdatePostDTO dto)
        {
            var userId = GetCurrentUserId();

            var post = await _context.Posts.FindAsync(postId);

            if (post == null)
                return NotFound();

            if (post.UserId != userId)
                return Forbid();

            post.Title = dto.Title;
            post.Description = dto.Description;
            post.Price = dto.Price;
            post.PriceType = dto.PriceType;
            post.MinPrice = dto.MinPrice;
            post.MaxPrice = dto.MaxPrice;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thành công"
            });
        }


        // ── GET /api/profile/{userId}/ratings ───────────────────────────────────
        [HttpGet("{userId:int}/ratings")]
        public async Task<IActionResult> GetRatings(
            int userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Ratings
                .Where(r => r.ToUserId == userId)
                .Include(r => r.FromUser);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RatingDto
                {
                    RatingId = r.RatingId,
                    Stars = r.Star,
                    Comment = r.Comment,
                    CreateAt = r.CreatedAt,
                    RaterUserId = r.FromUser.UserId,
                    RaterFullName = r.FromUser.FullName,
                    RaterAvatar = r.FromUser.Avatar,
                })
                .ToListAsync();

            return Ok(new PagedDto<RatingDto>(items, total, page, pageSize));
        }

        // ── POST /api/profile/me/change-password ────────────────────────────────
        [HttpPost("me/change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetCurrentUserIdRequired();
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var oldHash = HashPassword(dto.OldPassword);
            if (user.PasswordHash != oldHash)
                return BadRequest("Mật khẩu hiện tại không đúng");

            if (dto.NewPassword.Length < 6)
                return BadRequest("Mật khẩu mới phải ít nhất 6 ký tự");

            user.PasswordHash = HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đổi mật khẩu thành công" });
        }

        // ── Helpers ─────────────────────────────────────────────────────────────
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private int? GetCurrentUserId()
        {
            var c = User.FindFirstValue("UserId");
            Console.WriteLine($"Current user ID from claims: {c}");
            return c != null ? int.Parse(c) : null;
        }

        private int GetCurrentUserIdRequired()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}