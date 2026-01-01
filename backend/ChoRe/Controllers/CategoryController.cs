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
            return Ok(await _context.Categories.ToListAsync());
        }
        // category của brand đã chọn
        [HttpGet("by-brand/{brandId}")]
        public async Task<IActionResult> GetCateByBrand(int brandId)
        {
            var cates = await _context.BrandCates
                .Where(bc => bc.BrandId == brandId)
                .Select(bc => bc.Category)
                .Distinct()
                .ToListAsync();

            return Ok(cates);
        }
    }

}
