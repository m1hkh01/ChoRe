using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostDetail(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Brand)
                .Include(p => p.PostImages)
                .Include(p => p.PostCates)
                .ThenInclude(pc => pc.Category)
                .Include(p => p.PostSpecifications)
                    .ThenInclude(ps => ps.Specification)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostId == id);

            if (post == null)
                return NotFound();

            post.ViewCount += 1;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                post.PostId,
                post.Title,
                post.PostStatusId,            // ⚠️ thêm vào để frontend biết trạng thái

                // ✅ THÊM THÔNG TIN GIÁ
                post.PriceType,
                post.Price,
                post.MinPrice,
                post.MaxPrice,

                post.Description,
                post.Address,
                post.CreatedAt,
                post.ViewCount,

                brand = post.Brand == null ? null : new
                {
                    post.Brand.BrandId,
                    post.Brand.BrandName
                },

                images = post.PostImages.Select(i => i.PostImage1),

                categories = post.PostCates.Select(pc => new
                {
                    pc.Category.CateId,
                    pc.Category.CateName
                }),

                specifications = post.PostSpecifications.Select(ps => new
                {
                    specName = ps.Specification.SpecName,
                    value = ps.SpecValue
                }),

                user = new
                {
                    post.User.UserId,
                    post.User.FullName,
                    post.User.PhoneNumber,
                    post.User.Avatar
                }
            });
        }

        [AllowAnonymous]
        [HttpGet("home")]
        public async Task<IActionResult> GetPostsForHome(
        string? keyword,
        int? brandId,
        int? userId,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        int? time
        )
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.PostImages)
                .Include(p => p.Brand)
                .Include(p => p.SavedPosts)
                .Include(p => p.PostCates)
                    .ThenInclude(pc => pc.Category)
                .Where(p => p.PostStatusId == 2);

            // 🔍 keyword
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

            // 💰 price - ✅ CẬP NHẬT
            // 💰 price - FIX ĐÚNG
            if (minPrice.HasValue || maxPrice.HasValue)
            {
                query = query.Where(p =>
                    p.PriceType == "NEGOTIABLE"
                    ||
                    (p.PriceType == "FIXED" &&
                     (!minPrice.HasValue || p.Price >= minPrice.Value) &&
                     (!maxPrice.HasValue || p.Price <= maxPrice.Value))
                    ||
                    (p.PriceType == "RANGE" &&
                     (!maxPrice.HasValue || p.MinPrice <= maxPrice.Value) &&
                     (!minPrice.HasValue || p.MaxPrice >= minPrice.Value))
                );
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

                    ViewCount = p.ViewCount,

                    ShortDescription = p.Description.Length > 120
                        ? p.Description.Substring(0, 120) + "..."
                        : p.Description,

                    // ✅ THÊM CÁC TRƯỜNG GIÁ
                    PriceType = p.PriceType,
                    Price = p.Price,
                    MinPrice = p.MinPrice,
                    MaxPrice = p.MaxPrice,

                    Address = p.Address,
                    CreatedAt = p.CreatedAt,
                    UserName = p.User.UserName,
                    Thumbnail = p.PostImages
                        .Select(i => i.PostImage1)
                        .FirstOrDefault(),
                    IsSaved = p.SavedPosts.Any(sp => sp.UserId == userId && sp.PostId == p.PostId)
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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return Unauthorized("Người dùng không tồn tại!");

            /* ===================== 2️⃣ CHECK KHÓA TÀI KHOẢN ===================== */
            if (user.IsLocked)
                return BadRequest("Tài khoản đang bị khóa!");

            /* ===================== 3️⃣ CHECK LƯỢT ĐĂNG TIN ===================== */
            var usage = await _context.UserSubUsages.FirstOrDefaultAsync(u => u.UserId == userId);
            if (usage == null)
                return BadRequest("Bạn chưa có gói đăng tin!");
            if (usage.RemainingSubPost <= 0)
                return BadRequest("Bạn đã hết lượt đăng tin trong tháng!");

            /* ===================== 4️⃣ CHECK TRẠNG THÁI THIẾT BỊ ===================== */
            var validDeviceStatus = new[] { "NEW", "LIKE_NEW", "GOOD", "USED", "BROKEN" };
            if (string.IsNullOrEmpty(dto.Status))
                return BadRequest("Vui lòng chọn trạng thái thiết bị!");
            if (!validDeviceStatus.Contains(dto.Status))
                return BadRequest("Trạng thái thiết bị không hợp lệ!");

            /* ===================== 5️⃣ ✅ CHECK KIỂU GIÁ ===================== */
            var validPriceTypes = new[] { "NEGOTIABLE", "FIXED", "RANGE" };
            if (string.IsNullOrEmpty(dto.PriceType))
                return BadRequest("Vui lòng chọn kiểu giá!");

            if (!validPriceTypes.Contains(dto.PriceType))
                return BadRequest("Kiểu giá không hợp lệ!");

            // Validate theo từng kiểu
            switch (dto.PriceType)
            {
                case "NEGOTIABLE":
                    // Không cần giá
                    break;

                case "FIXED":
                    if (!dto.Price.HasValue || dto.Price <= 0)
                        return BadRequest("Vui lòng nhập giá hợp lệ!");
                    break;

                case "RANGE":
                    if (!dto.MinPrice.HasValue || !dto.MaxPrice.HasValue)
                        return BadRequest("Vui lòng nhập khoảng giá!");
                    if (dto.MinPrice <= 0 || dto.MaxPrice <= 0)
                        return BadRequest("Giá phải lớn hơn 0!");
                    if (dto.MinPrice >= dto.MaxPrice)
                        return BadRequest("Giá tối thiểu phải nhỏ hơn giá tối đa!");
                    break;
            }

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
                Address = dto.Address,
                RejectReason = "",
                BrandId = dto.BrandId,
                Status = dto.Status,
                PostStatusId = 1,

                // ✅ THÊM KIỂU GIÁ
                PriceType = dto.PriceType,
                Price = dto.Price,
                MinPrice = dto.MinPrice,
                MaxPrice = dto.MaxPrice,

                ViewCount = 0,
                SavedCount = 0,
                CreatedAt = DateTime.Now
            };

            // Check lượt đăng tin miễn phí
            if(usage.RemainingFreePost == 0)
            {
                var datePart = DateTime.Now.ToString("yyyyMMddHHmmss");
                var randomPart = Guid.NewGuid().ToString("N")[..4].ToUpper();
                var orderCode = $"POST{post.UserId}E{datePart}{randomPart}";

                post.PostOrderCode = orderCode;
            }

            _context.Posts.Add(post);

            /* ===================== 8️⃣ LƯU CATEGORY ===================== */
            foreach (var cateId in dto.CateIds)
            {
                _context.PostCates.Add(new PostCate
                {
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

            /* ===================== 1️⃣1️⃣ TRỪ LƯỢT ĐĂNG TIN && LƯỢT MIỄN PHÍ ĐĂNG TIN ===================== */
            usage.RemainingSubPost -= 1;
            if(usage.RemainingFreePost > 0)
            {
                usage.RemainingFreePost -= 1;
            }
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
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPosts([FromQuery] int[]? statusIds, [FromQuery] int? userId)
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.PostImages)
                .Include(p=>p.SavedPosts)
                .Where(p => p.PostStatusId == 2); // ✅ chỉ approved

            // 🔍 Optional filter theo statusIds (nếu cần)
            if (statusIds != null && statusIds.Length > 0)
            {
                query = query.Where(p => statusIds.Contains(p.PostStatusId));
            }

            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostAllDto
                {
                    PostId = p.PostId,
                    BrandId = p.BrandId,
                    Title = p.Title,
                    Address = p.Address,
                    CreatedAt = p.CreatedAt,

                    ViewCount = p.ViewCount,

                    // ✅ GIÁ (an toàn null)
                    PriceType = p.PriceType,
                    Price = p.Price,
                    MinPrice = p.MinPrice,
                    MaxPrice = p.MaxPrice,

                    UserName = p.User.UserName,

                    Thumbnail = p.PostImages
                        .OrderBy(i => i.PostImgId)
                        .Select(i => i.PostImage1)
                        .FirstOrDefault(),

                    ShortDescription = p.Description.Length > 120
                        ? p.Description.Substring(0, 120)
                        : p.Description,
                    IsSaved = p.SavedPosts.Any(sp => sp.UserId == userId && sp.PostId == p.PostId)
                    //IsSaved = p.SavedPosts.Any(sp => sp.PostId == p.PostId && sp.UserId == userId)
                })
                .ToListAsync();

            return Ok(posts);
        }

        [AllowAnonymous]
        [HttpPost("by-ids")]
        public async Task<IActionResult> GetPostsByIds([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
                return Ok(new List<object>());

            var posts = await _context.Posts
                .Where(p => ids.Contains(p.PostId))
                .Select(p => new
                {
                    p.PostId,
                    p.Title,
                    p.PriceType,
                    p.Price,
                    p.MinPrice,
                    p.MaxPrice,
                    p.Address,
                    p.PostStatusId,
                    p.Status,
                    p.CreatedAt,
                    p.UserId,
                    p.ViewCount,
                    p.SavedCount,

                    // 🔥 THÊM ĐOẠN NÀY
                    thumbnail = _context.PostImages
                        .Where(img => img.PostId == p.PostId)
                        .Select(img => img.PostImage1)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(posts);
        }

        //[AllowAnonymous]
        //[HttpGet("approved")]
        //public async Task<IActionResult> GetApprovedPosts()
        //{
        //    var posts = await _context.Posts
        //        .AsNoTracking()
        //        .Include(p => p.User)
        //        .Include(p => p.PostImages)
        //        .Include(p => p.Brand)
        //        .Where(p => p.PostStatusId == 2) // Chỉ lấy posts approved
        //        .OrderByDescending(p => p.CreatedAt)
        //        .Select(p => new
        //        {
        //            p.PostId,
        //            p.BrandId,
        //            p.Title,
        //            p.Address,
        //            p.CreatedAt,

        //            // Giá
        //            p.PriceType,
        //            p.Price,
        //            p.MinPrice,
        //            p.MaxPrice,

        //            // User
        //            UserName = p.User.UserName,

        //            // Image
        //            Thumbnail = p.PostImages
        //                .Select(i => i.PostImage1)
        //                .FirstOrDefault(),

        //            // Description
        //            ShortDescription = p.Description.Length > 120
        //                ? p.Description.Substring(0, 120)
        //                : p.Description
        //        })
        //        .ToListAsync();

        //    return Ok(posts);
        //}
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
        [HttpGet("check-free-post/{id:int}")]
        public async Task<IActionResult> CheckFreePost(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            if (id != userId)
            {
                return Forbid("Bạn không thể xem lượt đăng tin của người khác");
            }
            var usage = await _context.UserSubUsages.FirstOrDefaultAsync(u => u.UserId == userId);
            if (usage is null)
            {
                return NotFound("Không tìm thấy người dùng");
            }
            return Ok(new { FreePost = usage.RemainingFreePost, SubPost = usage.RemainingSubPost });

        }

        [HttpGet("pay/{id:int}")]
        public async Task<IActionResult> GetPayPost(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);
                if (post is null)
                {
                    return NotFound("Không tìm thấy bài đăng");
                }
                if(post.PostOrderCode is null)
                {
                    return BadRequest("Bài đăng này không cần thanh toán");
                }
                return Ok(new { postId = post.PostId, orderCode = post.PostOrderCode , postTitle = post.Title});
            }
            catch (Exception e)
            {
                Console.WriteLine("Có lỗi xảy ra khi tìm bài đăng cần thanh toán: " + e.Message);
                return BadRequest("Có lỗi xảy ra khi tìm bài đăng cần thanh toán: " + e.Message);
            }
        }

        [HttpPost("pay/{id:int}")]
        public async Task<IActionResult> PayPost(int id)    {
            try
            {
                var post = await _context.Posts.FindAsync(id);
                if (post is null)
                {
                    return NotFound("Không tìm thấy bài đăng");
                }
                if (post.PostStatusId == 2)
                {
                    return Ok(new { Success = post.PaymentMessage ?? "Đã thanh toán thành công" });
                }
                else
                {
                    return Ok(new { Error = post.PaymentMessage 
                        ?? "Thanh toán chưa thành công vui lòng kiểm tra lại số tiền và nội dung chuyển khoản" });
                }
            }
            catch(Exception e)
            {
                Console.WriteLine("Có lỗi xảy ra khi thanh toán: " + e.Message);
                return BadRequest("Có lỗi xảy ra khi thanh toán: " + e.Message);
            }
        }
        // ── DELETE /api/posts/{id} — chủ bài tự xóa ─────────────────────────────
        [HttpPost("{id:int}")]
        public async Task<IActionResult> DeleteMyPost(int id)
        {
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
                return Unauthorized("Token không hợp lệ!");

            var userId = int.Parse(userIdClaim.Value);

            var post = await _context.Posts
                .Include(p => p.PostImages)
                .Include(p => p.PostSpecifications)
                .Include(p => p.PostCates)
                .Include(p => p.SavedPosts)
                .FirstOrDefaultAsync(p => p.PostId == id);

            if (post == null)
                return NotFound(new { message = "Không tìm thấy bài đăng." });

            if (post.UserId != userId)
                return Forbid();

            post.IsDeleted = true;
            post.DeletedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa bài đăng." });
        }
    }
}