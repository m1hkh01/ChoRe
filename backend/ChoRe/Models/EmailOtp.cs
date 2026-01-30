public class EmailOtp
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string OtpCode { get; set; } = null!;
    public DateTime ExpiredAt { get; set; }
    public bool IsUsed { get; set; } = false;
}
