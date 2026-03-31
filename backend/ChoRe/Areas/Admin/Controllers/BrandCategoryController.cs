using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ChoRe.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
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

        // UPDATE MAPPING - TỰ ĐỘNG THÊM DANH MỤC CHA
        [HttpPost]
        public async Task<IActionResult> Update(BrandCategoryUpdateDto dto)
        {
            var brand = await _context.Brands.FindAsync(dto.BrandId);
            if (brand == null) return NotFound("Brand không tồn tại");

            var old = _context.BrandCates.Where(x => x.BrandId == dto.BrandId);
            _context.BrandCates.RemoveRange(old);

            if (dto.CateIds != null && dto.CateIds.Any())
            {
                // Lấy tất cả categories để tìm parent
                var allCategories = await _context.Categories.ToListAsync();
                var categoryDict = allCategories.ToDictionary(c => c.CateId);

                // Set để lưu tất cả cateId bao gồm cả parent
                var allCateIds = new HashSet<int>();

                foreach (var cateId in dto.CateIds)
                {
                    // Thêm category hiện tại
                    allCateIds.Add(cateId);

                    // Tìm và thêm tất cả parent categories
                    var currentCateId = cateId;
                    while (categoryDict.ContainsKey(currentCateId))
                    {
                        var category = categoryDict[currentCateId];

                        if (category.ParentCateId.HasValue)
                        {
                            allCateIds.Add(category.ParentCateId.Value);
                            currentCateId = category.ParentCateId.Value;
                        }
                        else
                        {
                            break; // Đã đến root category
                        }
                    }
                }

                // Tạo các BrandCate mới từ allCateIds
                var newLinks = allCateIds
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