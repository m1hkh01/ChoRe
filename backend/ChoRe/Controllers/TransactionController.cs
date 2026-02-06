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

    [HttpGet("escrow-status")]
    public async Task<IActionResult> GetTransactionStatuses()
    {
        var statuses = await _transactionService.GetStatusesAsync(false);
        return Ok(statuses);
    }
    [HttpGet("service-status")]
    public async Task<IActionResult> GetServiceStatuses()
    {
        var statuses = await _transactionService.GetStatusesAsync(false, false);
        return Ok(statuses);
    }

    [HttpPost("escrow/{id:int}")]
    public async Task<IActionResult> GetEscrowTransactionById(int id,[FromBody] EscrowTransactionFilterRequest req)
    {
        var transaction = await _transactionService.GetEscrowTransationByIdAsync(id, req);
        if (transaction == null) return NotFound();

        return Ok(transaction);
    }
    [HttpPost("service/{id:int}")]
    public async Task<IActionResult> GetServiceTransactionById(int id,[FromBody] EscrowTransactionFilterRequest req)
    {
        var transaction = await _transactionService.GetServiceTransationByIdAsync(id, req);
        if (transaction == null) return NotFound();

        return Ok(transaction);
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
