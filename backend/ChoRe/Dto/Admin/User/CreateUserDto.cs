using System.ComponentModel.DataAnnotations;

public class CreateUserDto
{
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string Password { get; set; }
    public int RoleId { get; set; }
}
