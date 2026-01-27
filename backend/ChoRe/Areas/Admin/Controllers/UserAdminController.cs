using ChoRe.Data;
using ChoRe.Dto.Admin;
using ChoRe.Dto.Admin.User;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/users")]
public class UserAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public UserAdminController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET LIST
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .OrderByDescending(u => u.CreateAt)
            .Select(u => new UserListDto
            {
                UserId = u.UserId,
                UserName = u.UserName,
                FullName = u.FullName,
                Avatar = u.Avatar,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                RoleName = u.Role.RoleName,
                IsLocked = u.IsLocked
            })
            .ToListAsync();

        return Ok(users);
    }

    //// CREATE
    //[HttpPost]
    //public async Task<IActionResult> Create([FromForm] CreateUserDto dto, IFormFile? avatar)
    //{
    //    if (await _context.Users.AnyAsync(x => x.Email == dto.Email))
    //        return BadRequest("Email đã tồn tại");

    //    string? fileName = null;
    //    if (avatar != null)
    //    {
    //        var folder = Path.Combine(_env.WebRootPath, "avatars");
    //        Directory.CreateDirectory(folder);

    //        fileName = Guid.NewGuid() + Path.GetExtension(avatar.FileName);
    //        var path = Path.Combine(folder, fileName);

    //        using var stream = new FileStream(path, FileMode.Create);
    //        await avatar.CopyToAsync(stream);
    //    }

    //    var user = new User
    //    {
    //        UserName = dto.UserName,
    //        FullName = dto.FullName,
    //        Email = dto.Email,
    //        PhoneNumber = dto.PhoneNumber,
    //        Address = dto.Address,
    //        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
    //        RoleId = dto.RoleId,
    //        Avatar = fileName
    //    };

    //    _context.Users.Add(user);
    //    await _context.SaveChangesAsync();
    //    return Ok();
    //}

    // UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateUserDto dto, IFormFile? avatar)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.FullName = dto.FullName;
        user.PhoneNumber = dto.PhoneNumber;
        user.Address = dto.Address;
        user.RoleId = dto.RoleId;
        user.IsLocked = dto.IsLocked;
        user.LockReason = dto.LockReason;

        if (avatar != null)
        {
            var folder = Path.Combine(_env.WebRootPath, "avatars");
            Directory.CreateDirectory(folder);

            if (!string.IsNullOrEmpty(user.Avatar))
            {
                var old = Path.Combine(folder, user.Avatar);
                if (System.IO.File.Exists(old)) System.IO.File.Delete(old);
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(avatar.FileName);
            var path = Path.Combine(folder, fileName);

            using var stream = new FileStream(path, FileMode.Create);
            await avatar.CopyToAsync(stream);

            user.Avatar = fileName;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // TOGGLE LOCK
    [HttpPatch("{id}/lock")]
    public async Task<IActionResult> ToggleLock(int id, [FromBody] LockUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsLocked = true;
        user.LockReason = dto.LockReason;

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{id}/unlock")]
    public async Task<IActionResult> Unlock(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsLocked = false;
        user.LockReason = null;

        await _context.SaveChangesAsync();
        return Ok();
    }

}
