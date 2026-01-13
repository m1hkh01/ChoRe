using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostCatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostCatesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostCate>>> GetPostCates()
        {
            return await _context.PostCates.ToListAsync();
        }
    }
}
