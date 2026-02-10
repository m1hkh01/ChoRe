using ChoRe.Data;
using ChoRe.DTOs.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace ChoRe.Controllers
{
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
                    // Chỉ trả email/phone nếu chính chủ xem
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

            if (!string.IsNullOrWhiteSpace(dto.FullName)) user.FullName = dto.FullName.Trim();
            if (dto.PhoneNumber is not null) user.PhoneNumber = dto.PhoneNumber.Trim();
            if (dto.Address is not null) user.Address = dto.Address.Trim();

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
            [FromQuery] string? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            var isOwner = GetCurrentUserId() == userId;
            var query = _context.Posts.Where(p => p.UserId == userId);

            // Visitor chỉ thấy bài APPROVED
            if (!isOwner)
                query = query.Where(p => p.Status == "APPROVED");
            else if (!string.IsNullOrEmpty(status))
                query = query.Where(p => p.Status == status);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostCardDto
                {
                    PostId = p.PostId,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    PriceType = p.PriceType,
                    MinPrice = p.MinPrice,
                    MaxPrice = p.MaxPrice,
                    Address = p.Address,
                    Status = p.Status,
                    PostStatusId = p.PostStatusId,
                    CreateAt = p.CreatedAt,
                })
                .ToListAsync();

            return Ok(new PagedDto<PostCardDto>(items, total, page, pageSize));
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

        // ─────────────────────────────────────────────
        // POST /api/profile/me/change-password (SHA256)
        // ─────────────────────────────────────────────
        [HttpPost("me/change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetCurrentUserIdRequired();
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound();

            // Check old password
            var oldHash = HashPassword(dto.OldPassword);

            if (user.PasswordHash != oldHash)
                return BadRequest("Mật khẩu hiện tại không đúng");

            if (dto.NewPassword.Length < 6)
                return BadRequest("Mật khẩu mới phải ít nhất 6 ký tự");

            // Save new password
            user.PasswordHash = HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công" });
        }

        // ─────────────────────────────────────────────
        // SHA256 Hash Helper
        // ─────────────────────────────────────────────
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // ─────────────────────────────────────────────
        // Helpers: Current User Id
        // ─────────────────────────────────────────────
        private int? GetCurrentUserId()
        {
            var c = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return c != null ? int.Parse(c) : null;
        }

        private int GetCurrentUserIdRequired()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}