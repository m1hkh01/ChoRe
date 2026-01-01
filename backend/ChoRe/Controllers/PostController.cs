using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/posts")]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            /* ===================== 1️⃣ LẤY USER TỪ JWT ===================== */
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
                return Unauthorized("Token không hợp lệ!");

            var userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return Unauthorized("Người dùng không tồn tại!");

            /* ===================== 2️⃣ CHECK KHÓA TÀI KHOẢN ===================== */
            if (user.IsLocked)
                return BadRequest("Tài khoản đang bị khóa!");

            /* ===================== 3️⃣ CHECK XÁC MINH CCCD ===================== */
            if (string.IsNullOrEmpty(user.CitizenIdNumber)
                || string.IsNullOrEmpty(user.CitizenIdFrontImage)
                || string.IsNullOrEmpty(user.CitizenIdBackImage))
            {
                return BadRequest("Bạn phải xác minh tài khoản trước khi đăng tin!");
            }

            /* ===================== 4️⃣ CHECK LƯỢT ĐĂNG TIN ===================== */
            var usage = await _context.UserSubUsages
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (usage == null)
                return BadRequest("Bạn chưa có gói đăng tin!");

            if (usage.RemainingSubPost <= 0)
                return BadRequest("Bạn đã hết lượt đăng tin!");

            /* ===================== 5️⃣ CHECK TRẠNG THÁI THIẾT BỊ ===================== */
            var validDeviceStatus = new[]
            {
                "NEW", "LIKE_NEW", "GOOD", "USED", "BROKEN"
            };

            if (string.IsNullOrEmpty(dto.Status))
                return BadRequest("Vui lòng chọn trạng thái thiết bị!");

            if (!validDeviceStatus.Contains(dto.Status))
                return BadRequest("Trạng thái thiết bị không hợp lệ!");

            /* ===================== 6️⃣ CHECK BRAND – CATEGORY ===================== */
            if (dto.CateIds == null || !dto.CateIds.Any())
                return BadRequest("Phải chọn ít nhất 1 danh mục!");

            var isValidBrandCate = await _context.BrandCates
                .Where(bc => bc.BrandId == dto.BrandId)
                .AnyAsync(bc => dto.CateIds.Contains(bc.CateId));

            if (!isValidBrandCate)
                return BadRequest("Danh mục không thuộc brand đã chọn!");

            /* ===================== 7️⃣ TẠO POST ===================== */
            var post = new Post
            {
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                Address = dto.Address,
                RejectReason = "",

                BrandId = dto.BrandId,

                Status = dto.Status, 
                PostStatusId = 1,           

                ViewCount = 0,
                SavedCount = 0,
                CreatedAt = DateTime.Now
            };

            _context.Posts.Add(post);
            //await _context.SaveChangesAsync();

            /* ===================== 8️⃣ LƯU CATEGORY ===================== */
            foreach (var cateId in dto.CateIds)
            {
                _context.PostCates.Add(new PostCate
                {
                    //PostId = post.PostId,
                    Post = post,
                    CateId = cateId
                });
            }

            /* ===================== 9️⃣ LƯU THÔNG SỐ (SPEC) ===================== */
            if (dto.Specifications != null && dto.Specifications.Any())
            {
                foreach (var spec in dto.Specifications)
                {
                    _context.PostSpecifications.Add(new PostSpecification
                    {
                        Post = post,
                        SpecId = spec.Key,
                        SpecValue = spec.Value
                    });
                }
            }

            /* ===================== 🔟 LƯU ẢNH ===================== */
            if (dto.Images != null && dto.Images.Any())
            {
                foreach (var img in dto.Images)
                {
                    _context.PostImages.Add(new PostImage
                    {
                        Post = post,
                        PostImage1 = img
                    });
                }
            }

            /* ===================== 1️⃣1️⃣ TRỪ LƯỢT ĐĂNG TIN ===================== */
            usage.RemainingSubPost -= 1;

            await _context.SaveChangesAsync();

            /* ===================== 1️⃣2️⃣ RESPONSE ===================== */
            return Ok(new
            {
                message = "Đăng tin thành công, bài viết đang chờ duyệt!",
                postId = post.PostId
            });
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            // ✅ CHECK FILE HỢP LỆ
            if (file == null || file.Length == 0)
                return BadRequest("File không hợp lệ");

            // ✅ CHECK KÍCH THƯỚC (5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest("File không được vượt quá 5MB");

            // ✅ CHECK LOẠI FILE
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)");

            // ✅ TẠO THƯ MỤC NẾU CHƯA CÓ
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // ✅ TẠO TÊN FILE DUY NHẤT
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // ✅ LƯU FILE
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { fileName = fileName });

        }
    }
}
