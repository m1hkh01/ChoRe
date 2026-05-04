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

    [HttpPost("{id}/{action}")]
    public async Task<IActionResult> HandleDispute(int id, string action)
    {
        if (action == "approve")
        {
            await _service.RefundConfirmTransaction(id);
            return Ok(new { message = "Đã duyệt yêu cầu hoàn tiền" });
        }
        else if (action == "reject")
        {
            await _service.RefundRejectTransaction(id);
            return Ok(new { message = "Đã từ chối yêu cầu hoàn tiền" });
        }
        return BadRequest(new { error = "Hành động không hợp lệ" });
    }
}
