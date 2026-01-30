public class RegisterDto
{
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Address { get; set; }
    public string FullName { get; set; } = null!;
    public string Passwordhash { get; set; } = null!;
    public string? OtpCode { get; set; }
}