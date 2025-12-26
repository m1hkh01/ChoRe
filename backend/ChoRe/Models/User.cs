using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoRe.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        // ================== THÔNG TIN CƠ BẢN ==================

        [Required(ErrorMessage = "Họ tên không được để trống")]
        [MaxLength(150, ErrorMessage = "Họ tên tối đa 150 ký tự")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        [MaxLength(150)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [RegularExpression(@"^(0|\+84)[0-9]{9}$",
            ErrorMessage = "Số điện thoại không hợp lệ")]
        [MaxLength(20)]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [MinLength(8, ErrorMessage = "Mật khẩu tối thiểu 8 ký tự")]
        public string PasswordHash { get; set; }

        // ================== PHÂN QUYỀN ==================

        [Required]
        public int RoleId { get; set; }

        [ForeignKey(nameof(RoleId))]
        public Role Role { get; set; }

        // ================== XÁC MINH DANH TÍNH ==================

        public bool IsEmailVerified { get; set; } = false;
        public bool IsPhoneVerified { get; set; } = false;

        [MaxLength(20)]
        [RegularExpression(@"^[0-9]{9,12}$",
            ErrorMessage = "CCCD không hợp lệ")]
        public string CitizenIdNumber { get; set; }

        [Url(ErrorMessage = "Đường dẫn ảnh CCCD không hợp lệ")]
        public string CitizenIdFrontImage { get; set; }

        [Url(ErrorMessage = "Đường dẫn ảnh CCCD không hợp lệ")]
        public string CitizenIdBackImage { get; set; }

        public bool IsIdentityVerified { get; set; } = false;

        // ================== UY TÍN ==================

        [Range(0, 5, ErrorMessage = "Điểm đánh giá phải từ 0 đến 5")]
        public double RatingAverage { get; set; } = 0;

        [Range(0, int.MaxValue)]
        public int RatingCount { get; set; } = 0;

        [Range(0, int.MaxValue)]
        public int SuccessfulTransactions { get; set; } = 0;

        // ================== THỜI GIAN ==================

        [Required]
        public DateTime JoinedAt { get; set; } = DateTime.Now;

        public DateTime? LastActiveAt { get; set; }

        // ================== TRẠNG THÁI ==================

        public bool IsBanned { get; set; } = false;

        [MaxLength(255)]
        public string BanReason { get; set; }
    }
}
