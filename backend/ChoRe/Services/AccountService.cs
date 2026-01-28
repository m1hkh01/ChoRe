using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ChoRe.Data;
using ChoRe.Models;
using Ganss.Xss;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class AccountService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly HtmlSanitizer _sanitizer;
    public AccountService(AppDbContext context, IConfiguration configuration, HtmlSanitizer sanitizer)
    {
        _context = context;
        _configuration = configuration;
        _sanitizer = sanitizer;
    }
    public async Task<User> Register(User user)
    {
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, user.PasswordHash);
        user.Address = _sanitizer.Sanitize(user.Address);
        user.Email = _sanitizer.Sanitize(user.Email);
        user.RoleId = 3;
        user.UserSubscription = new UserSubscription
        {
            SubPlanId = 1,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(30),
            IsActive = true
        };
        user.UserSubUsage = new UserSubUsage
        {
            RemainingSubFPF = 0,
            RemainingSubPost = 4,
            RemainingFreePost = 2,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
    public async Task<string> Login(User user)
    {
        var claims = new[]
          {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new Claim("UserId", user.UserId.ToString()),
            new Claim("UserName", user.UserName),
            new Claim("UserEmail", user.Email),
            new Claim(ClaimTypes.Role, user.Role.RoleName)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: signIn
        );
        return new JwtSecurityTokenHandler().WriteToken(token);

    }
    public bool CheckPassword(User user, string password)
    {
        var hasher = new PasswordHasher<User>();

        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result == PasswordVerificationResult.Failed)
        {
            return false;
        }
        return true;
    }
    public async Task<User?> CheckMail(string email)
    {
        return await _context.Users.Include(u=>u.Role).FirstOrDefaultAsync(u => u.Email == email);
    }
}