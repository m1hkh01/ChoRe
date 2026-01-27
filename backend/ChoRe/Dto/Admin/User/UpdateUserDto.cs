using System.ComponentModel.DataAnnotations;

public class UpdateUserDto
{
    public string FullName { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public int RoleId { get; set; }
    public bool IsLocked { get; set; }
    public string? LockReason { get; set; }
}
