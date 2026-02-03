using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers
{
    [ApiController]
    [Route("api/brands")]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // ✅ SỬA: Chỉ select các field cần thiết
            var brands = await _context.Brands
                .Select(b => new
                {
                    b.BrandId,
                    b.BrandName,
                    b.Description,
                    b.BrandLogo,
                    b.ParentBrandId
                })
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("by-category/{cateId}")]
        public async Task<IActionResult> GetBrandByCategory(int cateId)
        {
            // ✅ SỬA: Chỉ select các field cần thiết
            var brands = await _context.BrandCates
                .Where(bc => bc.CateId == cateId)
                .Select(bc => new
                {
                    bc.Brand.BrandId,
                    bc.Brand.BrandName,
                    bc.Brand.Description,
                    bc.Brand.BrandLogo,
                    bc.Brand.ParentBrandId
                })
                .Distinct()
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("tree")]
        public async Task<IActionResult> GetBrandTree()
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
    }
}