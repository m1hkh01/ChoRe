using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required(ErrorMessage = "Tên vai trò là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên vai trò không được vượt quá 50 ký tự")]
        public string RoleName { get; set; }

        // Navigation properties
        public virtual ICollection<User> Users { get; set; }
    }
}
