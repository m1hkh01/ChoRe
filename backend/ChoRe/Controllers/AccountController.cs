using System.Threading.Tasks;
using ChoRe.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/account")]
public class AccountController : ControllerBase
{
    private readonly AccountService _service;
    public AccountController(AccountService service)
    {
        _service = service;
    }
    [HttpPost("/register")]
    public async Task<IActionResult> Register(User newUser)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _service.Register(newUser);
            if (user == null)
            {
                return BadRequest(new { Error = "Đăng ký không thành công" });
            }
            return Ok(new { message = "Đăng ký thành công" });
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
            Avatar = user.Avatar,
            Email = user.Email,
            Role = user.Role.RoleName
        };
        return Ok(new { message = "Đăng nhập thành công", token, userDto });
    }
}