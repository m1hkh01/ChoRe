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
                .Include(b => b.BrandCates)
                .ThenInclude(bc => bc.Category)
                .Select(b => new
                {
                    b.BrandId,
                    b.BrandName,
                    b.Description,
                    b.BrandLogo,
                    Categories = b.BrandCates.Select(bc => bc.Category.CateName)
                })
                .ToListAsync();

            return Ok(brands);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create(
    [FromForm] CreateBrandDto dto,
    IFormFile? logo)
        {
            if (await _context.Brands.AnyAsync(b => b.BrandName == dto.BrandName))
                return BadRequest("Tên thương hiệu đã tồn tại");

            string? fileName = null;

            if (logo != null)
            {
                // ✅ TẠO THƯ MỤC NẾU CHƯA TỒN TẠI
                var brandsFolder = Path.Combine(_env.WebRootPath, "brands");
                if (!Directory.Exists(brandsFolder))
                {
                    Directory.CreateDirectory(brandsFolder);
                }

                var ext = Path.GetExtension(logo.FileName);
                fileName = $"{Guid.NewGuid()}{ext}";
                var path = Path.Combine(brandsFolder, fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await logo.CopyToAsync(stream);
            }

            var brand = new Brand
            {
                BrandName = dto.BrandName,
                Description = dto.Description,
                BrandLogo = fileName
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
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
    int id,
    [FromForm] UpdateBrandDto dto,
    IFormFile? logo)
        {
            var brand = await _context.Brands
                .Include(b => b.BrandCates)
                .FirstOrDefaultAsync(b => b.BrandId == id);

            if (brand == null)
                return NotFound("Không tìm thấy brand");

            brand.BrandName = dto.BrandName;
            brand.Description = dto.Description;

            if (logo != null)
            {
                // ✅ TẠO THƯ MỤC NẾU CHƯA TỒN TẠI
                var brandsFolder = Path.Combine(_env.WebRootPath, "brands");
                if (!Directory.Exists(brandsFolder))
                {
                    Directory.CreateDirectory(brandsFolder);
                }

                if (!string.IsNullOrEmpty(brand.BrandLogo))
                {
                    var oldPath = Path.Combine(brandsFolder, brand.BrandLogo);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var ext = Path.GetExtension(logo.FileName);
                var newFile = $"{Guid.NewGuid()}{ext}";
                var path = Path.Combine(brandsFolder, newFile);

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
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var brand = await _context.Brands
                .Include(b => b.BrandCates)
                .FirstOrDefaultAsync(b => b.BrandId == id);

            if (brand == null)
                return NotFound();

            if (!string.IsNullOrEmpty(brand.BrandLogo))
            {
                var path = Path.Combine(_env.WebRootPath, "brands", brand.BrandLogo);
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            _context.BrandCates.RemoveRange(brand.BrandCates);
            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
