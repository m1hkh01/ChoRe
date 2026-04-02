using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public interface IConvertationService
{
    Task CreateConversationAsync(ConversationDto dto);
    Task<List<ConversationDto>> GetAllConversationsByUserIdAsync(int userId);
}
public class ConvertationService : IConvertationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public ConvertationService(AppDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
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
        
        
        var room = await _context.ChatRooms
            .Include(c => c.Post)
                .ThenInclude(p => p.PostImages)
            .Include(c => c.Buyer)
            .Include(c => c.Seller)
            .FirstOrDefaultAsync(c => c.ChatRoomId == conversation.ChatRoomId);

        await _hubContext.Clients.Users(
            dto.BuyerId.ToString(),
            dto.SellerId.ToString()
        ).SendAsync("NewConversationCreated", new ConversationMessageDto
        {
            BuyerId = room.BuyerId,
            SellerId = room.SellerId,
            IsActive = room.IsActive,
            SenderName = room.Buyer != null && room.Buyer.UserId != dto.SenderId ? room.Buyer.UserName : (room.Seller != null ? room.Seller.UserName : "") ?? "",
            SenderAvatar = room.Buyer != null && room.Buyer.UserId != dto.SenderId ? room.Buyer.Avatar : (room.Seller != null ? room.Seller.Avatar : "") ?? "",
            ChatMessages = room.ChatMessages != null ? room.ChatMessages.Select(cm => new MessageDto
            {
                FromUserId = cm.FromUserId,
                ChatContent = cm.ChatContent,
                CreateAt = cm.CreateAt,
                MessageType = cm.MessageType,
                MessageImages = cm.MessageImages
                    .Select(img => new MessageImageDto
                    {
                        ImageUrl = img.ImageUrl
                    }).ToList(),
                Transaction = cm.EscrowTransation != null ? new TransactionDto
                {
                    TransactionId = cm.EscrowTransation.EscrowTransId,
                    ChatRoomId = cm.ChatRoomId,
                    BuyerId = cm.EscrowTransation.BuyerUserId,
                    SellerId = cm.EscrowTransation.SellerUserId,
                    // postId = chatMessage.EscrowTransation.PostId,
                    Amount = cm.EscrowTransation.TotalAmount,
                    PostPrice = cm.EscrowTransation.PostPrice,
                    PlatformFee = cm.EscrowTransation.PlatformFee,
                    Status = cm.EscrowTransation.EscrowTransStatus.StatusName,
                    StatusDescription = cm.EscrowTransation.EscrowTransStatus.Description,
                    BuyerConfirmed = cm.EscrowTransation.BuyerConfirmed,
                    SellerConfirmed = cm.EscrowTransation.SellerConfirmed,
                    ExpiredAt = cm.EscrowTransation.ExpiredAt,
                    TransactionOrderCode = cm.EscrowTransation.TransactionOrderCode,
                } : new TransactionDto()
            }).ToList() : new List<MessageDto>(),
            PostInfo = room.Post != null ? new PostConvertationDto
            {
                PostId = room.PostId,
                PostTitle = room.Post.Title,
                PostPrice = room.Post.Price,
                MinPrice = room.Post.MinPrice,
                MaxPrice = room.Post.MaxPrice,
                PriceType = room.Post.PriceType,
                PostImageUrl = room.Post.PostImages != null && room.Post.PostImages.Count > 0 ? room.Post.PostImages.First().PostImage1.ToString() : null,
                UserId = room.SellerId
            } : null

        });

    }

    public async Task<List<ConversationDto>> GetAllConversationsByUserIdAsync(int userId)
    {
        var conversations = await _context.ChatRooms
            .Include(c => c.Buyer)
            .Include(c => c.Seller)
            .Include(c => c.Post)
            .ThenInclude(p => p.PostImages)
            .Where(c => c.BuyerId == userId || c.SellerId == userId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreateAt)
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