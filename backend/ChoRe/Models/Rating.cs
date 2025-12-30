using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }

        [ForeignKey("FromUser")]
        [Required(ErrorMessage = "Người đánh giá là bắt buộc")]
        public int FromUserId { get; set; }

        [ForeignKey("ToUser")]
        [Required(ErrorMessage = "Người được đánh giá là bắt buộc")]
        public int ToUserId { get; set; }

        [Required(ErrorMessage = "Số sao là bắt buộc")]
        [Range(1, 5, ErrorMessage = "Số sao phải từ 1 đến 5")]
        public int Star { get; set; }

        [StringLength(1000, ErrorMessage = "Bình luận không được vượt quá 1000 ký tự")]
        public string Comment { get; set; }

        [StringLength(255)]
        public string? RatingImage { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User FromUser { get; set; }
        public virtual User ToUser { get; set; }
    }
}
