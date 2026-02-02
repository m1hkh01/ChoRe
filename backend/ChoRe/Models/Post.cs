using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class Post
    {
        [Key]
        public int PostId { get; set; }

        [ForeignKey("User")]
        [Required(ErrorMessage = "Người đăng là bắt buộc")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tiêu đề không được vượt quá 200 ký tự")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        [StringLength(5000, ErrorMessage = "Mô tả không được vượt quá 5000 ký tự")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        [StringLength(50)]
        public string Status { get; set; }

        [Required(ErrorMessage = "Kiểu giá là bắt buộc")]
        [StringLength(20)]
        public string PriceType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxPrice { get; set; }

        [Required(ErrorMessage = "Địa chỉ là bắt buộc")]
        [StringLength(255)]
        public string Address { get; set; }

        [ForeignKey("PostStatusNavigation")]
        public int PostStatusId { get; set; } = 1;

        [ForeignKey("ApprovedByUser")]
        public int? ApprovedBy { get; set; }

        public DateTime? ApprovedAt { get; set; }

        [ForeignKey("RejectedByUser")]
        public int? RejectedBy { get; set; }

        public DateTime? RejectedAt { get; set; }

        [StringLength(500)]
        public string? RejectReason { get; set; } = "";

        public int ViewCount { get; set; } = 0;
        public int SavedCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("Brand")]
        public int? BrandId { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual User ApprovedByUser { get; set; }
        public virtual User RejectedByUser { get; set; }
        public virtual ICollection<PostCate> PostCates { get; set; }
        public virtual Brand Brand { get; set; }
        public virtual PostStatus PostStatusNavigation { get; set; }
        public virtual ICollection<PostImage> PostImages { get; set; }
        public virtual ICollection<SavedPost> SavedPosts { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<PostSpecification> PostSpecifications { get; set; }
        public virtual ICollection<EscrowTransation> EscrowTransations { get; set; }
        public virtual ICollection<PostReport> Reports { get; set; }
        public virtual ICollection<ChatRoom> ChatRooms { get; set; }
    }
}