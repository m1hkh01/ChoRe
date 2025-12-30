using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class PostStatus
    {
        [Key]
        public int PostStatusId { get; set; }

        [Required(ErrorMessage = "Tên trạng thái là bắt buộc")]
        [StringLength(50)]
        public string PostStatusName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        // Navigation properties
        public virtual ICollection<Post> Posts { get; set; }
    }
}
