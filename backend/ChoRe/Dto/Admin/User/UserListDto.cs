using System.ComponentModel.DataAnnotations;

public class UserListDto
{
    public int UserId { get; set; }
    public string FullName { get; set; }
    public string UserName { get; set; }
    public string? Avatar { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string RoleName { get; set; }
    public bool IsLocked { get; set; }
}
