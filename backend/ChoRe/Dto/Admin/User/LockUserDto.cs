using System.ComponentModel.DataAnnotations;

namespace ChoRe.Dto.Admin.User
{
    public class LockUserDto
    {
        [Required]
        public string LockReason { get; set; }
    }

}
