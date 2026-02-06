using ChoRe.Data;
using ChoRe.Models;
using Microsoft.EntityFrameworkCore;

public interface IConvertationService
{
    Task CreateConversationAsync(ConversationDto dto);
    Task<List<ConversationDto>> GetAllConversationsByUserIdAsync(int userId);
}
public class ConvertationService : IConvertationService
{
    private readonly AppDbContext _context;

    public ConvertationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateConversationAsync(ConversationDto dto)
    {
        var existingChat = await _context.ChatRooms
                                .FirstOrDefaultAsync(
                                    c => c.BuyerId == dto.BuyerId &&
                                    c.SellerId == dto.SellerId &&
                                    c.PostId == dto.PostId
                                );
        if(existingChat != null)
        {
            return;
        }

        var conversation = new ChatRoom
        {
            BuyerId = dto.BuyerId,
            SellerId = dto.SellerId,
            PostId = dto.PostId,
            CreateAt = DateTime.Now
        };

        _context.ChatRooms.Add(conversation);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ConversationDto>> GetAllConversationsByUserIdAsync(int userId)
    {
        var conversations = await _context.ChatRooms
            .Include(c => c.Buyer)
            .Include(c => c.Seller)
            .Include(c => c.Post)
            .Where(c => c.BuyerId == userId || c.SellerId == userId)
            .OrderByDescending(c=>c.LastMessageAt)
            .Select(c=> new ConversationDto
            {
                ChatRoomId = c.ChatRoomId,
                BuyerId = c.BuyerId,
                SellerId = c.SellerId,
                PostId = c.PostId,
                LastMessageAt = c.LastMessageAt,
                LastMessageContent = c.LastMessageContent,
                SenderName = c.Buyer != null && c.Buyer.UserId != userId ? c.Buyer.UserName : (c.Seller != null ? c.Seller.UserName : "") ?? "",
                SenderAvatar = c.Buyer != null && c.Buyer.UserId != userId ? c.Buyer.Avatar: (c.Seller != null ? c.Seller.Avatar : "") ?? "",
                PostInfo = c.Post != null ? new PostConvertationDto
                {
                    PostTitle = c.Post.Title,
                    PostPrice = c.Post.Price,
                    PostImageUrl = c.Post.PostImages != null && c.Post.PostImages.Count > 0 ? c.Post.PostImages.First().PostImage1.ToString() : null,
                    UserId = c.SellerId
                } : null
            })
            .ToListAsync();
        return conversations;
    }
}