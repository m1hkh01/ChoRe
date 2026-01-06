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
        private readonly IPostService _service;
        public PostController(AppDbContext context, IPostService service)
        {
            _context = context;
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet("home")]
        public async Task<IActionResult> GetPostsForHome(
                string? keyword,
                int? brandId,
                int? categoryId,
                decimal? maxPrice,
                int? time
                )
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.PostImages)
                .Include(p => p.Brand)
                .Include(p => p.PostCates)
                    .ThenInclude(pc => pc.Category)
                .Where(p => p.PostStatusId == 2);

            // 🔍 keyword - Trim và search case-insensitive
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim();
                query = query.Where(p => EF.Functions.Like(p.Title, $"%{keyword}%"));
            }

            // 🏷️ brandId
            if (brandId.HasValue && brandId > 0)
            {
                query = query.Where(p => p.BrandId == brandId.Value);
            }

            // 📂 categoryId
            if (categoryId.HasValue && categoryId > 0)
            {
                query = query.Where(p =>
                    p.PostCates.Any(pc => pc.CateId == categoryId.Value)
                );
            }

            // 💰 price
            if (maxPrice.HasValue && maxPrice > 0)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // ⏰ time
            if (time.HasValue && time > 0)
            {
                var fromDate = DateTime.Now.AddDays(-time.Value);
                query = query.Where(p => p.CreatedAt >= fromDate);
            }

            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostHomeDto
                {
                    PostId = p.PostId,
                    Title = p.Title,
                    ShortDescription = p.Description.Length > 120
                        ? p.Description.Substring(0, 120) + "..."
                        : p.Description,
                    Price = p.Price,
                    Address = p.Address,
                    CreatedAt = p.CreatedAt,
                    UserName = p.User.UserName,
                    Thumbnail = p.PostImages
                        .Select(i => i.PostImage1)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(posts);
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

            // ===================== CHECK SPEC =====================
            var specsInCate = await _context.Specifications
                .Where(s => dto.CateIds.Contains(s.CateId))
                .Select(s => s.SpecId)
                .ToListAsync();

            foreach (var specId in specsInCate)
            {
                if (!dto.Specifications.ContainsKey(specId))
                    return BadRequest("Thiếu thông số kỹ thuật!");

                if (dto.Specifications[specId].Length > 25)
                    return BadRequest("Giá trị thông số không được vượt quá 25 ký tự!");
            }

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

        //[HttpGet("/admin-posts")]
        //public async Task<IActionResult> GetPostsByAdmin()
        //{
        //    var posts = await _service.GetPostsByAdminAsync();
        //    return Ok(posts);
        //}
        //[HttpPost("/accept-post/{id}")]
        //public async Task<IActionResult> AcceptPost(int id)
        //{
        //    try
        //    {
        //        Console.WriteLine("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: " + id);
        //        await _service.ApprovePostAsync(id);
        //        return NoContent();
        //    }
        //    catch (KeyNotFoundException err)
        //    {
        //        return NotFound(new { Error = err.Message });

        //    }
        //    catch (Exception err)
        //    {
        //        return BadRequest(new { Error = "Có lỗi xảy ra khi duyệt tin: ", err.Message });
        //    }
        //}
        //[HttpPost("/cancel-post/{id}")]
        //public async Task<IActionResult> CancelPost(int id,[FromBody]string rejectReason)
        //{
        //    try
        //    {
        //        await _service.RejectPostAsync(id,rejectReason);
        //        return NoContent();
        //    }
        //    catch (KeyNotFoundException err)
        //    {
        //        return NotFound(new { Error = err.Message });

        //    }
        //    catch (Exception err)
        //    {
        //        return BadRequest(new { Error = "Có lỗi xảy ra khi từ chối tin tin: ", err.Message });
        //    }
        //}

    }
}