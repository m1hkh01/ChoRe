namespace ChoRe.DTOs.Profile
{
    public class ProfileDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = "";
        public string FullName { get; set; } = "";
        public string? Avatar { get; set; }
        public string Address { get; set; } = "";
        public DateTime CreateAt { get; set; }
        public int TotalPosts { get; set; }
        public double AvgRating { get; set; }
        public int TotalRatings { get; set; }
        // null nếu không phải chính chủ
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? FullName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
    }

    public class ChangePasswordDto
    {
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
    public class PostCardDto
    {
        public int PostId { get; set; }
        public string? Title { get; set; }
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? PriceType { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Address { get; set; }
        public string? Status { get; set; }
        public int? PostStatusId { get; set; }
        public DateTime CreateAt { get; set; }
        public string? Thumbnail { get; set; }   // ← thêm
        public string? UserName { get; set; }   // ← thêm
    }
    public class RatingDto
    {
        public int RatingId { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
        public DateTime CreateAt { get; set; }
        public int RaterUserId { get; set; }
        public string RaterFullName { get; set; } = "";
        public string? RaterAvatar { get; set; }
    }

    public class PagedDto<T>
    {
        public PagedDto(List<T> items, int total, int page, int pageSize)
        {
            Items = items;
            Total = total;
            Page = page;
            PageSize = pageSize;
            HasNext = page * pageSize < total;
        }
        public List<T> Items { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool HasNext { get; set; }
    }
}