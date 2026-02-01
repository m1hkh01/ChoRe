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
    private readonly IEscrowTransactionService _transactionService;

    public ChatHub(AppDbContext context, IHttpContextAccessor httpContext, IEscrowTransactionService transactionService)
    {
        _context = context;
        _httpContext = httpContext;
        _transactionService = transactionService;
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
                BuyerId = c.BuyerId,
                SellerId = c.SellerId,
                SenderName = c.Buyer != null && c.Buyer.UserId != userId ? c.Buyer.UserName : (c.Seller != null ? c.Seller.UserName : "") ?? "",
                SenderAvatar = c.Buyer != null && c.Buyer.UserId != userId ? c.Buyer.Avatar : (c.Seller != null ? c.Seller.Avatar : "") ?? "",
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
                PostInfo = c.Post != null ? new PostConvertationDto
                {
                    PostId = c.PostId,
                    PostTitle = c.Post.Title,
                    PostPrice = c.Post.Price,
                    PostImageUrl = c.Post.PostImages != null && c.Post.PostImages.Count > 0 ? c.Post.PostImages.First().ToString() : null,
                    UserId = c.SellerId
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

    public async Task<bool> CheckExistingTransaction(int chatRoomId)
    {
        var userIdString = Context.UserIdentifier
            ?? _httpContext.HttpContext?.User.FindFirst("UserId")?.Value;

        if (!int.TryParse(userIdString, out var userId))
            throw new HubException("Không xác định được người dùng");

        // Lấy giao dịch gần nhất trong phòng chat (qua ChatMessage)
        var transaction = await _context.ChatRooms
            .Where(c => c.ChatRoomId == chatRoomId).Select(c=>c.CurrentEscrow)
            .FirstOrDefaultAsync();

        // Chưa từng có giao dịch → OK
        if (transaction == null)
            return true;

        // Các trạng thái ĐƯỢC phép tạo lại
        var reusableStatuses = new[]
        {
        EscrowStatus.Cancelled,
        EscrowStatus.Expired,
        EscrowStatus.Refunded
    };

        if (reusableStatuses.Contains(transaction.EscrowTransStatusId))
            return true;

        // Kiểm tra vai trò
        bool isBuyer = userId == transaction.BuyerUserId;
        bool isSeller = userId == transaction.SellerUserId;

        string message = transaction.EscrowTransStatusId switch
        {
            EscrowStatus.Confirming =>
                isBuyer && !transaction.BuyerConfirmed
                    ? "Đã có giao dịch bạn cần xác nhận giao dịch trước"
                    : isSeller && !transaction.SellerConfirmed
                        ? "Đã có giao dịch bạn cần xác nhận giao dịch trước"
                        : "Đã có giao dịch đang chờ bên còn lại xác nhận",

            EscrowStatus.Pending => "Đã có giao dịch đang chờ thanh toán, không thể tạo thêm",
            EscrowStatus.Paid => "Giao dịch đã được thanh toán, không thể tạo thêm",
            EscrowStatus.Completed => "Giao dịch đã hoàn tất, không thể tạo thêm",
            EscrowStatus.Disputing => "Giao dịch đang tranh chấp, không thể tạo thêm",
            _ => "Không thể tạo giao dịch mới"
        };

        await Clients.Caller.SendAsync("Notification", new
        {
            NotificationMessage = message
        });
        return false;
    }

    public async Task ConfirmEscrow(int transactionId, bool isBuyer)
    {
        try
        {
            var transaction = await _context.EscrowTransations
                                    .Include(t => t.EscrowTransStatus)
                                    .Include(t => t.ChatMessage)
                                    .FirstOrDefaultAsync(t => t.EscrowTransId == transactionId);
            
            if (transaction is null)
            {
                Console.WriteLine("Không tìm thấy giao dịch");
                await Clients.Caller.SendAsync("Notification", new
                {
                    NotificationMessage = "Đã có lỗi xảy ra. Không tìm thấy giao dịch"
                });
                return;
            }
            if (isBuyer)
                transaction.BuyerConfirmed = true;
            else
                transaction.SellerConfirmed = true;
            if(transaction.BuyerConfirmed && transaction.SellerConfirmed)
            {
                transaction.EscrowTransStatusId = 2; // 2 = PendingPayment (Chờ thanh toán);
            }
            await _context.SaveChangesAsync();
            await _context.Entry(transaction)
                .Reference(t => t.EscrowTransStatus)
                .LoadAsync();

            // Gửi giao dịch về Client để cập nhật trạng thái giao dịch
            var chatMessage = transaction.ChatMessage;
            Console.WriteLine("ChatMessage: " + transaction.EscrowTransStatusId);
            await Clients.Group(chatMessage.ChatRoomId.ToString()).SendAsync(
                    "UpdateTransaction",
                    new
                    {
                        FromUserId = chatMessage.FromUserId,
                        MessageType = "Transaction",
                        Transaction = new TransactionDto
                        {
                            TransactionId = transaction.EscrowTransId,
                            ChatRoomId = chatMessage.ChatRoomId,
                            BuyerId = transaction.BuyerUserId,
                            SellerId = transaction.SellerUserId,
                            // postId = chatMessage.EscrowTransation.PostId,
                            Amount = transaction.TotalAmount,
                            PostPrice = transaction.PostPrice,
                            PlatformFee = transaction.PlatformFee,
                            Status = transaction.EscrowTransStatus.StatusName,
                            StatusDescription = transaction.EscrowTransStatus.Description,
                            BuyerConfirmed = transaction.BuyerConfirmed,
                            SellerConfirmed = transaction.SellerConfirmed,
                            ExpiredAt = transaction.ExpiredAt,
                            TransactionOrderCode = transaction.TransactionOrderCode,
                        }
                    }
                );
        }
        catch(Exception e)
        {
            Console.WriteLine("Có lỗi xảy ra khi xác nhận giao dịch: " + e.Message);
        }
    }
    // public async Task<bool> PayTransaction(PayOrderRequest rq, string converstationId)
    // {
    //     try
    //     {
    //         var transaction = await _transactionService.PayTransaction(rq);
    //         if (transaction != null)
    //         {
    //             await Clients.Group(converstationId).SendAsync(
    //                 "UpdateTransaction",
    //                 new
    //                 {
    //                     MessageType = "Transaction",
    //                     Transaction = new TransactionDto
    //                     {
    //                         TransactionId = transaction.EscrowTransId,
    //                         Status = transaction.EscrowTransStatus.StatusName,
    //                         StatusDescription = transaction.EscrowTransStatus.Description,
    //                     }
    //                 }
    //             );
    //             return true;
    //         }
    //         return false;
    //     }
    //     catch(Exception e)
    //     {
    //         Console.WriteLine("Có lỗi xảy ra khi thanh toán: ", e.Message);
    //         return false;

    //     }
    // }
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
            var a = new int[1, 2, 3];
            // Tạo giao dịch trung gian nếu có
            if (isTransation && transactionDto != null)
            {


                var platformFee = transactionDto.PlatformFee > 0
                    ? transactionDto.PlatformFee
                    : Math.Round(transactionDto.Amount * 0.05M);

                var datePart = DateTime.Now.ToString("yyyyMMdd-HHmmss");
                var randomPart = Guid.NewGuid().ToString("N")[..4].ToUpper();
                var orderCode = $"TRANS-{transactionDto.BuyerId + "_" + transactionDto.SellerId}-{datePart}-{randomPart}";

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
                    SellerConfirmed = transactionDto.SellerConfirmed,
                    TransactionOrderCode = orderCode
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
                chatRoom.CurrentEscrow = isTransation ? chatMessage.EscrowTransation : chatRoom.CurrentEscrow;
                _context.ChatRooms.Update(chatRoom);
            }

            // Lưu và broadcast
            await _context.SaveChangesAsync();

            // Gửi tin nhắn / giao dịch về client
            if (isTransation && chatMessage.EscrowTransation != null)
            {
                var transaction = chatMessage.EscrowTransation;
                await Clients.Group(conversationId).SendAsync(
                    "ReceiveMessage",
                    new
                    {
                        FromUserId = senderId,
                        ChatContent = "Giao dịch trung gian",
                        MessageType = "Transaction",
                        CreatedAt = chatMessage.CreateAt,
                        Transaction = new TransactionDto
                        {
                            TransactionId = transaction.EscrowTransId,
                            ChatRoomId = chatMessage.ChatRoomId,
                            BuyerId = transaction.BuyerUserId,
                            SellerId = transaction.SellerUserId,
                            // postId = chatMessage.EscrowTransation.PostId,
                            Amount = transaction.TotalAmount,
                            PostPrice = transaction.PostPrice,
                            PlatformFee = transaction.PlatformFee,
                            Status = "Confirming",
                            StatusDescription = "Chờ xác nhận",
                            BuyerConfirmed = transaction.BuyerConfirmed,
                            SellerConfirmed = transaction.SellerConfirmed,
                            ExpiredAt = transaction.ExpiredAt,
                            TransactionOrderCode = transaction.TransactionOrderCode,
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
