using System.Security.Claims;
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
    public async Task<IActionResult> GetEscrows(int id,[FromBody] EscrowTransactionFilterRequest req)
    {
        var transaction = await _transactionService.GetEscrowsByIdAsync(id, req);
        if (transaction == null) return NotFound();

        return Ok(transaction);
    }
    [HttpPost("service/{id:int}")]
    public async Task<IActionResult> GetServices(int id, [FromBody] EscrowTransactionFilterRequest req)
    {
        var transaction = await _transactionService.GetServicesByIdAsync(id, req);
        if (transaction == null) return NotFound();

        return Ok(transaction);
    }
    
    
    [HttpGet("escrow-pay/{id:int}")]
    public async Task<IActionResult> GetEscrowById(int id)
    {
        var escrow = await _transactionService.GetEscrowByIdAsync(id);
        if (escrow is null)
        {
            return NotFound();
        }
        return Ok(escrow);
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
    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionDto req)
    {
        var transaction = await _transactionService.ConfirmTransaction(req.TransactionId, req.IsBuyer, req.PostPrice, req.UpdatePrice);
        if (transaction is null)
        {
            return NotFound(new { Message = "Đã có lỗi xảy ra vui lòng thử lại sau" });
        }
        return Ok(new { Message = "Xác nhận giao dịch thành công" });
    }
    [HttpPut("reject/{id:int}")]
    public async Task<IActionResult> RejectTransaction(int id)
    {
        await _transactionService.RejectTransaction(id);
        return Ok();
    }
    [HttpPost("refund/{id:int}")]
    public async Task<IActionResult> RefundRequest(int id,[FromBody] RefundRequestDto req)
    {
        await _transactionService.RefundRequest(id, req);
        return Ok();
    }
    [HttpPut("complete/{id:int}")]
    public async Task<IActionResult> CompleteTransaction(int id)
    {
        await _transactionService.CompleteTransaction(id);
        return Ok();
    }
    [HttpPut("refund-confirm/{id:int}")]
    public async Task<IActionResult> RefundConfirmTransaction(int id)
    {
        await _transactionService.RefundConfirmTransaction(id);
        return Ok();
    }
    [HttpPut("refund-reject/{id:int}")]
    public async Task<IActionResult> RefundRejectTransaction(int id)
    {
        await _transactionService.RefundRejectTransaction(id);
        return Ok();
    }
    [HttpPost("refund-system/{id:int}")]
    public async Task<IActionResult> RefundSystemTransaction(int id, List<DisEvidenceDto>? evidence)
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        await _transactionService.RefundSystemTransaction(id, evidence, userId);
        return Ok();
    }
}
