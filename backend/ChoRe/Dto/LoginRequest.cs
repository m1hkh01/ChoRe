using System.ComponentModel.DataAnnotations;

public class LoginRequest
{
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    [Required]
    public string Email { set; get; }
    [Required]
    public string PasswordHash{ set; get; }
}