using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using ChoRe.Data;
using ChoRe.Models;
using ChoRe.Dto;
using Ganss.Xss;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class AccountService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly HtmlSanitizer _sanitizer;
    private readonly ILogger<AccountService> _logger;
    private readonly ISendMailService _mailService;
    public AccountService(AppDbContext context, IConfiguration configuration, HtmlSanitizer sanitizer, ILogger<AccountService> logger, ISendMailService mailService)
    {
        _context = context;
        _configuration = configuration;
        _sanitizer = sanitizer;
        _logger = logger;
        _mailService = mailService;
    }
    public async Task VertifyOtpCode(string email, string otpCode)
    {
        var emailOtp = await _context.EmailOtps
            .Where(e => e.Email == email
                        && e.OtpCode == otpCode
                        && !e.IsUsed
                        && e.ExpiredAt > DateTime.Now)
            .FirstOrDefaultAsync();

        if (emailOtp == null)
        {
            throw new Exception("Mã OTP không hợp lệ hoặc đã hết hạn.");
        }

        // Xoá mã OTP sau khi xác thực thành công
        _context.EmailOtps.Remove(emailOtp);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ValidateOtpCode(string email, string otpCode)
    {
        var emailOtp = await _context.EmailOtps
            .Where(e => e.Email == email
                        && e.OtpCode == otpCode
                        && !e.IsUsed
                        && e.ExpiredAt > DateTime.Now)
            .FirstOrDefaultAsync();

        return emailOtp != null;
    }

    public async Task ResetPassword(string email, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            throw new Exception("Người dùng không tồn tại");
        }
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, newPassword);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<string> SendOtpCode(string email)
    {
        var otpCode = _mailService.GenerateOtp();
        var emailOtp = new EmailOtp
        {
            Email = email,
            OtpCode = otpCode,
            ExpiredAt = DateTime.Now.AddMinutes(2),
            IsUsed = false
        };
        _context.EmailOtps.Add(emailOtp);
        await _context.SaveChangesAsync();

        string html = $"<p>Mã OTP của bạn là: <strong>{otpCode}</strong></p><p>Mã có hiệu lực trong 10 phút.</p>";
        string subject = "Mã OTP xác thực email đăng ký tài khoản ChoRe";

        await _mailService.SendEmailAsync(email, subject, html);
        return otpCode;
    }
    public async Task<User> Register(RegisterDto dto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new EmailAlreadyExistsException(dto.Email);
        }
        await VertifyOtpCode(dto.Email, dto.OtpCode);
        // await _mailService.SendEmailAsync("nhatnctb00456@fpt.edu.vn", "Chào mừng đến với ChoRe", "<h1>Đăng ký tài khoản thành công!</h1><p>Cảm ơn bạn đã đăng ký tài khoản tại ChoRe.</p>");
        var hasher = new PasswordHasher<User>();
        var user = new User
        {
            UserName = dto.UserName,
            FullName = dto.FullName,
            Email = dto.Email,
            Address = dto.Address ?? "",
            PasswordHash = hasher.HashPassword(new User(), dto.Passwordhash)
        };

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
    // internal helper used by both login and refresh routines
    private string GenerateJwtToken(User user)
    {
        var claims = new[]
          {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim("UserId", user.UserId.ToString()),
            new Claim("UserName", user.UserName),
            new Claim("UserEmail", user.Email),
            new Claim(ClaimTypes.Role, user.Role?.RoleName ?? "User")
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

    private RefreshToken GenerateRefreshToken()
    {
        using var rng = RandomNumberGenerator.Create();
        var randomBytes = new byte[64];
        rng.GetBytes(randomBytes);
        var token = Convert.ToBase64String(randomBytes);

        return new RefreshToken
        {
            Token = token,
            Expires = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };
    }

    public async Task<AuthResponse> Login(User user)
    {
        // generate access token
        var jwt = GenerateJwtToken(user);

        // create and persist refresh token
        var refreshToken = GenerateRefreshToken();
        refreshToken.UserId = user.UserId;
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new AuthResponse { Token = jwt, RefreshToken = refreshToken.Token };
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
        return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);
    }

    /// <summary>
    /// Validate an incoming refresh token, rotate it and return a fresh pair of tokens.
    /// </summary>
    public async Task<AuthResponse?> RefreshToken(string token)
    {
        var existing = await _context.RefreshTokens
            .Include(rt => rt.User)
            .ThenInclude(u => u.Role)
            .SingleOrDefaultAsync(rt => rt.Token == token);

        if (existing == null || existing.IsRevoked || DateTime.UtcNow >= existing.Expires)
            return null;

        // revoke the old token
        existing.IsRevoked = true;
        await _context.SaveChangesAsync();

        // issue new refresh token
        var newToken = GenerateRefreshToken();
        newToken.UserId = existing.UserId;

        _context.RefreshTokens.Add(newToken);
        await _context.SaveChangesAsync();

        var jwt = GenerateJwtToken(existing.User!);
        return new AuthResponse { Token = jwt, RefreshToken = newToken.Token };
    }

    /// <summary>
    /// Explicitly revoke a refresh token (logout).
    /// </summary>
    public async Task<bool> RevokeRefreshToken(string token, string? ipAddress)
    {
        var existing = await _context.RefreshTokens.SingleOrDefaultAsync(rt => rt.Token == token);
        if (existing == null || existing.IsRevoked)
            return false;

        existing.IsRevoked = true;
        await _context.SaveChangesAsync();
        return true;
    }
}