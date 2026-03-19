using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public interface IPostService
{
    Task<List<PostResponseDto>> GetPostsByAsync();
    Task<Post> GetPostByIdAsync(int id);
    Task ApprovePostAsync(int id);
    Task RejectPostAsync(int id, string rejectReason);
    Task DeletePostAsync(int id);
}

public class PostService : IPostService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContext;

    public PostService(AppDbContext context, IHttpContextAccessor httpContext)
    {
        _context = context;
        _httpContext = httpContext;
    }

    public async Task ApprovePostAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        int userId = int.Parse(_httpContext.HttpContext?
            .User.FindFirst("UserId")?.Value ?? "0");

        if (post is null)
            throw new KeyNotFoundException("Bài viết không tồn tại");
        if (userId == 0)
            throw new KeyNotFoundException("Không tìm thấy tài khoản người dùng hiện tại");

        if (post.PostOrderCode != null)
            post.PostStatusId = 7; // PendingPayment
        else
            post.PostStatusId = 2; // Approved

        post.ApprovedAt = DateTime.Now;
        post.ApprovedBy = userId;
        await _context.SaveChangesAsync();
    }

    public async Task<Post> GetPostByIdAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post is null)
            throw new KeyNotFoundException("Không tìm thấy bài viết");
        return post;
    }

    public async Task<List<PostResponseDto>> GetPostsByAsync()
    {
        var posts = await _context.Posts
            .Where(p => p.PostStatusId == 1)
            .Include(p => p.User)
                .ThenInclude(u => u.Role)
            .Include(p => p.Brand)
            .Include(p => p.PostCates)
            .Include(p => p.PostImages)
            .Include(p => p.PostSpecifications)
                .ThenInclude(ps => ps.Specification)
            .Select(p => new PostResponseDto
            {
                PostId = p.PostId,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                Address = p.Address,
                CreatedAt = p.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fff"),

                User = p.User == null ? null : new UserResponseDto
                {
                    UserId = p.User.UserId,
                    UserName = p.User.UserName,
                    Avatar = p.User.Avatar,
                    Email = p.User.Email,
                    Role = p.User.Role != null ? p.User.Role.RoleName : null
                },

                Brand = p.Brand,
                PostCates = p.PostCates,
                PostImages = p.PostImages,
                PostSpecificationsDto = p.PostSpecifications.Select(ps => new PostSpecificationDto
                {
                    SpecValue = ps.SpecValue,
                    SpecName = ps.Specification.SpecName
                }).ToList()
            })
            .ToListAsync();

        return posts;
    }

    public async Task RejectPostAsync(int id, string rejectReason)
    {
        var post = await _context.Posts.FindAsync(id);
        int userId = int.Parse(_httpContext.HttpContext?
            .User.FindFirst("UserId")?.Value ?? "0");

        if (post is null)
            throw new KeyNotFoundException("Bài viết không tồn tại");
        if (userId == 0)
            throw new KeyNotFoundException("Không tìm thấy tài khoản người dùng hiện tại");

        post.PostStatusId = 3;
        post.RejectReason = rejectReason;
        post.RejectedBy = userId;
        post.RejectedAt = DateTime.Now;
        await _context.SaveChangesAsync();
    }

    // ── Xóa bài đăng (Admin) ─────────────────────────────────────────────────
    public async Task DeletePostAsync(int id)
    {
        var post = await _context.Posts
            .Include(p => p.PostImages)
            .Include(p => p.PostSpecifications)
            .Include(p => p.PostCates)
            .Include(p => p.SavedPosts)
            .FirstOrDefaultAsync(p => p.PostId == id);

        if (post is null)
            throw new KeyNotFoundException("Bài viết không tồn tại");

        // Xóa các related data trước để tránh FK constraint
        _context.PostImages.RemoveRange(post.PostImages);
        _context.PostSpecifications.RemoveRange(post.PostSpecifications);
        _context.PostCates.RemoveRange(post.PostCates);
        _context.SavedPosts.RemoveRange(post.SavedPosts);

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
    }
}