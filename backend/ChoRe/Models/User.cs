using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Tên người dùng là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên người dùng không được vượt quá 50 ký tự")]
        public string UserName { get; set; }

        [StringLength(255)]
        public string? Avatar { get; set; }

        [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(100)]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        [StringLength(15)]
        public string? PhoneNumber { get; set; }

        [StringLength(255)]
        public string Address { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public string PasswordHash { get; set; }

        [ForeignKey("Role")]
        public int RoleId { get; set; }

        // [StringLength(12, ErrorMessage = "Số CMND/CCCD không hợp lệ")]
        // public string? CitizenIdNumber { get; set; }

        // [StringLength(255)]
        // public string? CitizenIdFrontImage { get; set; }

        // [StringLength(255)]
        // public string? CitizenIdBackImage { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        public bool IsLocked { get; set; } = false;

        [StringLength(255)]
        public string? LockReason { get; set; }

        // Navigation properties
        public virtual Role? Role { get; set; }
        public virtual ICollection<Post>? Posts { get; set; }
        public virtual ICollection<Rating>? RatingsGiven { get; set; }
        public virtual ICollection<Rating>? RatingsReceived { get; set; }
        //public virtual ICollection<PostReport> ReportsSubmitted { get; set; }
        public virtual ICollection<PostReport>? ReportedPost { get; set; }
        public virtual ICollection<SavedPost>? SavedPosts { get; set; }
        public virtual ICollection<Comment>? Comments { get; set; }
        public virtual ICollection<EscrowTransation>? OrdersAsBuyer { get; set; }
        public virtual ICollection<EscrowTransation>? OrdersAsSeller { get; set; }
        public virtual ICollection<Dispute>? DisputesOpened { get; set; }
        public virtual ICollection<DisputeEvidence>? DisputeEvidences { get; set; }
        public virtual ICollection<ChatRoom>? ChatRoomsUser1 { get; set; }
        public virtual ICollection<ChatRoom>? ChatRoomsUser2 { get; set; }
        public virtual ICollection<ChatMessage>? ChatMessages { get; set; }
        public virtual UserSubscription? UserSubscription { get; set; }
        public virtual UserSubUsage? UserSubUsage { get; set; }
        public virtual ICollection<Review>? Reviews { get; set; }
        public virtual ICollection<Notification>? Notifications { get; set; }

        // stored refresh tokens for rotating refresh flow
        public virtual ICollection<RefreshToken>? RefreshTokens { get; set; }
    }
}
