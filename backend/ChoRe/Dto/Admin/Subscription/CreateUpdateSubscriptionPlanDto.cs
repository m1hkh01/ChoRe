using System.ComponentModel.DataAnnotations;
using ChoRe.Models;

public class CreateUpdateSubscriptionPlanDto
{
    [Required(ErrorMessage = "Tên gói là bắt buộc")]
    [StringLength(100)]
    public string SubPlanName { get; set; }

    public string SubPlanTitle { get; set; }

    public string? SubPlanPromo { get; set; }

    [Required(ErrorMessage = "Giá gói là bắt buộc")]
    [Range(0, double.MaxValue)]
    public decimal SubPlanPrice { get; set; }

    [Required(ErrorMessage = "Thời gian của gói là bắt buộc")]
    [Range(1, int.MaxValue)]
    public int DurationDays { get; set; }

    [Required(ErrorMessage = "Số bài đăng tối đa là bắt buộc")]
    [Range(0, int.MaxValue)]
    public int MaxPostPerSub { get; set; }
    [Range(0, int.MaxValue)]
    public int MaxFreePost { get; set; }
    [Range(0, int.MaxValue)]
    public int MaxFreePlatformFeePerSub { get; set; }

    [Range(0, 4)]
    public FeaturedTier FeaturedPriority { get; set; }

    [Range(0, int.MaxValue)]
    public int MaxFeaturedPosts { get; set; }
    [Range(0, int.MaxValue)]
    public int FeaturedDurationDays { get; set; }
}