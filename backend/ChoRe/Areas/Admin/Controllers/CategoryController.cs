using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Categories
                .Select(c => new
                {
                    c.CateId,
                    c.CateName,
                    c.Description,
                    BrandCount = c.BrandCates.Count
                })
                .ToListAsync();

            return Ok(data);
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(CategoryCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Categories.AnyAsync(x => x.CateName == dto.CateName))
                return BadRequest("Danh mục đã tồn tại");

            var cate = new Category
            {
                CateName = dto.CateName,
                Description = dto.Description
            };

            _context.Categories.Add(cate);
            await _context.SaveChangesAsync();

            return Ok(cate);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CategoryCreateUpdateDto dto)
        {
            var cate = await _context.Categories.FindAsync(id);
            if (cate == null) return NotFound();

            if (await _context.Categories.AnyAsync(x => x.CateName == dto.CateName && x.CateId != id))
                return BadRequest("Tên danh mục đã tồn tại");

            cate.CateName = dto.CateName;
            cate.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok(cate);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cate = await _context.Categories
                .Include(c => c.BrandCates)
                .FirstOrDefaultAsync(c => c.CateId == id);

            if (cate == null) return NotFound();

            if (cate.BrandCates.Any())
                return BadRequest("Danh mục đang được sử dụng, không thể xóa");

            _context.Categories.Remove(cate);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
