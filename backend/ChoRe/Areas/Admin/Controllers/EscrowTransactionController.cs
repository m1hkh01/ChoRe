using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Area("Admin")]
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/transactions")]
public class EscrowTransactionController : ControllerBase
{
    private readonly IEscrowTransactionService _service;

    public EscrowTransactionController(IEscrowTransactionService service)
    {
        _service = service;
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        return Ok(await _service.GetStatusesAsync(true));
    }

    [HttpPost("filter")]
    public async Task<IActionResult> GetList(EscrowTransactionFilterRequest req)
    {
        return Ok(await _service.GetListAsync(req));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
        return Ok(await _service.GetDetailAsync(id));
    }

    [HttpPost("resolve-dispute")]
    public async Task<IActionResult> ResolveDispute(ResolveDisputeRequest req)
    {
        var adminId = int.Parse(User.FindFirst("UserId").Value);
        await _service.ResolveDisputeAsync(req, adminId);
        return Ok();
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var escrow = await _service.GetEscrowByIdAsync(id);
        if (escrow is null)        {
            return NotFound();
        }
        var result = await _service.RefundConfirmTransaction(escrow.DisputeId);
        if (!result)
        {
            return BadRequest(new { message = "Không thể xác nhận hoàn tiền" });
        }
        return Ok(new { message = "Đã duyệt yêu cầu hoàn tiền" });
    }
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var escrow = await _service.GetEscrowByIdAsync(id);
        if (escrow is null)
        {
            return NotFound();
        }
        var result = await _service.RefundRejectTransaction(escrow.DisputeId);
        if (!result)
        {
            return BadRequest(new { message = "Không thể từ chối yêu cầu hoàn tiền" });
        }
        return Ok(new { message = "Đã từ chối yêu cầu hoàn tiền" });
    }
}
