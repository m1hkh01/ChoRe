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
            return Ok(await _context.Brands.ToListAsync());
        }

        [HttpGet("by-category/{cateId}")]
        public async Task<IActionResult> GetBrandByCategory(int cateId)
        {
            var brands = await _context.BrandCates
                .Where(bc => bc.CateId == cateId)
                .Select(bc => bc.Brand)
                .Distinct()
                .ToListAsync();

            return Ok(brands);
        }
    }

}
