using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // ✅ SỬA: Chỉ select các field cần thiết
            var categories = await _context.Categories
                .Select(c => new
                {
                    c.CateId,
                    c.CateName,
                    c.Description,
                    c.ParentCateId
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("by-brand/{brandId}")]
        public async Task<IActionResult> GetCateByBrand(int brandId)
        {
            // ✅ SỬA: Chỉ select các field cần thiết
            var cates = await _context.BrandCates
                .Where(bc => bc.BrandId == brandId)
                .Select(bc => new
                {
                    bc.Category.CateId,
                    bc.Category.CateName,
                    bc.Category.Description,
                    bc.Category.ParentCateId
                })
                .Distinct()
                .ToListAsync();

            return Ok(cates);
        }

        [HttpGet("tree/by-brand/{brandId}")]
        public async Task<IActionResult> GetCategoryTreeByBrand(int brandId)
        {
            var cates = await _context.Categories
                .Where(c =>
                    c.ParentCateId == null &&
                    c.BrandCates.Any(bc => bc.BrandId == brandId)
                )
                .Include(c => c.SubCategories)
                .Select(c => new
                {
                    c.CateId,
                    c.CateName,
                    c.Description,
                    SubCategories = c.SubCategories
                        .Where(sc => sc.BrandCates.Any(bc => bc.BrandId == brandId))
                        .Select(sc => new
                        {
                            sc.CateId,
                            sc.CateName,
                            sc.Description
                        })
                })
                .ToListAsync();

            return Ok(cates);
        }
    }
}