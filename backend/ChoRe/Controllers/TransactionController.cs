using System.Transactions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/transaction")]
public class TransactionController : ControllerBase
{
    private readonly IEscrowTransactionService _transactionService;
    private readonly IHubContext<ChatHub> _hubContext;
    public TransactionController(IEscrowTransactionService transactionService, IHubContext<ChatHub> hubContext)
    {
        _transactionService = transactionService;
        _hubContext = hubContext;
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTransactionById(int id)
    {
        var transaction = await _transactionService.GetTransationByIdAsync(id);
        if (transaction == null) return NotFound();

        return Ok(new TransactionDto
        {
            TransactionId = transaction.EscrowTransId,
            ChatRoomId = transaction.ChatMessage.ChatRoomId,
            BuyerId = transaction.BuyerUserId,
            SellerId = transaction.SellerUserId,
            PostId = transaction.PostId,
            Amount = transaction.TotalAmount,
            PostPrice = transaction.PostPrice,
            PlatformFee = transaction.PlatformFee,
            Status = transaction.EscrowTransStatus.StatusName,
            StatusDescription = transaction.EscrowTransStatus.Description,
            ExpiredAt = transaction.ExpiredAt,
            TransactionOrderCode = transaction.TransactionOrderCode,
        });
    }
    [HttpPost("pay")]
    public async Task<IActionResult> PayTransaction([FromBody] PayOrderRequest rq)
    {
        try
        {
            var transaction = await _transactionService.PayTransaction(rq);
            if (transaction != null)
            {
                await _hubContext.Clients.Group(rq.ChatRoomId!).SendAsync(
                    "UpdateTransaction",
                    new
                    {
                        MessageType = "Transaction",
                        Transaction = new TransactionDto
                        {
                            TransactionId = transaction.EscrowTransId,
                            Status = transaction.EscrowTransStatus.StatusName,
                            StatusDescription = transaction.EscrowTransStatus.Description,
                        }
                    }
                );
            }
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Có lỗi xảy ra : " + ex.Message });
        }
    }
}
