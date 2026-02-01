using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers
{
    [ApiController]
    [Route("api/specifications")]
    public class SpecificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-category/{cateId}")]
        public async Task<IActionResult> GetByCategory(int cateId)
        {
            var specs = await _context.Specifications
                .Where(s => s.CateId == cateId)
                .Select(s => new
                {
                    specId = s.SpecId,
                    specName = s.SpecName
                })
                .ToListAsync();

            return Ok(specs);
        }
        //[HttpGet("by-parent-category/{parentCateId}")]
        //public IActionResult GetByParentCategory(int parentCateId)
        //{
        //    var specs = _context.Specifications
        //        .Where(s => s.ParentCateId == parentCateId)
        //        .ToList();

        //    return Ok(specs);
        //}

    }

}
