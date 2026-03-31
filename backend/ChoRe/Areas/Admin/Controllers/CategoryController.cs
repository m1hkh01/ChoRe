using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin/categories")]
    public class CategoryController(AppDbContext context) : ControllerBase
    {
        // GET api/admin/categories/tree
        [HttpGet("tree")]
        public async Task<IActionResult> GetTree()
        {
            var categories = await context.Categories
                .Select(c => new { c.CateId, c.CateName, c.ParentCateId })
                .ToListAsync();

            List<CategoryTreeDto> BuildTree(int? parentId) =>
                categories
                    .Where(c => c.ParentCateId == parentId)
                    .Select(c => new CategoryTreeDto
                    {
                        CateId = c.CateId,
                        CateName = c.CateName,
                        Children = BuildTree(c.CateId)
                    })
                    .ToList();

            return Ok(BuildTree(null));
        }

        // GET api/admin/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await context.Categories
                .Select(c => new
                {
                    cateId = c.CateId,
                    cateName = c.CateName,
                    description = c.Description,
                    parentCateId = c.ParentCateId,
                    parentCateName = c.ParentCategory != null ? c.ParentCategory.CateName : null,
                    brandCount = c.BrandCates.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        // POST api/admin/categories/create
        [HttpPost("create")]
        public async Task<IActionResult> Create(CategoryCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await context.Categories.AnyAsync(x => x.CateName == dto.CateName))
                return BadRequest("Danh mục đã tồn tại");

            var cate = new Category
            {
                CateName = dto.CateName,
                Description = dto.Description,
                ParentCateId = dto.ParentCateId
            };

            context.Categories.Add(cate);
            await context.SaveChangesAsync();

            return Ok(cate);
        }

        // POST api/admin/categories/update/{id}
        [HttpPost("update/{id:int}")]
        public async Task<IActionResult> Update(int id, CategoryCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cate = await context.Categories.FindAsync(id);
            if (cate is null) return NotFound();

            if (await context.Categories.AnyAsync(x => x.CateName == dto.CateName && x.CateId != id))
                return BadRequest("Tên danh mục đã tồn tại");

            cate.CateName = dto.CateName;
            cate.Description = dto.Description;

            await context.SaveChangesAsync();
            return Ok(cate);
        }

        // POST api/admin/categories/delete/{id}
        [HttpPost("delete/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cate = await context.Categories
                .Include(c => c.SubCategories)
                .Include(c => c.BrandCates)
                .Include(c => c.PostCates)
                .FirstOrDefaultAsync(c => c.CateId == id);

            if (cate is null) return NotFound();

            if (cate.SubCategories.Any())
                return BadRequest("Danh mục còn danh mục con, không thể xoá");

            if (cate.BrandCates.Any())
                return BadRequest("Danh mục đang được sử dụng bởi thương hiệu, không thể xóa");

            if (cate.PostCates.Any())
                return BadRequest("Danh mục đang được sử dụng bởi bài đăng, không thể xóa");

            context.Categories.Remove(cate);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}