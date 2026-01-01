using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public interface IPostService
{
    Task<List<PostResponseDto>> GetPostsByAdminAsync();
    Task<Post> GetPostByIdAsync(int id);
    Task ApprovePostAsync(int id);
    Task RejectPostAsync(int id, string rejectReason);
}
public class PostService : IPostService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContext;
    public PostService(AppDbContext context,IHttpContextAccessor httpContext)
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
        {
            throw new KeyNotFoundException("Bài viết không tồn tại");
        }
        if (userId == 0)
        {
            throw new KeyNotFoundException("Không tìm thấy tài khoản người dùng hiện tại");
        }
        post.PostStatusId = 2;
        post.ApprovedAt = DateTime.Now;
        post.ApprovedBy = userId;
        await _context.SaveChangesAsync();
    }

    public async Task<Post> GetPostByIdAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if(post is null)
        {
            throw new KeyNotFoundException("Không tìm thấy bài viết");
        }
        return post;
    }

    public async Task<List<PostResponseDto>> GetPostsByAdminAsync()
    {
        var posts = await _context.Posts
                            .Where(p => p.PostStatusId == 1).Select(p=>new PostResponseDto
                            {
                                PostId = p.PostId,
                                Title = p.Title,
                                Description = p.Description,
                                Price = p.Price,
                                Address = p.Address,
                                CreatedAt = p.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fff"),
                                User = new UserResponseDto
                                {
                                    UserId = p.User.UserId,
                                    UserName = p.User.UserName,
                                    Avatar = p.User.Avatar,
                                    Email = p.User.Email,
                                    Role = p.User.Role.RoleName
                                },
                                Brand = p.Brand,
                                PostCates = p.PostCates,
                                PostImages = p.PostImages,
                                PostSpecifications = p.PostSpecifications,
                            }).ToListAsync();
        return posts;
    }

    public async Task RejectPostAsync(int id, string rejectReason)
    {
        var post = await _context.Posts.FindAsync(id);
        int userId = int.Parse(_httpContext.HttpContext?
            .User.FindFirst("UserId")?.Value ?? "0");
        if (post is null)
        {
            throw new KeyNotFoundException("Bài viết không tồn tại");
        }
        if (userId == 0)
        {
            throw new KeyNotFoundException("Không tìm thấy tài khoản người dùng hiện tại");
        }
        post.PostStatusId = 3;
        post.RejectReason = rejectReason;
        post.RejectedBy = userId;
        post.RejectedAt = DateTime.Now;
        await _context.SaveChangesAsync();
    }
}