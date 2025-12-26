using System.ComponentModel.DataAnnotations;

namespace ChoRe.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public ICollection<User>? Users { get; set; }
    }
}
