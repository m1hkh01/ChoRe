using ChoRe.Data;
using ChoRe.Models;
using Microsoft.EntityFrameworkCore;

public interface IReviewService
{
    Task<Review> CreateReviewAsync(CreateReviewRequest request);
    Task<Review> UpdateReviewAsync(int reviewId, UpdateReviewRequest request);
}

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    private const int MAX_FILES = 5;
    private const int MAX_SIZE_MB = 10;
    private const long MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

    public ReviewService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task<Review> CreateReviewAsync(CreateReviewRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5)
            throw new Exception("Rating không hợp lệ");

        // ==============================
        // CASE 1: REVIEW SAU GIAO DỊCH
        // ==============================
        EscrowTransation? transaction = null;
        ChatRoom? chatRoom = null;

        if (request.TransactionId.HasValue)
        {
            transaction = await _context.EscrowTransations
                .FirstOrDefaultAsync(x => x.EscrowTransId == request.TransactionId.Value);

            if (transaction == null)
                throw new Exception("Không tìm thấy giao dịch");

            if (transaction.EscrowTransStatusId != EscrowStatus.Completed)
                throw new Exception("Chỉ được đánh giá khi giao dịch hoàn tất");
        }
        else
        {
            // ==============================
            // CASE 2: REVIEW SAU 60 PHÚT CHAT
            // ==============================

            chatRoom = await _context.ChatRooms
            .Include(c => c.ChatMessages)
                .FirstOrDefaultAsync(c => c.ChatRoomId == request.ChatRoomId);

            if (chatRoom == null)
                throw new Exception("Không tìm thấy phòng chat");

            var chatDuration = (DateTime.Now - chatRoom.CreateAt).TotalMinutes;
            var chatMessageLength = chatRoom.ChatMessages?.Count;
            // Điều kiện 2: phải có tin nhắn từ cả 2 bên
            var distinctUsers = chatRoom?.ChatMessages?
                .Select(m => m.FromUserId)
                .Distinct()
                .Count();

            if (chatDuration < 60 && chatMessageLength <= 20 && distinctUsers < 2)
                throw new Exception("Chỉ được đánh giá sau 60 phút trò chuyện");
        }

        // ==============================
        // CHECK REVIEW TRÙNG
        // ==============================

        var sellerId = request.TransactionId.HasValue ? request.SellerId : chatRoom?.SellerId;
        var PostId = request.TransactionId.HasValue ? request.PostId : chatRoom?.PostId;

        var existed = await _context.Reviews.FirstOrDefaultAsync(r =>
            r.ChatRoomId == request.ChatRoomId &&
            r.ReviewerId == request.ReviewerId &&
            r.SellerId == sellerId);

        if (existed != null)
            throw new Exception("Bạn đã đánh giá rồi");

        var review = new Review
        {
            Rating = request.Rating,
            Comment = request.Comment,
            ReviewType = request.TransactionId.HasValue ? ReviewType.CompletedOrder : ReviewType.ChatOnly,
            OrderId = request.TransactionId,
            ReviewerId = request.ReviewerId,
            SellerId = sellerId ?? 0,
            PostId = PostId ?? 0,
            ChatRoomId = request.ChatRoomId,
            CreatedAt = DateTime.Now,
            ReviewImages = new List<ReviewImage>()
        };
        if (request.Tags != null && request.Tags.Any())
        {
            foreach (var tag in request.Tags.Distinct())
            {
                review.ReviewTags.Add(new ReviewTag
                {
                    Tag = tag.Trim()
                });
            }
        }
        if (transaction != null)
        {
            transaction.IsRated = true;
        }
        // ==============================
        // UPLOAD FILE
        // ==============================

        if (request.Files != null && request.Files.Any())
        {
            if (request.Files.Count > MAX_FILES)
                throw new Exception($"Chỉ được upload tối đa {MAX_FILES} file");

            var uploadPath = Path.Combine(_env.WebRootPath, "uploads/reviews");

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            foreach (var file in request.Files)
            {
                if (file.Length > MAX_SIZE)
                    throw new Exception($"File {file.FileName} vượt quá {MAX_SIZE_MB}MB");

                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                review.ReviewImages.Add(new ReviewImage
                {
                    FileUrl = fileName,
                    FileType = file.ContentType.StartsWith("video") ? "video" : "image"
                });
            }
        }

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return review;
    }
    public async Task<Review> UpdateReviewAsync(int reviewId, UpdateReviewRequest request)
    {
        var review = await _context.Reviews
            .Include(r => r.ReviewTags)
            .Include(r => r.ReviewImages)
            .FirstOrDefaultAsync(r => r.ReviewId == reviewId);

        if (review == null)
            throw new Exception("Không tìm thấy review");

        if (review.ReviewerId != request.ReviewerId)
            throw new Exception("Bạn không có quyền sửa review này");

        if (request.Rating < 1 || request.Rating > 5)
            throw new Exception("Rating không hợp lệ");

        // ======================
        // UPDATE BASIC INFO
        // ======================

        review.Rating = request.Rating;
        review.Comment = request.Comment.Trim();

        // ======================
        // UPDATE TAGS (XOÁ HẾT)
        // ======================

        _context.ReviewTags.RemoveRange(review.ReviewTags);

        if (request.Tags != null && request.Tags.Any())
        {
            review.ReviewTags = request.Tags
                .Distinct()
                .Select(tag => new ReviewTag
                {
                    Tag = tag.Trim()
                })
                .ToList();
        }

        // ======================
        // HANDLE IMAGES
        // ======================

        var existingUrls = request.ExistingImageUrls ?? new List<string>();

        // Xoá ảnh không còn được giữ
        var imagesToRemove = review.ReviewImages
            .Where(img => !existingUrls.Contains(img.FileUrl))
            .ToList();

        foreach (var image in imagesToRemove)
        {
            var filePath = Path.Combine(_env.WebRootPath, "uploads/reviews", image.FileUrl);

            if (File.Exists(filePath))
                File.Delete(filePath);

            _context.ReviewImages.Remove(image);
        }

        // Thêm ảnh mới nếu có
        if (request.Files != null && request.Files.Any())
        {
            var uploadPath = Path.Combine(_env.WebRootPath, "uploads/reviews");

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            foreach (var file in request.Files)
            {
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                review.ReviewImages.Add(new ReviewImage
                {
                    FileUrl = fileName,
                    FileType = file.ContentType.StartsWith("video") ? "video" : "image"
                });
            }
        }

        await _context.SaveChangesAsync();

        return review;
    }
}