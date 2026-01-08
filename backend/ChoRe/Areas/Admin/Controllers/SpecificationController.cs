using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/specifications")]
    public class SpecificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecificationController(AppDbContext context)
        {
            _context = context;
        }

        // GET BY CATEGORY
        [HttpGet("by-category/{cateId}")]
        public async Task<IActionResult> GetByCategory(int cateId)
        {
            var data = await _context.Specifications
                .Where(x => x.CateId == cateId)
                .Select(x => new
                {
                    x.SpecId,
                    x.SpecName,
                    x.Description
                })
                .ToListAsync();

            return Ok(data);
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(SpecificationCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool exists = await _context.Specifications.AnyAsync(x =>
                x.CateId == dto.CateId && x.SpecName == dto.SpecName);

            if (exists)
                return BadRequest("Thông số đã tồn tại trong danh mục này");

            var spec = new Specification
            {
                SpecName = dto.SpecName,
                Description = dto.Description,
                CateId = dto.CateId
            };

            _context.Specifications.Add(spec);
            await _context.SaveChangesAsync();

            return Ok(spec);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SpecificationCreateUpdateDto dto)
        {
            var spec = await _context.Specifications.FindAsync(id);
            if (spec == null) return NotFound();

            bool exists = await _context.Specifications.AnyAsync(x =>
                x.CateId == dto.CateId &&
                x.SpecName == dto.SpecName &&
                x.SpecId != id);

            if (exists)
                return BadRequest("Thông số đã tồn tại trong danh mục này");

            spec.SpecName = dto.SpecName;
            spec.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok(spec);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var spec = await _context.Specifications
                .Include(x => x.PostSpecifications)
                .FirstOrDefaultAsync(x => x.SpecId == id);

            if (spec == null) return NotFound();

            if (spec.PostSpecifications.Any())
                return BadRequest("Thông số đã được sử dụng, không thể xóa");

            _context.Specifications.Remove(spec);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
