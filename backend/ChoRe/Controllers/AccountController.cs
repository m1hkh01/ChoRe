using System.Threading.Tasks;
using ChoRe.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/account")]
public class AccountController : ControllerBase
{
    private readonly AccountService _service;
    public string OtpCode { get; set; } = null!;
    public AccountController(AccountService service)
    {
        _service = service;
    }
    [HttpPost("/send-otp")]
    public async Task<IActionResult> SendOtp(SendOtpRequest request)
    {
        try
        {
            OtpCode = await _service.SendOtpCode(request.Email);
            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("/verify-otp")]
    public async Task<IActionResult> VerifyOtp(SendOtpRequest request)
    {
        try
        {
            var valid = await _service.ValidateOtpCode(request.Email, request.OtpCode);
            if (!valid) return BadRequest(new { Error = "Mã OTP không hợp lệ hoặc đã hết hạn." });
            return Ok(new { message = "Mã OTP hợp lệ" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("/reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest dto)
    {
        try
        {
            await _service.VertifyOtpCode(dto.Email, dto.OtpCode);
            await _service.ResetPassword(dto.Email, dto.NewPassword);
            return Ok(new { message = "Đặt lại mật khẩu thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("/register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _service.Register(dto);
            if (user == null)
            {
                return BadRequest(new { Error = "Đăng ký không thành công" });
            }
            return Ok(new { message = "Đăng ký thành công" });
        }
        catch (EmailAlreadyExistsException ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
        catch (Exception err)
        {
            return BadRequest(new { Error = err.Message });
        }

    }
    [HttpPost("/login")]
    public async Task<IActionResult> Login(LoginRequest login)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var user = await _service.CheckMail(login.Email);
        if (user is null)
        {
            return BadRequest(new { Error = "Email không tồn tại, Vui lòng kiểm tra lại email" });
        }
        var isValidPassword = _service.CheckPassword(user, login.PasswordHash);
        if (!isValidPassword)
        {
            return BadRequest(new { Error = "Mật khẩu không đúng, Vui lòng thử lại" });
        }
        var token = await _service.Login(user);
        var userDto = new UserResponseDto
        {
            UserId = user.UserId,
            UserName = user.UserName,
            FullName = user.FullName,
            Avatar = user.Avatar,
            Email = user.Email,
            Role = user.Role.RoleName
        };
        return Ok(new { message = "Đăng nhập thành công", token, userDto });
    }
}