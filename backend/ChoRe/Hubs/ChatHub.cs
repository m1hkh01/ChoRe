using ChoRe.Data;
using ChoRe.Dto;
using ChoRe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

[Authorize]
public class ChatHub : Hub
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContext;

    public ChatHub(AppDbContext context, IHttpContextAccessor httpContext)
    {
        _context = context;
        _httpContext = httpContext;
    }
    public async Task JoinConversation(string conversationId)
    {

        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        // Lấy message history
        int userId = int.Parse(_httpContext.HttpContext?
            .User.FindFirst("UserId")?.Value ?? "0");

        var messages = await _context.ChatRooms
            .Include(c => c.Buyer)
            .Include(c => c.Seller)
            .Include(c => c.Post)
            .Include(c => c.ChatMessages)
            .Where(c => c.ChatRoomId == int.Parse(conversationId))
            .Select(c => new ConversationMessageDto
            {
                SenderName = c.Buyer != null && c.Buyer.UserId == userId ? c.Buyer.UserName : (c.Seller != null ? c.Seller.UserName : "") ?? "",
                SenderAvatar = c.Buyer != null && c.Buyer.UserId == userId ? c.Buyer.Avatar : (c.Seller != null ? c.Seller.Avatar : "") ?? "",
                ChatMessages = c.ChatMessages != null ? c.ChatMessages.Select(cm => new MessageDto
                {
                    FromUserId = cm.FromUserId,
                    ChatContent = cm.ChatContent,
                    CreateAt = cm.CreateAt,
                    MessageType = cm.MessageType,
                    MessageImages = cm.MessageImages
                        .Select(img => new MessageImageDto
                        {
                            ImageUrl = img.ImageUrl
                        }).ToList()
                }).ToList() : new List<MessageDto>(),
                PostInfo = c.Post != null ? new PostConvertationDto
                {
                    PostTitle = c.Post.Title,
                    PostPrice = c.Post.Price,
                    PostImageUrl = c.Post.PostImages != null && c.Post.PostImages.Count > 0 ? c.Post.PostImages.First().ToString() : null
                } : null

            }).FirstOrDefaultAsync();

        // Trả về cho người vừa join
        await Clients.Caller.SendAsync(
            "LoadConversationMessages",
            messages
        );
    }

    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
    }

    public async Task SendMessage(
        string conversationId,
        string content,
        string[]? imageUrls,
        bool isTransation,
        TransactionDto? transactionDto
    )
    {

        try
        {
            Console.WriteLine("Dang tao tin nhan AAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
            var senderIdString = Context.UserIdentifier ?? _httpContext.HttpContext?.User.FindFirst("UserId")?.Value;
            if (!int.TryParse(senderIdString, out var senderId)) senderId = 0;

            var chatRoomId = int.TryParse(conversationId, out var r) ? r : 0;

            // Tạo chat message
            var chatMessage = new ChatMessage
            {
                ChatRoomId = chatRoomId,
                FromUserId = senderId,
                ChatContent = content ?? string.Empty,
                CreateAt = DateTime.Now,
                MessageType = isTransation ? "Transaction" : "Text",
                MessageImages = new List<MessageImage>()
            };

            // Tạo giao dịch trung gian nếu có
            if (isTransation && transactionDto != null)
            {
                var platformFee = transactionDto.PlatformFee > 0
                    ? transactionDto.PlatformFee
                    : Math.Round(transactionDto.Amount * 0.05M);

                var escrowTrans = new EscrowTransation
                {
                    BuyerUserId = transactionDto.BuyerId,
                    SellerUserId = transactionDto.SellerId,
                    PostId = transactionDto.PostId,
                    TotalAmount = transactionDto.Amount + platformFee,
                    PostPrice = transactionDto.Amount,
                    PlatformFee = platformFee,
                    EscrowTransStatusId = 1, // Chờ 2 bên xác nhận
                    CreateAt = DateTime.Now,
                    ExpiredAt = DateTime.Now.AddHours(24),
                    BuyerConfirmed = transactionDto.BuyerConfirmed,
                    SellerConfirmed = transactionDto.SellerConfirmed
                };

                chatMessage.EscrowTransation = escrowTrans;
            }

            // Lưu ảnh nếu có
            if (imageUrls != null && imageUrls.Length > 0)
            {
                foreach (var img in imageUrls)
                {
                    if (string.IsNullOrWhiteSpace(img)) continue;
                    chatMessage.MessageImages.Add(new MessageImage
                    {
                        ImageUrl = img
                    });
                }
            }

            _context.ChatMessages.Add(chatMessage);

            // Cập nhật tin nhắn mới nhất
            var chatRoom = await _context.ChatRooms.FindAsync(chatRoomId);
            if (chatRoom != null)
            {
                chatRoom.LastMessageAt = DateTime.Now;
                chatRoom.LastMessageContent = isTransation ? "Giao dịch trung gian" : content;
                _context.ChatRooms.Update(chatRoom);
            }

            // Lưu và broadcast
            await _context.SaveChangesAsync();

            // Gửi tin nhắn / giao dịch về client
            if (isTransation && chatMessage.EscrowTransation != null)
            {
                await Clients.Group(conversationId).SendAsync(
                    "ReceiveMessage",
                    new
                    {
                        FromUserId = senderId,
                        ChatContent = "Giao dịch trung gian",
                        MessageType = "Transaction",
                        CreatedAt = chatMessage.CreateAt,
                        Transaction = new
                        {
                            escrowTransId = chatMessage.EscrowTransation.EscrowTransId,
                            buyerUserId = chatMessage.EscrowTransation.BuyerUserId,
                            sellerUserId = chatMessage.EscrowTransation.SellerUserId,
                            postId = chatMessage.EscrowTransation.PostId,
                            totalAmount = chatMessage.EscrowTransation.TotalAmount,
                            postPrice = chatMessage.EscrowTransation.PostPrice,
                            platformFee = chatMessage.EscrowTransation.PlatformFee,
                            escrowTransStatusId = chatMessage.EscrowTransation.EscrowTransStatusId,
                            buyerConfirmed = chatMessage.EscrowTransation.BuyerConfirmed,
                            sellerConfirmed = chatMessage.EscrowTransation.SellerConfirmed,
                            createAt = chatMessage.EscrowTransation.CreateAt,
                            expiredAt = chatMessage.EscrowTransation.ExpiredAt,
                        }
                    }
                );
            }
            else
            {
                await Clients.Group(conversationId).SendAsync(
                    "ReceiveMessage",
                    new
                    {
                        FromUserId = senderId,
                        ChatContent = content,
                        MessageType = "Text",
                        ImageUrls = imageUrls ?? Array.Empty<string>(),
                        CreatedAt = chatMessage.CreateAt,
                    }
                );
            }
        }
        catch (Exception err)
        {
            Console.WriteLine("Co loi xay ra: " + err);
        }
    }
}
