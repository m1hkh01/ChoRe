using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.DTOs;
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
        // GET /api/categories/hierarchy
        // Returns only root categories (ParentCateId == null),
        // each with their SubCategories and the Brands linked to each node.
        [HttpGet("hierarchy")]
        public async Task<IActionResult> GetHierarchy()
        {
            // ── 1. Load all categories with their sub-categories ──────────────
            var allCategories = await _context.Categories
                .Include(c => c.SubCategories)
                .Include(c => c.BrandCates)
                    .ThenInclude(bc => bc.Brand)
                        .ThenInclude(b => b.SubBrands)
                .AsNoTracking()
                .ToListAsync();

            // ── 2. Build roots only (top-level) ──────────────────────────────
            var roots = allCategories
                .Where(c => c.ParentCateId == null)
                .Select(c => MapCategory(c))
                .ToList();

            return Ok(roots);
        }

        // ── Recursive mapper ──────────────────────────────────────────────────
        private static CategoryHierarchyDto MapCategory(Category c)
        {
            return new CategoryHierarchyDto
            {
                CateId = c.CateId,
                CateName = c.CateName,
                Description = c.Description,
                ParentCateId = c.ParentCateId,

                SubCategories = c.SubCategories?
                    .Select(sub => MapCategory(sub))
                    .ToList() ?? new(),

                // Brands attached directly to this category node
                Brands = c.BrandCates?
                    .Select(bc => MapBrand(bc.Brand))
                    .ToList() ?? new()
            };
        }

        private static BrandDto MapBrand(Brand b)
        {
            if (b == null) return null;
            return new BrandDto
            {
                BrandId = b.BrandId,
                BrandName = b.BrandName,
                BrandLogo = b.BrandLogo,
                ParentBrandId = b.ParentBrandId,
                SubBrands = b.SubBrands?
                    .Select(sb => MapBrand(sb))
                    .ToList() ?? new()
            };
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