using Microsoft.AspNetCore.Mvc;

[Area("Admin")]
[ApiController]
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
        return Ok(await _service.GetStatusesAsync());
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
}
