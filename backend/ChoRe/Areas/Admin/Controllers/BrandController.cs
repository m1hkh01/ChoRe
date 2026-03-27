using ChoRe.Data;
using ChoRe.Dto.Admin;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin/brands")]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BrandController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _context.Brands
            .Select(b => new {
                brandId = b.BrandId,
                brandName = b.BrandName,
                description = b.Description,
                brandLogo = b.BrandLogo,
                parentBrandId = b.ParentBrandId,
                parentBrandName = b.ParentBrand.BrandName,
                cateIds = b.BrandCates.Select(x => x.CateId).ToList()
            })
            .ToListAsync();

            return Ok(brands);
        }
        // ================= GET ALL TREE =================
        [HttpGet("tree")]
        public async Task<IActionResult> GetTree()
        {
            var brands = await _context.Brands
            .Where(b => b.ParentBrandId == null)
            .Include(b => b.SubBrands)
            .Select(b => new
            {
                b.BrandId,
                b.BrandName,
                b.Description,
                b.BrandLogo,
                SubBrands = b.SubBrands.Select(sb => new
                {
                    sb.BrandId,
                    sb.BrandName,
                    sb.Description,
                    sb.BrandLogo
                })
            })
            .ToListAsync();


            return Ok(brands);
        }
        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateBrandDto dto, IFormFile? logo)
        {
            if (await _context.Brands.AnyAsync(b => b.BrandName == dto.BrandName))
                return BadRequest("Tên thương hiệu đã tồn tại");


            string? fileName = null;
            if (logo != null)
            {
                var folder = Path.Combine("wwwroot", "brands");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);


                fileName = Guid.NewGuid() + Path.GetExtension(logo.FileName);
                var path = Path.Combine(folder, fileName);


                using var stream = new FileStream(path, FileMode.Create);
                await logo.CopyToAsync(stream);
            }


            var brand = new Brand
            {
                BrandName = dto.BrandName,
                Description = dto.Description,
                BrandLogo = fileName,
                ParentBrandId = dto.ParentBrandId
            };


            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();


            foreach (var cateId in dto.CateIds)
            {
                _context.BrandCates.Add(new BrandCate
                {
                    BrandId = brand.BrandId,
                    CateId = cateId
                });
            }


            await _context.SaveChangesAsync();
            return Ok();
        }
        // ================= UPDATE =================
        [HttpPost("update/{id:int}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateBrandDto dto, IFormFile? logo)
        {
            var brand = await _context.Brands
            .Include(b => b.BrandCates)
            .FirstOrDefaultAsync(b => b.BrandId == id);


            if (brand == null) return NotFound("Không tìm thấy brand");


            brand.BrandName = dto.BrandName;
            brand.Description = dto.Description;
            brand.ParentBrandId = dto.ParentBrandId;


            if (logo != null)
            {
                var folder = Path.Combine(_env.WebRootPath, "brands");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);


                if (!string.IsNullOrEmpty(brand.BrandLogo))
                {
                    var oldPath = Path.Combine(folder, brand.BrandLogo);
                    if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
                }


                var newFile = Guid.NewGuid() + Path.GetExtension(logo.FileName);
                var path = Path.Combine(folder, newFile);


                using var stream = new FileStream(path, FileMode.Create);
                await logo.CopyToAsync(stream);


                brand.BrandLogo = newFile;
            }
            _context.BrandCates.RemoveRange(brand.BrandCates);
            foreach (var cateId in dto.CateIds)
            {
                _context.BrandCates.Add(new BrandCate
                {
                    BrandId = id,
                    CateId = cateId
                });
            }


            await _context.SaveChangesAsync();
            return Ok();
        }
        // ================= DELETE =================
        [HttpPost("delete/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var brand = await _context.Brands
            .Include(b => b.SubBrands)
            .Include(b => b.BrandCates)
            .FirstOrDefaultAsync(b => b.BrandId == id);


            if (brand == null) return NotFound();


            if (brand.SubBrands.Any())
                return BadRequest("Không thể xoá brand cha khi còn brand con");
            var hasPost = await _context.Posts.AnyAsync(p => p.BrandId == id);
            if (hasPost)
                return BadRequest("Không thể xoá brand này vì đang có bài đăng sử dụng");

            if (!string.IsNullOrEmpty(brand.BrandLogo))
            {
                var path = Path.Combine(_env.WebRootPath, "brands", brand.BrandLogo);
                if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
            }


            _context.BrandCates.RemoveRange(brand.BrandCates);
            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();


            return NoContent();
        }
    }
}
