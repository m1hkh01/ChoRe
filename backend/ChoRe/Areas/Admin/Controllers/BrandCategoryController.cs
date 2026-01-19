using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/brand-categories")]
    public class BrandCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandCategoryController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("tree")]
        public async Task<IActionResult> GetTree()
        {
            var categories = await _context.Categories.ToListAsync();

            var dict = categories.ToDictionary(
                c => c.CateId,
                c => new CategoryTreeDto
                {
                    CateId = c.CateId,
                    CateName = c.CateName,
                    ParentCateId = c.ParentCateId
                });

            List<CategoryTreeDto> roots = new();

            foreach (var item in dict.Values)
            {
                if (item.ParentCateId == null)
                {
                    roots.Add(item);
                }
                else if (dict.ContainsKey(item.ParentCateId.Value))
                {
                    dict[item.ParentCateId.Value].Children.Add(item);
                }
            }

            return Ok(roots);
        }

        // GET CATEGORY BY BRAND
        [HttpGet("{brandId}")]
        public async Task<IActionResult> GetByBrand(int brandId)
        {
            var cateIds = await _context.BrandCates
                .Where(x => x.BrandId == brandId)
                .Select(x => x.CateId)
                .ToListAsync();

            return Ok(cateIds);
        }

        // UPDATE MAPPING
        [HttpPut]
        public async Task<IActionResult> Update(BrandCategoryUpdateDto dto)
        {
            var brand = await _context.Brands.FindAsync(dto.BrandId);
            if (brand == null) return NotFound("Brand không tồn tại");

            var old = _context.BrandCates.Where(x => x.BrandId == dto.BrandId);
            _context.BrandCates.RemoveRange(old);

            if (dto.CateIds != null && dto.CateIds.Any())
            {
                var newLinks = dto.CateIds
                    .Distinct()
                    .Select(cid => new BrandCate
                    {
                        BrandId = dto.BrandId,
                        CateId = cid
                    });

                await _context.BrandCates.AddRangeAsync(newLinks);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
